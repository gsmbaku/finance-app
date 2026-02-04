import { useEffect, useRef } from 'react';
import { Bot, AlertCircle, RefreshCw } from 'lucide-react';
import { Card, Button } from '@/components/ui';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { InputBar } from './InputBar';
import { QuickActions } from './QuickActions';
import type { Message } from '@/types';

interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  onSendMessage: (message: string) => void;
  onRetry?: () => void;
  apiKeyConfigured: boolean;
}

export function ChatInterface({
  messages,
  isLoading,
  error,
  onSendMessage,
  onRetry,
  apiKeyConfigured,
}: ChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleQuickAction = (prompt: string) => {
    onSendMessage(prompt);
  };

  // Show API key warning if not configured
  if (!apiKeyConfigured) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 flex items-center justify-center p-6">
          <Card className="max-w-md text-center">
            <div className="p-2 rounded-full bg-warning-100 dark:bg-warning-900/30 w-fit mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-warning-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              API Key Required
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              To use the AI coach, you need to add your Anthropic API key to the{' '}
              <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                .env.local
              </code>{' '}
              file:
            </p>
            <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg text-left text-xs overflow-x-auto">
              VITE_ANTHROPIC_API_KEY=your_api_key_here
            </pre>
            <p className="text-gray-500 dark:text-gray-400 text-xs mt-3">
              Get your API key from{' '}
              <a
                href="https://console.anthropic.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:underline"
              >
                console.anthropic.com
              </a>
            </p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Welcome message if no messages */}
          {messages.length === 0 && !isLoading && (
            <div className="space-y-6">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-accent-100 dark:bg-accent-900/30 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-accent-600 dark:text-accent-400" />
                </div>
                <Card className="max-w-[80%]">
                  <p className="text-gray-700 dark:text-gray-300">
                    Hi! I'm FinCoach, your AI financial wellness assistant. I can help you:
                  </p>
                  <ul className="mt-3 space-y-1 text-gray-600 dark:text-gray-400 text-sm">
                    <li>• Understand your spending patterns</li>
                    <li>• Track and optimize your budgets</li>
                    <li>• Work towards your savings goals</li>
                    <li>• Learn financial concepts along the way</li>
                  </ul>
                  <p className="mt-3 text-gray-700 dark:text-gray-300">
                    What would you like to explore today?
                  </p>
                </Card>
              </div>

              {/* Quick actions */}
              <div className="pl-11">
                <QuickActions onSelect={handleQuickAction} disabled={isLoading} />
              </div>
            </div>
          )}

          {/* Message list */}
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}

          {/* Typing indicator */}
          {isLoading && <TypingIndicator />}

          {/* Error message */}
          {error && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-expense-100 dark:bg-expense-900/30 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-4 h-4 text-expense-600 dark:text-expense-400" />
              </div>
              <Card className="max-w-[80%] border-expense-200 dark:border-expense-800">
                <p className="text-expense-700 dark:text-expense-300 text-sm">{error}</p>
                {onRetry && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onRetry}
                    leftIcon={<RefreshCw className="w-3 h-3" />}
                    className="mt-2"
                  >
                    Try again
                  </Button>
                )}
              </Card>
            </div>
          )}

          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="border-t border-gray-200 dark:border-gray-800 p-4 lg:p-6">
        <div className="max-w-3xl mx-auto space-y-3">
          {/* Quick actions when there are messages */}
          {messages.length > 0 && !isLoading && (
            <QuickActions onSelect={handleQuickAction} disabled={isLoading} />
          )}

          <InputBar onSend={onSendMessage} disabled={isLoading} />

          <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
            Press Enter to send, Shift + Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}
