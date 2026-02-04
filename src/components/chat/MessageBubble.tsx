import { memo } from 'react';
import { Bot, User } from 'lucide-react';
import { format } from 'date-fns';
import type { Message } from '@/types';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble = memo(function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser
            ? 'bg-primary-100 dark:bg-primary-900/30'
            : 'bg-accent-100 dark:bg-accent-900/30'
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4 text-primary-600 dark:text-primary-400" />
        ) : (
          <Bot className="w-4 h-4 text-accent-600 dark:text-accent-400" />
        )}
      </div>

      {/* Message content */}
      <div className={`max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`rounded-2xl px-4 py-3 ${
            isUser
              ? 'bg-primary-600 text-white rounded-br-md'
              : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-bl-md'
          }`}
        >
          <div className="whitespace-pre-wrap text-sm leading-relaxed">
            {message.content}
          </div>
        </div>
        <time
          className={`text-xs text-gray-400 dark:text-gray-500 mt-1 block ${
            isUser ? 'text-right' : 'text-left'
          }`}
        >
          {format(new Date(message.timestamp), 'h:mm a')}
        </time>
      </div>
    </div>
  );
});
