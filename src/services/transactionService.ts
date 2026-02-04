import { db, generateId } from '@/database/db';
import type {
  Transaction,
  CreateTransactionDTO,
  UpdateTransactionDTO,
  TransactionFilters,
  TransactionStats,
} from '@/types';
import { startOfMonth, endOfMonth } from 'date-fns';

// Create a new transaction
export async function createTransaction(data: CreateTransactionDTO): Promise<Transaction> {
  const now = new Date();
  const transaction: Transaction = {
    id: generateId(),
    ...data,
    tags: data.tags || [],
    description: data.description || '',
    createdAt: now,
    updatedAt: now,
  };

  await db.transactions.add(transaction);
  return transaction;
}

// Get a transaction by ID
export async function getTransaction(id: string): Promise<Transaction | undefined> {
  return db.transactions.get(id);
}

// Update a transaction
export async function updateTransaction(
  id: string,
  data: UpdateTransactionDTO
): Promise<Transaction | undefined> {
  const existing = await db.transactions.get(id);
  if (!existing) return undefined;

  const updated: Transaction = {
    ...existing,
    ...data,
    updatedAt: new Date(),
  };

  await db.transactions.put(updated);
  return updated;
}

// Delete a transaction
export async function deleteTransaction(id: string): Promise<boolean> {
  const existing = await db.transactions.get(id);
  if (!existing) return false;

  await db.transactions.delete(id);
  return true;
}

// Get all transactions with optional filters
export async function getTransactions(filters?: TransactionFilters): Promise<Transaction[]> {
  let collection = db.transactions.toCollection();

  // Get all and filter in memory for complex queries
  let transactions = await collection.toArray();

  if (filters) {
    if (filters.startDate || filters.endDate) {
      transactions = transactions.filter((t) => {
        const date = new Date(t.date);
        if (filters.startDate && date < filters.startDate) return false;
        if (filters.endDate && date > filters.endDate) return false;
        return true;
      });
    }

    if (filters.categories && filters.categories.length > 0) {
      transactions = transactions.filter((t) => filters.categories!.includes(t.category));
    }

    if (filters.types && filters.types.length > 0) {
      transactions = transactions.filter((t) => filters.types!.includes(t.type));
    }

    if (filters.merchants && filters.merchants.length > 0) {
      transactions = transactions.filter((t) =>
        filters.merchants!.some((m) => t.merchant.toLowerCase().includes(m.toLowerCase()))
      );
    }

    if (filters.minAmount !== undefined) {
      transactions = transactions.filter((t) => t.amount >= filters.minAmount!);
    }

    if (filters.maxAmount !== undefined) {
      transactions = transactions.filter((t) => t.amount <= filters.maxAmount!);
    }

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      transactions = transactions.filter(
        (t) =>
          t.merchant.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query) ||
          t.category.toLowerCase().includes(query) ||
          t.notes?.toLowerCase().includes(query)
      );
    }
  }

  // Sort by date descending (most recent first)
  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// Get transactions for current month
export async function getCurrentMonthTransactions(): Promise<Transaction[]> {
  const now = new Date();
  return getTransactions({
    startDate: startOfMonth(now),
    endDate: endOfMonth(now),
  });
}

// Get transaction statistics
export async function getTransactionStats(
  startDate?: Date,
  endDate?: Date
): Promise<TransactionStats> {
  const transactions = await getTransactions({ startDate, endDate });

  const expenses = transactions.filter((t) => t.type === 'expense');
  const income = transactions.filter((t) => t.type === 'income');

  const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
  const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);

  const largestExpense = expenses.length > 0
    ? expenses.reduce((max, t) => (t.amount > max.amount ? t : max))
    : null;

  return {
    totalIncome,
    totalExpenses,
    netAmount: totalIncome - totalExpenses,
    transactionCount: transactions.length,
    averageExpense: expenses.length > 0 ? totalExpenses / expenses.length : 0,
    largestExpense,
  };
}

// Get spending by category
export async function getSpendingByCategory(
  startDate?: Date,
  endDate?: Date
): Promise<Array<{ category: string; amount: number; count: number }>> {
  const transactions = await getTransactions({
    startDate,
    endDate,
    types: ['expense'],
  });

  const categoryMap = new Map<string, { amount: number; count: number }>();

  for (const t of transactions) {
    const existing = categoryMap.get(t.category) || { amount: 0, count: 0 };
    categoryMap.set(t.category, {
      amount: existing.amount + t.amount,
      count: existing.count + 1,
    });
  }

  return Array.from(categoryMap.entries())
    .map(([category, data]) => ({ category, ...data }))
    .sort((a, b) => b.amount - a.amount);
}

// Get unique merchants from transaction history
export async function getMerchants(): Promise<string[]> {
  const transactions = await db.transactions.toArray();
  const merchants = new Set(transactions.map((t) => t.merchant));
  return Array.from(merchants).sort();
}

// Get spending for a specific category in current month
export async function getCategorySpending(category: string): Promise<number> {
  const transactions = await getCurrentMonthTransactions();
  return transactions
    .filter((t) => t.type === 'expense' && t.category === category)
    .reduce((sum, t) => sum + t.amount, 0);
}

// Get transaction by Plaid transaction ID (to prevent duplicates during sync)
export async function getTransactionByPlaidId(
  plaidTransactionId: string
): Promise<Transaction | undefined> {
  const transactions = await db.transactions.toArray();
  return transactions.find((t) => t.plaidTransactionId === plaidTransactionId);
}
