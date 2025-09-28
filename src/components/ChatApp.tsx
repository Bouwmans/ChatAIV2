import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { ChatWindow } from './ChatWindow';
import { ConversationService } from '../services';
import type { Conversation, User } from '../types';

interface ChatAppProps {
  user: User;
  signOut: () => void;
}

export function ChatApp({ user, signOut }: ChatAppProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      setIsLoading(true);
      const fetchedConversations = await ConversationService.getConversations();
      setConversations(fetchedConversations);
      
      // Set the first conversation as current if none is selected
      if (fetchedConversations.length > 0 && !currentConversation) {
        setCurrentConversation(fetchedConversations[0]);
      }
    } catch (error) {
      console.error('Failed to load conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewConversation = async () => {
    try {
      const newConversation = await ConversationService.createConversation('New Chat');
      setConversations(prev => [newConversation, ...prev]);
      setCurrentConversation(newConversation);
    } catch (error) {
      console.error('Failed to create new conversation:', error);
    }
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setCurrentConversation(conversation);
  };

  const handleDeleteConversation = async (conversationId: string) => {
    try {
      await ConversationService.deleteConversation(conversationId);
      setConversations(prev => prev.filter(conv => conv.id !== conversationId));
      
      // If we deleted the current conversation, select another one
      if (currentConversation?.id === conversationId) {
        const remainingConversations = conversations.filter(conv => conv.id !== conversationId);
        setCurrentConversation(remainingConversations.length > 0 ? remainingConversations[0] : null);
      }
    } catch (error) {
      console.error('Failed to delete conversation:', error);
    }
  };

  const handleUpdateConversation = async (conversationId: string, title: string) => {
    try {
      const updatedConversation = await ConversationService.updateConversation(conversationId, title);
      setConversations(prev => 
        prev.map(conv => conv.id === conversationId ? updatedConversation : conv)
      );
      
      if (currentConversation?.id === conversationId) {
        setCurrentConversation(updatedConversation);
      }
    } catch (error) {
      console.error('Failed to update conversation:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen bg-tesla-dark flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-tesla-accent border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="h-screen bg-tesla-dark flex overflow-hidden">
      <Sidebar
        conversations={conversations}
        currentConversation={currentConversation}
        onNewConversation={handleNewConversation}
        onSelectConversation={handleSelectConversation}
        onDeleteConversation={handleDeleteConversation}
        onUpdateConversation={handleUpdateConversation}
        user={user}
        signOut={signOut}
      />
      
      <div className="flex-1 flex flex-col">
        {currentConversation ? (
          <ChatWindow
            conversation={currentConversation}
            onUpdateConversation={handleUpdateConversation}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h2 className="text-2xl font-semibold text-tesla-text mb-4">
                Welcome to ChatAI V2
              </h2>
              <p className="text-tesla-text-secondary mb-8">
                Start a new conversation or select an existing one from the sidebar
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNewConversation}
                className="px-6 py-3 bg-tesla-accent text-tesla-dark font-medium rounded-lg hover:bg-tesla-accent/90 transition-colors"
              >
                Start New Chat
              </motion.button>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
