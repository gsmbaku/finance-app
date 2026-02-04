export type MessageRole = 'user' | 'assistant';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  metadata?: {
    transactionIds?: string[];
    insightGenerated?: boolean;
    actionTaken?: string;
  };
}

export interface ConversationContext {
  currentMonth: {
    totalSpent: number;
    totalIncome: number;
    budgetStatus: Record<string, {
      spent: number;
      limit: number;
      percentage: number;
    }>;
    topCategories: Array<{
      category: string;
      amount: number;
      percentage: number;
    }>;
  };
  recentTransactions: Array<{
    merchant: string;
    amount: number;
    category: string;
    date: Date;
  }>;
  activeGoals: Array<{
    name: string;
    targetAmount: number;
    currentAmount: number;
    deadline: Date;
  }>;
  userProfile: {
    spendingPersonality?: string;
    financialKnowledge: 'beginner' | 'intermediate' | 'advanced';
  };
}

export interface Conversation {
  id: string;
  title?: string;
  messages: Message[];
  context?: ConversationContext;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMessageDTO {
  role: MessageRole;
  content: string;
  metadata?: Message['metadata'];
}
