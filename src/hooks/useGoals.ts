import { useState, useEffect, useCallback } from 'react';
import type { Goal, CreateGoalDTO, UpdateGoalDTO, GoalProgress } from '@/types';
import type { GoalsSummary } from '@/services/goalsService';
import * as goalsService from '@/services/goalsService';

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchGoals = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await goalsService.getGoals();
      setGoals(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch goals'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const addGoal = useCallback(async (data: CreateGoalDTO) => {
    try {
      const newGoal = await goalsService.createGoal(data);
      setGoals((prev) => [...prev, newGoal]);
      return newGoal;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to add goal');
    }
  }, []);

  const updateGoal = useCallback(async (id: string, data: UpdateGoalDTO) => {
    try {
      const updated = await goalsService.updateGoal(id, data);
      if (updated) {
        setGoals((prev) => prev.map((g) => (g.id === id ? updated : g)));
      }
      return updated;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update goal');
    }
  }, []);

  const deleteGoal = useCallback(async (id: string) => {
    try {
      const success = await goalsService.deleteGoal(id);
      if (success) {
        setGoals((prev) => prev.filter((g) => g.id !== id));
      }
      return success;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete goal');
    }
  }, []);

  const contributeToGoal = useCallback(async (id: string, amount: number) => {
    try {
      const updated = await goalsService.contributeToGoal(id, amount);
      if (updated) {
        setGoals((prev) => prev.map((g) => (g.id === id ? updated : g)));
      }
      return updated;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to contribute to goal');
    }
  }, []);

  return {
    goals,
    loading,
    error,
    refetch: fetchGoals,
    addGoal,
    updateGoal,
    deleteGoal,
    contributeToGoal,
  };
}

export function useGoalProgress() {
  const [progress, setProgress] = useState<GoalProgress[]>([]);
  const [summary, setSummary] = useState<GoalsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProgress = useCallback(async () => {
    try {
      setLoading(true);
      const [progressData, summaryData] = await Promise.all([
        goalsService.getAllGoalProgress(),
        goalsService.getGoalsSummary(),
      ]);
      setProgress(progressData);
      setSummary(summaryData);
    } catch (err) {
      console.error('Failed to fetch goal progress:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  return { progress, summary, loading, refetch: fetchProgress };
}
