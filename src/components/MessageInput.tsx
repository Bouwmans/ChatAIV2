import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export function MessageInput({ onSendMessage, disabled = false }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          disabled={disabled}
          className="w-full min-h-[50px] max-h-[200px] px-4 py-3 pr-12 bg-tesla-light-gray border border-tesla-light-gray/50 rounded-xl text-tesla-text placeholder-tesla-text-secondary resize-none focus:outline-none focus:border-tesla-accent/50 focus:ring-1 focus:ring-tesla-accent/20 disabled:opacity-50 disabled:cursor-not-allowed"
          rows={1}
        />
        
        <motion.button
          type="submit"
          disabled={!message.trim() || disabled}
          whileHover={{ scale: disabled ? 1 : 1.05 }}
          whileTap={{ scale: disabled ? 1 : 0.95 }}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-tesla-accent text-tesla-dark rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-tesla-accent/90 transition-colors"
        >
          <Send size={16} />
        </motion.button>
      </div>
      
      <div className="flex justify-between items-center mt-2 text-xs text-tesla-text-secondary">
        <span>Press Enter to send, Shift+Enter for new line</span>
        <span>{message.length}/4000</span>
      </div>
    </form>
  );
}
