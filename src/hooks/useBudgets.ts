import { useState, useEffect, useCallback } from 'react';
import type { Budget, CreateBudgetDTO, UpdateBudgetDTO, BudgetProgress, BudgetSummary } from '@/types';
import * as budgetService from '@/services/budgetService';

export function useBudgets() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchBudgets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await budgetService.getBudgets();
      setBudgets(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch budgets'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  const addBudget = useCallback(async (data: CreateBudgetDTO) => {
    try {
      const newBudget = await budgetService.createBudget(data);
      setBudgets((prev) => [...prev, newBudget]);
      return newBudget;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to add budget');
    }
  }, []);

  const updateBudget = useCallback(async (id: string, data: UpdateBudgetDTO) => {
    try {
      const updated = await budgetService.updateBudget(id, data);
      if (updated) {
        setBudgets((prev) => prev.map((b) => (b.id === id ? updated : b)));
      }
      return updated;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update budget');
    }
  }, []);

  const deleteBudget = useCallback(async (id: string) => {
    try {
      const success = await budgetService.deleteBudget(id);
      if (success) {
        setBudgets((prev) => prev.filter((b) => b.id !== id));
      }
      return success;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete budget');
    }
  }, []);

  return {
    budgets,
    loading,
    error,
    refetch: fetchBudgets,
    addBudget,
    updateBudget,
    deleteBudget,
  };
}

export function useBudgetProgress() {
  const [progress, setProgress] = useState<BudgetProgress[]>([]);
  const [summary, setSummary] = useState<BudgetSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProgress = useCallback(async () => {
    try {
      setLoading(true);
      const [progressData, summaryData] = await Promise.all([
        budgetService.getAllBudgetProgress(),
        budgetService.getBudgetSummary(),
      ]);
      setProgress(progressData);
      setSummary(summaryData);
    } catch (err) {
      console.error('Failed to fetch budget progress:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  return { progress, summary, loading, refetch: fetchProgress };
}
