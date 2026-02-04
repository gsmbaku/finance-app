import { useState, useEffect, useCallback } from 'react';
import type { Message, Conversation } from '@/types';
import * as conversationService from '@/services/conversationService';
import * as aiService from '@/services/aiService';
import { generateId } from '@/database/db';

interface UseChatOptions {
  conversationId?: string;
}

export function useChat(options: UseChatOptions = {}) {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initializing, setInitializing] = useState(true);

  // Initialize conversation
  useEffect(() => {
    const init = async () => {
      try {
        setInitializing(true);
        let conv: Conversation;

        if (options.conversationId) {
          const existing = await conversationService.getConversation(options.conversationId);
          conv = existing || await conversationService.createConversation();
        } else {
          conv = await conversationService.getOrCreateCurrentConversation();
        }

        setConversation(conv);
        setMessages(conv.messages);
      } catch (err) {
        console.error('Failed to initialize chat:', err);
        setError('Failed to load conversation');
      } finally {
        setInitializing(false);
      }
    };

    init();
  }, [options.conversationId]);

  // Send a message
  const sendMessage = useCallback(async (content: string) => {
    if (!conversation || isLoading) return;

    setError(null);
    setIsLoading(true);

    // Create user message
    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    // Optimistically add user message to UI
    setMessages((prev) => [...prev, userMessage]);

    // Save user message to database
    try {
      await conversationService.addMessage(conversation.id, {
        role: 'user',
        content,
      });
    } catch (err) {
      console.error('Failed to save user message:', err);
    }

    // Get AI response
    try {
      const response = await aiService.sendMessage(content, messages);

      // Create assistant message
      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      // Add to UI
      setMessages((prev) => [...prev, assistantMessage]);

      // Save to database
      await conversationService.addMessage(conversation.id, {
        role: 'assistant',
        content: response,
      });
    } catch (err) {
      console.error('Failed to get AI response:', err);
      setError(err instanceof Error ? err.message : 'Failed to get response');
    } finally {
      setIsLoading(false);
    }
  }, [conversation, isLoading, messages]);

  // Retry last message
  const retry = useCallback(async () => {
    if (messages.length === 0) return;

    // Find the last user message
    const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user');
    if (!lastUserMessage) return;

    // Remove the error state and resend
    setError(null);

    // Remove the last assistant message if it exists after the user message
    const lastUserIndex = messages.findIndex((m) => m.id === lastUserMessage.id);
    const messagesBeforeRetry = messages.slice(0, lastUserIndex);

    setMessages(messagesBeforeRetry);
    await sendMessage(lastUserMessage.content);
  }, [messages, sendMessage]);

  // Start a new conversation
  const newConversation = useCallback(async () => {
    try {
      const conv = await conversationService.createConversation();
      setConversation(conv);
      setMessages([]);
      setError(null);
    } catch (err) {
      console.error('Failed to create new conversation:', err);
      setError('Failed to start new conversation');
    }
  }, []);

  // Clear current conversation
  const clearMessages = useCallback(async () => {
    if (!conversation) return;

    try {
      await conversationService.clearConversation(conversation.id);
      setMessages([]);
      setError(null);
    } catch (err) {
      console.error('Failed to clear conversation:', err);
    }
  }, [conversation]);

  return {
    messages,
    isLoading,
    error,
    initializing,
    conversationId: conversation?.id,
    sendMessage,
    retry,
    newConversation,
    clearMessages,
    apiKeyConfigured: aiService.isApiKeyConfigured(),
  };
}

// Hook for listing all conversations
export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true);
      const data = await conversationService.getConversations();
      setConversations(data);
    } catch (err) {
      console.error('Failed to fetch conversations:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const deleteConversation = useCallback(async (id: string) => {
    await conversationService.deleteConversation(id);
    setConversations((prev) => prev.filter((c) => c.id !== id));
  }, []);

  return {
    conversations,
    loading,
    refetch: fetchConversations,
    deleteConversation,
  };
}
