import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion } from 'framer-motion';
import { Bot, User as UserIcon } from 'lucide-react';
import type { Message } from '../types';

interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  return (
    <div className="space-y-4">
      {messages.map((message, index) => (
        <motion.div
          key={message.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
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
            {message.role === 'assistant' ? (
              <div className="prose prose-invert max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ children }) => (
                      <h1 className="text-xl font-bold text-tesla-text mb-2">{children}</h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-lg font-semibold text-tesla-text mb-2">{children}</h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-base font-medium text-tesla-text mb-1">{children}</h3>
                    ),
                    p: ({ children }) => (
                      <p className="text-tesla-text mb-2 last:mb-0">{children}</p>
                    ),
                    code: ({ children, className }) => {
                      const isInline = !className;
                      return isInline ? (
                        <code className="bg-tesla-gray px-1 py-0.5 rounded text-tesla-accent text-sm">
                          {children}
                        </code>
                      ) : (
                        <code className="block bg-tesla-gray p-3 rounded-lg text-tesla-text text-sm overflow-x-auto">
                          {children}
                        </code>
                      );
                    },
                    pre: ({ children }) => (
                      <pre className="bg-tesla-gray p-3 rounded-lg overflow-x-auto mb-2">
                        {children}
                      </pre>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc list-inside text-tesla-text mb-2 space-y-1">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal list-inside text-tesla-text mb-2 space-y-1">
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => (
                      <li className="text-tesla-text">{children}</li>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-tesla-accent pl-4 italic text-tesla-text-secondary mb-2">
                        {children}
                      </blockquote>
                    ),
                    a: ({ children, href }) => (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-tesla-accent hover:text-tesla-accent/80 underline"
                      >
                        {children}
                      </a>
                    ),
                    table: ({ children }) => (
                      <div className="overflow-x-auto mb-2">
                        <table className="min-w-full border border-tesla-light-gray/30 rounded-lg">
                          {children}
                        </table>
                      </div>
                    ),
                    th: ({ children }) => (
                      <th className="border border-tesla-light-gray/30 px-3 py-2 bg-tesla-gray text-tesla-text font-medium text-left">
                        {children}
                      </th>
                    ),
                    td: ({ children }) => (
                      <td className="border border-tesla-light-gray/30 px-3 py-2 text-tesla-text">
                        {children}
                      </td>
                    ),
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="whitespace-pre-wrap">{message.content}</div>
            )}
            
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
    </div>
  );
}
