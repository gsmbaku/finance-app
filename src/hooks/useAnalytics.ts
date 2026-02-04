import { useState, useEffect, useCallback } from 'react';
import * as analyticsService from '@/services/analyticsService';
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
