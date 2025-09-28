import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  MessageSquare, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  LogOut,
  User
} from 'lucide-react';
import type { Conversation, User as UserType } from '../types';

interface SidebarProps {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  onNewConversation: () => void;
  onSelectConversation: (conversation: Conversation) => void;
  onDeleteConversation: (conversationId: string) => void;
  onUpdateConversation: (conversationId: string, title: string) => void;
  user: UserType;
  signOut: () => void;
}

export function Sidebar({
  conversations,
  currentConversation,
  onNewConversation,
  onSelectConversation,
  onDeleteConversation,
  onUpdateConversation,
  user,
  signOut,
}: SidebarProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleEditStart = (conversation: Conversation) => {
    setEditingId(conversation.id);
    setEditTitle(conversation.title);
  };

  const handleEditSave = () => {
    if (editingId && editTitle.trim()) {
      onUpdateConversation(editingId, editTitle.trim());
      setEditingId(null);
      setEditTitle('');
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditTitle('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEditSave();
    } else if (e.key === 'Escape') {
      handleEditCancel();
    }
  };

  return (
    <div className="w-80 bg-tesla-gray border-r border-tesla-light-gray flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-tesla-light-gray">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold gradient-text">ChatAI V2</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNewConversation}
            className="p-2 bg-tesla-accent text-tesla-dark rounded-lg hover:bg-tesla-accent/90 transition-colors"
          >
            <Plus size={20} />
          </motion.button>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          onClick={onNewConversation}
          className="w-full py-3 px-4 bg-tesla-light-gray hover:bg-tesla-light-gray/80 rounded-lg transition-colors flex items-center gap-3 text-tesla-text"
        >
          <Plus size={18} />
          <span className="font-medium">New Chat</span>
        </motion.button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="p-2">
          <AnimatePresence>
            {conversations.map((conversation) => (
              <motion.div
                key={conversation.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="relative group"
                onMouseEnter={() => setHoveredId(conversation.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div
                  className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    currentConversation?.id === conversation.id
                      ? 'bg-tesla-accent/20 border border-tesla-accent/30'
                      : 'hover:bg-tesla-light-gray/50'
                  }`}
                  onClick={() => onSelectConversation(conversation)}
                >
                  {editingId === conversation.id ? (
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onBlur={handleEditSave}
                      onKeyDown={handleKeyDown}
                      className="w-full bg-transparent text-tesla-text border-none outline-none font-medium"
                      autoFocus
                    />
                  ) : (
                    <div className="flex items-center gap-3">
                      <MessageSquare size={16} className="text-tesla-text-secondary flex-shrink-0" />
                      <span className="text-tesla-text font-medium truncate">
                        {conversation.title}
                      </span>
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                <AnimatePresence>
                  {hoveredId === conversation.id && editingId !== conversation.id && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1"
                    >
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditStart(conversation);
                        }}
                        className="p-1 bg-tesla-light-gray hover:bg-tesla-light-gray/80 rounded text-tesla-text-secondary hover:text-tesla-text transition-colors"
                      >
                        <Edit2 size={14} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteConversation(conversation.id);
                        }}
                        className="p-1 bg-tesla-light-gray hover:bg-red-500/20 rounded text-tesla-text-secondary hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={14} />
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* User Section */}
      <div className="p-4 border-t border-tesla-light-gray">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-tesla-accent rounded-full flex items-center justify-center">
            <User size={16} className="text-tesla-dark" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-tesla-text font-medium truncate">{user.username}</p>
            <p className="text-tesla-text-secondary text-sm truncate">{user.email}</p>
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={signOut}
          className="w-full py-2 px-3 bg-tesla-light-gray hover:bg-red-500/20 rounded-lg transition-colors flex items-center gap-2 text-tesla-text-secondary hover:text-red-400"
        >
          <LogOut size={16} />
          <span className="font-medium">Sign Out</span>
        </motion.button>
      </div>
    </div>
  );
}
