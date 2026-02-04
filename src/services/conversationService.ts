import { db, generateId } from '@/database/db';
import type { Conversation, Message, CreateMessageDTO } from '@/types';

// Create a new conversation
export async function createConversation(title?: string): Promise<Conversation> {
  const now = new Date();
  const conversation: Conversation = {
    id: generateId(),
    title: title || `Chat ${now.toLocaleDateString()}`,
    messages: [],
    createdAt: now,
    updatedAt: now,
  };

  await db.conversations.add(conversation);
  return conversation;
}

// Get a conversation by ID
export async function getConversation(id: string): Promise<Conversation | undefined> {
  return db.conversations.get(id);
}

// Get all conversations (most recent first)
export async function getConversations(): Promise<Conversation[]> {
  return db.conversations.orderBy('updatedAt').reverse().toArray();
}

// Get the most recent conversation
export async function getMostRecentConversation(): Promise<Conversation | undefined> {
  return db.conversations.orderBy('updatedAt').reverse().first();
}

// Add a message to a conversation
export async function addMessage(
  conversationId: string,
  messageData: CreateMessageDTO
): Promise<Message> {
  const conversation = await db.conversations.get(conversationId);
  if (!conversation) {
    throw new Error('Conversation not found');
  }

  const message: Message = {
    id: generateId(),
    role: messageData.role,
    content: messageData.content,
    timestamp: new Date(),
    metadata: messageData.metadata,
  };

  const updatedMessages = [...conversation.messages, message];

  await db.conversations.update(conversationId, {
    messages: updatedMessages,
    updatedAt: new Date(),
  });

  return message;
}

// Update a conversation's title
export async function updateConversationTitle(
  conversationId: string,
  title: string
): Promise<void> {
  await db.conversations.update(conversationId, {
    title,
    updatedAt: new Date(),
  });
}

// Delete a conversation
export async function deleteConversation(id: string): Promise<boolean> {
  const existing = await db.conversations.get(id);
  if (!existing) return false;

  await db.conversations.delete(id);
  return true;
}

// Clear all messages in a conversation (start fresh)
export async function clearConversation(conversationId: string): Promise<void> {
  await db.conversations.update(conversationId, {
    messages: [],
    updatedAt: new Date(),
  });
}

// Get or create a conversation for the current session
export async function getOrCreateCurrentConversation(): Promise<Conversation> {
  const recent = await getMostRecentConversation();

  // If there's a recent conversation from today, use it
  if (recent) {
    const today = new Date();
    const conversationDate = new Date(recent.createdAt);
    if (
      conversationDate.getDate() === today.getDate() &&
      conversationDate.getMonth() === today.getMonth() &&
      conversationDate.getFullYear() === today.getFullYear()
    ) {
      return recent;
    }
  }

  // Otherwise create a new one
  return createConversation();
}
