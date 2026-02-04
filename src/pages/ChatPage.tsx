import { MessageSquarePlus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui';
import { ChatInterface } from '@/components/chat';
import { useChat } from '@/hooks/useChat';

export function ChatPage() {
  const {
    messages,
    isLoading,
    error,
    initializing,
    sendMessage,
    retry,
    newConversation,
    clearMessages,
    apiKeyConfigured,
  } = useChat();

  if (initializing) {
    return (
      <div className="flex flex-col h-[calc(100vh-4rem-4rem)] lg:h-[calc(100vh-4rem)]">
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse space-y-4 w-full max-w-md px-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem-4rem)] lg:h-[calc(100vh-4rem)]">
      {/* Chat header */}
      <div className="flex items-center justify-between p-4 lg:px-6 border-b border-gray-200 dark:border-gray-800">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">AI Coach</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Your personal financial wellness assistant
          </p>
        </div>
        <div className="flex gap-2">
          {messages.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearMessages}
              leftIcon={<Trash2 className="w-4 h-4" />}
            >
              Clear
            </Button>
          )}
          <Button
            variant="secondary"
            size="sm"
            onClick={newConversation}
            leftIcon={<MessageSquarePlus className="w-4 h-4" />}
          >
            New Chat
          </Button>
        </div>
      </div>

      {/* Chat interface */}
      <ChatInterface
        messages={messages}
        isLoading={isLoading}
        error={error}
        onSendMessage={sendMessage}
        onRetry={retry}
        apiKeyConfigured={apiKeyConfigured}
      />
    </div>
  );
}
