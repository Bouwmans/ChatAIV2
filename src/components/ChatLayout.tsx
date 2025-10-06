import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { generateClient } from 'aws-amplify/data';
import { post } from 'aws-amplify/api';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '../utils/cn';

const dataClient = generateClient();

const generateId = () => {
  if (typeof globalThis.crypto !== 'undefined' && 'randomUUID' in globalThis.crypto) {
    return globalThis.crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
};

type Conversation = {
  id: string;
  title: string;
  summary?: string | null;
  createdAt: string;
  updatedAt: string;
};

type Message = {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: string;
};

type ChatLayoutProps = {
  username: string;
  email?: string;
  onSignOut: () => Promise<void>;
};

export const ChatLayout = ({ username, email, onSignOut }: ChatLayoutProps) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  const selectedConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === selectedConversationId) ?? null,
    [conversations, selectedConversationId],
  );

  const loadConversations = useCallback(async () => {
    const { data } = await dataClient.models.Conversation.list();
    const sorted = (data ?? []).sort((a: Conversation, b: Conversation) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
    setConversations(sorted);
    if (!selectedConversationId && sorted.length > 0) {
      setSelectedConversationId(sorted[0].id);
    }
  }, [selectedConversationId]);

  const loadMessages = useCallback(async (conversationId: string) => {
    const { data } = await dataClient.models.Message.list({
      filter: {
        conversationId: { eq: conversationId },
      },
      limit: 200,
    });
    const sorted = (data ?? []).sort(
      (a: Message, b: Message) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
    setMessages(sorted);
  }, []);

  useEffect(() => {
    void loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    if (selectedConversationId) {
      void loadMessages(selectedConversationId);
    } else {
      setMessages([]);
    }
  }, [selectedConversationId, loadMessages]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const ensureConversation = useCallback(async () => {
    if (selectedConversationId) {
      return selectedConversationId;
    }
    const timestamp = new Date().toISOString();
    const created = await dataClient.models.Conversation.create({
      title: 'New conversation',
      summary: '',
      createdAt: timestamp,
      updatedAt: timestamp,
    });
    const conversationId = created.data?.id ?? created.id;
    await loadConversations();
    setSelectedConversationId(conversationId);
    return conversationId;
  }, [selectedConversationId, loadConversations]);

  const handleNewChat = async () => {
    const timestamp = new Date().toISOString();
    const created = await dataClient.models.Conversation.create({
      title: 'New conversation',
      summary: '',
      createdAt: timestamp,
      updatedAt: timestamp,
    });
    const conversationId = created.data?.id ?? created.id;
    await loadConversations();
    setSelectedConversationId(conversationId);
    setMessages([]);
    setInput('');
  };

  const persistMessage = async (conversationId: string, message: Omit<Message, 'id'>) => {
    await dataClient.models.Message.create({
      ...message,
      conversationId,
    });
  };

  const handleSendMessage = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!input.trim()) {
      return;
    }
    setIsSending(true);
    setError(null);
    try {
      const conversationId = await ensureConversation();
      const timestamp = new Date().toISOString();
      const userMessage: Message = {
        id: generateId(),
        conversationId,
        role: 'user',
        content: input.trim(),
        createdAt: timestamp,
      };
      setMessages((prev) => [...prev, userMessage]);
      setInput('');
      await persistMessage(conversationId, {
        conversationId,
        role: userMessage.role,
        content: userMessage.content,
        createdAt: timestamp,
      });

      const historyPayload = [...messages, userMessage].map((message) => ({
        role: message.role,
        content: message.content,
      }));

      const response = await post({
        apiName: 'chatApi',
        path: '/chat',
        options: {
          body: {
            history: historyPayload,
          },
        },
      }).response;

      const body = await response.body.json();
      const assistantContent = String(body.reply ?? '');
      const assistantMessage: Message = {
        id: generateId(),
        conversationId,
        role: 'assistant',
        content: assistantContent,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      await persistMessage(conversationId, {
        conversationId,
        role: assistantMessage.role,
        content: assistantMessage.content,
        createdAt: assistantMessage.createdAt,
      });

      const titleSource = historyPayload[0]?.content ?? 'Conversation';
      await dataClient.models.Conversation.update({
        id: conversationId,
        title: titleSource.slice(0, 60),
        summary: assistantContent.slice(0, 120),
        updatedAt: new Date().toISOString(),
      });
      await loadConversations();
    } catch (err) {
      console.error(err);
      setError((err as Error).message ?? 'Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-space-black text-white">
      <aside className="flex w-80 flex-col border-r border-white/5 bg-space-gray/70 p-6 backdrop-blur">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-widest text-slate-400">Signed in as</p>
            <p className="text-lg font-semibold text-white">{email ?? username}</p>
          </div>
          <button
            onClick={() => void onSignOut()}
            className="rounded-lg border border-white/10 px-3 py-1 text-xs uppercase tracking-widest text-slate-300 transition hover:border-sky-500 hover:text-sky-400"
          >
            Sign out
          </button>
        </div>
        <button
          onClick={() => void handleNewChat()}
          className="mb-6 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 px-4 py-2 text-sm font-semibold uppercase tracking-widest text-slate-900 shadow-glow transition hover:from-sky-400 hover:to-cyan-300"
        >
          New chat
        </button>
        <div className="flex-1 space-y-3 overflow-y-auto pr-2">
          {conversations.length === 0 ? (
            <p className="text-sm text-slate-400">No conversations yet. Start a new one!</p>
          ) : (
            conversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => setSelectedConversationId(conversation.id)}
                className={cn(
                  'w-full rounded-xl border border-transparent bg-space-black/60 px-4 py-3 text-left transition hover:border-sky-500/60 hover:bg-space-black/80',
                  selectedConversationId === conversation.id && 'border-sky-500/60 shadow-glow',
                )}
              >
                <p className="text-sm font-semibold text-white">{conversation.title || 'Untitled chat'}</p>
                {conversation.summary && (
                  <p className="mt-1 line-clamp-2 text-xs text-slate-400">{conversation.summary}</p>
                )}
                <p className="mt-2 text-[10px] uppercase tracking-widest text-slate-500">
                  {new Date(conversation.updatedAt).toLocaleString()}
                </p>
              </button>
            ))
          )}
        </div>
      </aside>
      <main className="flex flex-1 flex-col">
        <div className="flex-1 overflow-y-auto px-10 py-8" ref={messagesContainerRef}>
          <div className="mx-auto flex h-full max-w-3xl flex-col space-y-6">
            {selectedConversation ? (
              <>
                <div className="rounded-2xl border border-white/5 bg-space-gray/40 p-6 shadow-lg">
                  <h2 className="text-2xl font-semibold text-white">
                    {selectedConversation.title || 'New conversation'}
                  </h2>
                  <p className="mt-2 text-sm text-slate-400">
                    Converse with Claude on Amazon Bedrock. Your chats are private to your account.
                  </p>
                </div>
                <AnimatePresence initial={false}>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className={cn(
                        'flex w-full',
                        message.role === 'user' ? 'justify-end' : 'justify-start',
                      )}
                    >
                      <div
                        className={cn(
                          'max-w-[80%] rounded-2xl border border-white/10 px-5 py-4 text-sm leading-relaxed shadow-lg',
                          message.role === 'user'
                            ? 'bg-gradient-to-br from-sky-500/80 to-cyan-500/80 text-slate-900 shadow-glow'
                            : 'bg-space-gray/70 text-slate-100',
                        )}
                      >
                        <ReactMarkdown remarkPlugins={[remarkGfm]} className="prose prose-invert prose-sm">
                          {message.content}
                        </ReactMarkdown>
                        <p className="mt-3 text-[10px] uppercase tracking-widest text-slate-400">
                          {new Date(message.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </>
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-lg text-slate-400">Select or start a conversation to begin.</p>
              </div>
            )}
          </div>
        </div>
        {error && <p className="px-10 text-sm text-rose-400">{error}</p>}
        <form onSubmit={handleSendMessage} className="border-t border-white/5 bg-space-gray/70 px-10 py-6">
          <div className="mx-auto flex max-w-3xl items-end gap-4">
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Send a message to Claude…"
              rows={2}
              className="flex-1 resize-none rounded-2xl border border-white/10 bg-space-black/70 px-5 py-4 text-sm text-white shadow-inner transition focus:border-sky-500/60 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
            />
            <button
              type="submit"
              disabled={isSending || !input.trim()}
              className={cn(
                'flex items-center justify-center rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-400 px-6 py-3 text-sm font-semibold uppercase tracking-widest text-slate-900 shadow-glow transition hover:from-sky-400 hover:to-cyan-300',
                (isSending || !input.trim()) && 'opacity-60',
              )}
            >
              {isSending ? 'Sending…' : 'Send'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};
