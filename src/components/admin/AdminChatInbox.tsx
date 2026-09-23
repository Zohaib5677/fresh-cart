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
      loadData();
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
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-emerald-400" /> Customer Support Chats
        </h2>
        <button
          onClick={() => loadData(true)}
          className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors"
          title="Refresh Inbox"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="grid lg:grid-cols-[320px_1fr] gap-6 h-[600px] bg-slate-800/80 rounded-2xl border border-slate-700 overflow-hidden">
        {/* Inbox Sidebar */}
        <div className="border-r border-slate-700 flex flex-col h-full overflow-hidden">
          <div className="p-4 border-b border-slate-700 text-xs font-bold uppercase tracking-wider text-slate-400">
            Active Inbox ({conversations.length})
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-slate-700/50">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setSelectedConvId(conv.id)}
                className={`p-4 cursor-pointer transition-colors ${
                  selectedConv?.id === conv.id ? 'bg-emerald-500/10 border-l-4 border-emerald-400' : 'hover:bg-slate-700/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm text-foreground flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-emerald-400" /> {conv.customer_name || 'Customer'}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(conv.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="text-xs text-slate-300 line-clamp-1">{conv.last_message_preview || 'New message'}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Message Thread Container */}
        <div className="flex flex-col h-full bg-slate-900/40 overflow-hidden">
          {selectedConv ? (
            <>
              {/* Thread Header */}
              <div className="p-4 border-b border-slate-700 bg-slate-800 flex justify-between items-center shrink-0">
                <div>
                  <div className="font-bold text-foreground text-sm flex items-center gap-2">
                    {selectedConv.customer_name || 'Customer'}
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full uppercase font-bold">
                      {selectedConv.status || 'Active'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400">{selectedConv.subject || 'Order support'}</div>
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
                          ? 'bg-emerald-600 text-white font-medium rounded-br-none shadow-md'
                          : 'bg-slate-700 text-slate-100 rounded-bl-none shadow-md'
                      }`}
                    >
                      {m.message}
                    </div>
                    <span className="text-[9px] text-slate-400 mt-1 px-1">
                      {m.sender_type === 'owner' ? 'Store Owner (You)' : selectedConv.customer_name || 'Customer'} •{' '}
                      {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* High-Contrast Reply Input Bar */}
              <div className="p-4 border-t border-slate-700 bg-slate-800/90 flex gap-3 shrink-0">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleReply()}
                  placeholder="Type your reply to customer..."
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl h-11 px-4 text-xs text-white font-medium placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
                />
                <button
                  onClick={handleReply}
                  disabled={!replyText.trim()}
                  className="px-5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 disabled:opacity-40 transition-all shadow-md"
                >
                  Reply <Send className="h-3.5 w-3.5" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-500 text-xs">
              Select a conversation to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminChatInbox;
