import { useState, useEffect, useCallback } from 'react';
import type { Transaction, CreateTransactionDTO, UpdateTransactionDTO, TransactionFilters } from '@/types';
import * as transactionService from '@/services/transactionService';

interface UseTransactionsOptions {
  filters?: TransactionFilters;
  autoFetch?: boolean;
}

export function useTransactions(options: UseTransactionsOptions = {}) {
  const { filters, autoFetch = true } = options;
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await transactionService.getTransactions(filters);
      setTransactions(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch transactions'));
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    if (autoFetch) {
      fetchTransactions();
    }
  }, [autoFetch, fetchTransactions]);

  const addTransaction = useCallback(async (data: CreateTransactionDTO) => {
    try {
      const newTransaction = await transactionService.createTransaction(data);
      setTransactions((prev) => [newTransaction, ...prev]);
      return newTransaction;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to add transaction');
    }
  }, []);

  const updateTransaction = useCallback(async (id: string, data: UpdateTransactionDTO) => {
    try {
      const updated = await transactionService.updateTransaction(id, data);
      if (updated) {
        setTransactions((prev) =>
          prev.map((t) => (t.id === id ? updated : t))
        );
      }
      return updated;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update transaction');
    }
  }, []);

  const deleteTransaction = useCallback(async (id: string) => {
    try {
      const success = await transactionService.deleteTransaction(id);
      if (success) {
        setTransactions((prev) => prev.filter((t) => t.id !== id));
      }
      return success;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete transaction');
    }
  }, []);

  return {
    transactions,
    loading,
    error,
    refetch: fetchTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  };
}

// Hook for transaction statistics
export function useTransactionStats(startDate?: Date, endDate?: Date) {
  const [stats, setStats] = useState<Awaited<ReturnType<typeof transactionService.getTransactionStats>> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const data = await transactionService.getTransactionStats(startDate, endDate);
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch transaction stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [startDate, endDate]);

  return { stats, loading };
}
