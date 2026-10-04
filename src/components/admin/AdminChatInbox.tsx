import { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, RefreshCw, User } from 'lucide-react';
import { toast } from 'sonner';
import {
  Conversation,
  getStoredConversations,
  subscribeToChatUpdates,
  appendMessage,
} from '@/lib/chatService';

export const AdminChatInbox = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConvId, setSelectedConvId] = useState<string>('conv_active');
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadData = async (forceRemote = false) => {
    setLoading(true);
    try {
      const convs = await getStoredConversations(forceRemote);
      setConversations(convs);
      if (convs.length > 0 && !convs.find((c) => c.id === selectedConvId)) {
        setSelectedConvId(convs[0].id);
      }
    } catch (e) {
      console.warn('Error loading admin chat conversations:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const unsubscribe = subscribeToChatUpdates(() => {
      // Realtime events must bypass localStorage, otherwise the UI keeps
      // rendering the stale snapshot that was cached before the event.
      loadData(true);
    });
    return () => unsubscribe();
  }, []);

  const selectedConv = conversations.find((c) => c.id === selectedConvId) || conversations[0];
  const activeMessages = selectedConv?.messages || [];

  useEffect(() => {
    scrollToBottom();
  }, [selectedConvId, activeMessages]);

  const handleReply = async () => {
    if (!replyText.trim() || !selectedConv) return;
    const text = replyText.trim();
    setReplyText('');

    await appendMessage(selectedConv.id, 'owner', text);
    toast.success('Reply sent to customer!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-3 font-serif text-4xl font-normal text-[#242024]">
          <MessageSquare className="h-6 w-6 text-[#a35d70]" /> Customer Support Chats
        </h2>
        <button
          onClick={() => loadData(true)}
          className="rounded-xl border border-[#e8e3e5] bg-white p-2 text-[#716b70] transition-colors hover:border-[#c97685] hover:text-[#a35d70]"
          title="Refresh Inbox"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="grid h-[600px] gap-6 overflow-hidden rounded-2xl border border-[#e8e3e5] bg-white shadow-[0_12px_30px_rgba(63,57,62,0.06)] lg:grid-cols-[320px_1fr]">
        {/* Inbox Sidebar */}
        <div className="flex h-full flex-col overflow-hidden border-r border-[#e8e3e5] bg-[#f4f0ed]">
          <div className="border-b border-[#e8e3e5] p-4 text-xs font-bold uppercase tracking-[0.12em] text-[#9a9298]">
            Active Inbox ({conversations.length})
          </div>
          <div className="flex-1 divide-y divide-[#e8e3e5] overflow-y-auto">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setSelectedConvId(conv.id)}
                className={`p-4 cursor-pointer transition-colors ${
                  selectedConv?.id === conv.id ? 'border-l-4 border-[#a35d70] bg-[#f4dfe3]' : 'hover:bg-white/70'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm text-foreground flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-[#a35d70]" /> {conv.customer_name || 'Customer'}
                  </span>
                  <span className="text-[10px] text-[#9a9298]">
                    {new Date(conv.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="line-clamp-1 text-xs text-[#716b70]">{conv.last_message_preview || 'New message'}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Message Thread Container */}
        <div className="flex h-full flex-col overflow-hidden bg-[#fffdfc]">
          {selectedConv ? (
            <>
              {/* Thread Header */}
              <div className="flex shrink-0 items-center justify-between border-b border-[#e8e3e5] bg-white p-4">
                <div>
                  <div className="font-bold text-foreground text-sm flex items-center gap-2">
                    {selectedConv.customer_name || 'Customer'}
                    <span className="rounded-full bg-[#f4dfe3] px-2 py-0.5 text-[10px] font-bold uppercase text-[#a35d70]">
                      {selectedConv.status || 'Active'}
                    </span>
                  </div>
                  <div className="text-xs text-[#9a9298]">{selectedConv.subject || 'Order support'}</div>
                </div>
              </div>

              {/* Scrollable Messages List */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4 max-h-[460px]">
                {activeMessages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex flex-col ${m.sender_type === 'owner' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[75%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                        m.sender_type === 'owner'
                          ? 'rounded-br-none bg-[#a35d70] font-medium text-white shadow-md'
                          : 'rounded-bl-none border border-[#e8e3e5] bg-[#f4f0ed] text-[#4e484d] shadow-sm'
                      }`}
                    >
                      {m.message}
                    </div>
                    <span className="mt-1 px-1 text-[9px] text-[#9a9298]">
                      {m.sender_type === 'owner' ? 'Store Owner (You)' : selectedConv.customer_name || 'Customer'} •{' '}
                      {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* High-Contrast Reply Input Bar */}
              <div className="flex shrink-0 gap-3 border-t border-[#e8e3e5] bg-[#f4f0ed] p-4">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleReply()}
                  placeholder="Type your reply to customer..."
                  className="h-11 flex-1 rounded-xl border border-[#d8cfd3] bg-white px-4 text-xs font-medium text-[#3f393e] placeholder:text-[#9a9298] focus:border-[#a35d70] focus:outline-none"
                />
                <button
                  onClick={handleReply}
                  disabled={!replyText.trim()}
                  className="px-5 bg-[#a35d70] hover:bg-[#8f4f60] text-white font-bold rounded-xl text-xs flex items-center gap-2 disabled:opacity-40 transition-all shadow-md"
                >
                  Reply <Send className="h-3.5 w-3.5" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center text-xs text-[#9a9298]">
              Select a conversation to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminChatInbox;
