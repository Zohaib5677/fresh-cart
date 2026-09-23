import { supabase } from '@/integrations/supabase/client';

export interface ChatMessage {
  id: string;
  sender_type: 'customer' | 'owner';
  message: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  customer_name: string;
  subject: string;
  status: 'open' | 'closed' | 'resolved';
  last_message_at: string;
  last_message_preview: string;
  messages: ChatMessage[];
}

const STORAGE_KEY = 'snapcart_global_conversations';
const CHANNEL_NAME = 'snapcart_chat_channel';

// Create a BroadcastChannel for instant cross-tab communication
let broadcastChannel: BroadcastChannel | null = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    broadcastChannel = new BroadcastChannel(CHANNEL_NAME);
  }
} catch (e) {
  console.warn('BroadcastChannel not available:', e);
}

export const getStoredConversations = async (forceRemote = false): Promise<Conversation[]> => {
  // 1. Return fast local storage cache unless explicit forceRemote is set
  if (!forceRemote) {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Failed to parse conversations from storage:', e);
    }
  }

  // 2. Fetch live data from Supabase DB only when forced or on missing cache
  try {
    const { data: dbConvs, error: convErr } = await supabase
      .from('conversations')
      .select('*')
      .order('last_message_at', { ascending: false });

    if (!convErr && dbConvs && dbConvs.length > 0) {
      const fullConversations: Conversation[] = [];

      for (const conv of dbConvs) {
        const { data: dbMsgs } = await supabase
          .from('conversation_messages')
          .select('*')
          .eq('conversation_id', conv.id)
          .order('created_at', { ascending: true });

        fullConversations.push({
          id: conv.id,
          customer_name: conv.customer_user_id || 'Customer',
          subject: conv.subject || 'Order Support',
          status: conv.status || 'open',
          last_message_at: conv.last_message_at || conv.created_at,
          last_message_preview: conv.last_message_preview || '',
          messages: (dbMsgs || []).map((m: any) => ({
            id: m.id,
            sender_type: m.sender_type,
            message: m.message,
            created_at: m.created_at,
          })),
        });
      }

      // Sync to local cache
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fullConversations));
      return fullConversations;
    }
  } catch (e) {
    console.warn('Supabase DB fetch fallback to local storage:', e);
  }

  // 3. Fallback cache check if remote fetch returned nothing
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {}

  // Default initial state
  const defaultConv: Conversation[] = [
    {
      id: 'conv_active',
      customer_name: 'Customer',
      subject: 'General Support Inquiry',
      status: 'open',
      last_message_at: new Date().toISOString(),
      last_message_preview: 'Hello! How can we help you with your order today?',
      messages: [
        {
          id: 'welcome_1',
          sender_type: 'owner',
          message: 'Hello! How can we help you with your order today?',
          created_at: new Date().toISOString(),
        },
      ],
    },
  ];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultConv));
  return defaultConv;
};

export const saveConversationsLocally = (convs: Conversation[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(convs));
    window.dispatchEvent(new Event('snapcart_chat_updated'));
    if (broadcastChannel) {
      broadcastChannel.postMessage({ type: 'CHAT_UPDATED' });
    }
  } catch (e) {
    console.warn('Failed to save conversations:', e);
  }
};

export const subscribeToChatUpdates = (callback: () => void) => {
  const handleEvent = () => callback();

  window.addEventListener('snapcart_chat_updated', handleEvent);
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) callback();
  });

  if (broadcastChannel) {
    broadcastChannel.onmessage = (event) => {
      if (event.data?.type === 'CHAT_UPDATED') {
        callback();
      }
    };
  }

  // Realtime subscription to Supabase DB tables
  const supabaseChannel = supabase
    .channel('snapcart_realtime_chat')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'conversation_messages' }, () => {
      callback();
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'conversations' }, () => {
      callback();
    })
    .subscribe();

  return () => {
    window.removeEventListener('snapcart_chat_updated', handleEvent);
    if (supabaseChannel) supabase.removeChannel(supabaseChannel);
  };
};

export const appendMessage = async (
  convId: string,
  senderType: 'customer' | 'owner',
  messageText: string,
  customerName = 'Customer'
) => {
  const convs = await getStoredConversations();
  const now = new Date().toISOString();

  const newMsg: ChatMessage = {
    id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    sender_type: senderType,
    message: messageText,
    created_at: now,
  };

  let target = convs.find((c) => c.id === convId);
  if (!target) {
    target = {
      id: convId,
      customer_name: customerName,
      subject: 'Support Inquiry',
      status: 'open',
      last_message_at: now,
      last_message_preview: messageText,
      messages: [],
    };
    convs.unshift(target);
  }

  target.messages.push(newMsg);
  target.last_message_at = now;
  target.last_message_preview = messageText;
  if (customerName !== 'Customer') {
    target.customer_name = customerName;
  }

  saveConversationsLocally(convs);

  // Direct Supabase DB insert (creates conversation row first if missing)
  try {
    let supabaseConvId = convId;
    if (convId.startsWith('conv_')) {
      // Create or fetch Supabase conversation row
      const { data: existingConv } = await supabase
        .from('conversations')
        .select('id')
        .eq('customer_user_id', customerName)
        .limit(1)
        .single();

      if (existingConv?.id) {
        supabaseConvId = existingConv.id;
      } else {
        const { data: createdConv } = await supabase
          .from('conversations')
          .insert({
            customer_user_id: customerName,
            subject: 'Order Support Inquiry',
            status: 'open',
            last_message_at: now,
            last_message_preview: messageText,
          })
          .select('id')
          .single();

        if (createdConv?.id) {
          supabaseConvId = createdConv.id;
        }
      }
    }

    if (supabaseConvId && !supabaseConvId.startsWith('conv_')) {
      await supabase.from('conversation_messages').insert({
        conversation_id: supabaseConvId,
        sender_type: senderType,
        message: messageText,
      });

      await supabase
        .from('conversations')
        .update({
          last_message_at: now,
          last_message_preview: messageText,
        })
        .eq('id', supabaseConvId);
    }
  } catch (e) {
    // Graceful fallback to local storage
  }

  return target;
};
