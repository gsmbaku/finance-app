import Dexie, { type Table } from 'dexie';
import type { Transaction, Budget, Goal, Conversation } from '@/types';

export class FinCoachDB extends Dexie {
  transactions!: Table<Transaction>;
  budgets!: Table<Budget>;
  goals!: Table<Goal>;
  conversations!: Table<Conversation>;

  constructor() {
    super('fincoach');

    this.version(1).stores({
      // Primary key is id, indexes for common queries
      transactions: 'id, date, category, merchant, type, [category+date]',
      budgets: 'id, category',
      goals: 'id, deadline, priority, status',
      conversations: 'id, createdAt, updatedAt',
    });
  }
}

export const db = new FinCoachDB();

// Helper to generate unique IDs
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// Export/Import functionality for data backup
export async function exportData(): Promise<string> {
  const [transactions, budgets, goals, conversations] = await Promise.all([
    db.transactions.toArray(),
    db.budgets.toArray(),
    db.goals.toArray(),
    db.conversations.toArray(),
  ]);

  const data = {
    version: 1,
    exportedAt: new Date().toISOString(),
    transactions,
    budgets,
    goals,
    conversations,
  };

  return JSON.stringify(data, null, 2);
}

export async function importData(jsonString: string): Promise<void> {
  const data = JSON.parse(jsonString);

  // Clear existing data
  await Promise.all([
    db.transactions.clear(),
    db.budgets.clear(),
    db.goals.clear(),
    db.conversations.clear(),
  ]);

  // Import new data
  await Promise.all([
    db.transactions.bulkAdd(data.transactions || []),
    db.budgets.bulkAdd(data.budgets || []),
    db.goals.bulkAdd(data.goals || []),
    db.conversations.bulkAdd(data.conversations || []),
  ]);
}

// Clear all data (for testing or reset)
export async function clearAllData(): Promise<void> {
  await Promise.all([
    db.transactions.clear(),
    db.budgets.clear(),
    db.goals.clear(),
    db.conversations.clear(),
  ]);
}
