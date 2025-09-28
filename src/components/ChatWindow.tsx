import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User as UserIcon } from 'lucide-react';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { MessageService, ChatService } from '../services';
import type { Conversation, Message } from '../types';

interface ChatWindowProps {
  conversation: Conversation;
  onUpdateConversation: (conversationId: string, title: string) => void;
}

export function ChatWindow({ conversation, onUpdateConversation }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMessages();
  }, [conversation.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    try {
      setIsLoading(true);
      const fetchedMessages = await MessageService.getMessages(conversation.id);
      setMessages(fetchedMessages);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isSending) return;

    try {
      setIsSending(true);

      // Create user message
      const userMessage = await MessageService.createMessage(
        conversation.id,
        'user',
        content.trim()
      );
      setMessages(prev => [...prev, userMessage]);

      // Update conversation title if it's the first message
      if (messages.length === 0) {
        const title = content.trim().slice(0, 50) + (content.length > 50 ? '...' : '');
        await onUpdateConversation(conversation.id, title);
      }

      // Prepare conversation history for Bedrock
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

      // Send to Bedrock
      const response = await ChatService.sendMessage({
        message: content.trim(),
        conversationHistory,
      });

      // Create assistant message
      const assistantMessage = await MessageService.createMessage(
        conversation.id,
        'assistant',
        response.response
      );
      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error('Failed to send message:', error);
      
      // Create error message
      const errorMessage = await MessageService.createMessage(
        conversation.id,
        'assistant',
        'Sorry, I encountered an error processing your message. Please try again.'
      );
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-tesla-accent border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-tesla-light-gray bg-tesla-gray/50">
        <h2 className="text-lg font-semibold text-tesla-text truncate">
          {conversation.title}
        </h2>
        <p className="text-sm text-tesla-text-secondary">
          {messages.length} messages
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="p-4 space-y-4">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`flex gap-3 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 bg-tesla-accent rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot size={16} className="text-tesla-dark" />
                  </div>
                )}
                
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-tesla-accent text-tesla-dark'
                      : 'bg-tesla-light-gray text-tesla-text'
                  }`}
                >
                  <div className="prose prose-invert max-w-none">
                    {message.role === 'assistant' ? (
                      <div className="whitespace-pre-wrap">{message.content}</div>
                    ) : (
                      <div>{message.content}</div>
                    )}
                  </div>
                  <div className={`text-xs mt-2 ${
                    message.role === 'user' 
                      ? 'text-tesla-dark/70' 
                      : 'text-tesla-text-secondary'
                  }`}>
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </div>
                </div>

                {message.role === 'user' && (
                  <div className="w-8 h-8 bg-tesla-light-gray rounded-full flex items-center justify-center flex-shrink-0">
                    <UserIcon size={16} className="text-tesla-text" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isSending && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3 justify-start"
            >
              <div className="w-8 h-8 bg-tesla-accent rounded-full flex items-center justify-center flex-shrink-0">
                <Bot size={16} className="text-tesla-dark" />
              </div>
              <div className="bg-tesla-light-gray text-tesla-text rounded-2xl px-4 py-3">
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-tesla-text-secondary"
                  >
                    Thinking...
                  </motion.div>
                  <div className="flex gap-1">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                      className="w-2 h-2 bg-tesla-accent rounded-full"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                      className="w-2 h-2 bg-tesla-accent rounded-full"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                      className="w-2 h-2 bg-tesla-accent rounded-full"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-tesla-light-gray bg-tesla-gray/50">
        <MessageInput
          onSendMessage={handleSendMessage}
          disabled={isSending}
        />
      </div>
    </div>
  );
}
