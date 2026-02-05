import { useState, useEffect, useCallback } from 'react';
import * as analyticsService from '@/services/analyticsService';
import * as transactionService from '@/services/transactionService';
import type { DashboardData } from '@/services/analyticsService';

export function useDashboardData() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const dashboardData = await analyticsService.getDashboardData();
      setData(dashboardData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch dashboard data'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export function useMonthlyComparison(months: number = 6) {
  const [data, setData] = useState<Awaited<ReturnType<typeof analyticsService.getMonthlyComparison>>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const comparison = await analyticsService.getMonthlyComparison(months);
        setData(comparison);
      } catch (err) {
        console.error('Failed to fetch monthly comparison:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [months]);

  return { data, loading };
}

export function useTopMerchants(limit: number = 5) {
  const [data, setData] = useState<Awaited<ReturnType<typeof analyticsService.getTopMerchants>>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const merchants = await analyticsService.getTopMerchants(limit);
        setData(merchants);
      } catch (err) {
        console.error('Failed to fetch top merchants:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [limit]);

  return { data, loading };
}

export function useSpendingByCategory() {
  const [data, setData] = useState<Awaited<ReturnType<typeof transactionService.getSpendingByCategory>>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const categories = await transactionService.getSpendingByCategory();
        setData(categories);
      } catch (err) {
        console.error('Failed to fetch category spending:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading };
}

export function useSpendingByDayOfWeek() {
  const [data, setData] = useState<Awaited<ReturnType<typeof analyticsService.getSpendingByDayOfWeek>>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const dayData = await analyticsService.getSpendingByDayOfWeek();
        setData(dayData);
      } catch (err) {
        console.error('Failed to fetch day of week spending:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading };
}
