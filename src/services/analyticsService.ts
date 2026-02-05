import type { Transaction } from '@/types';
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  subMonths,
  subDays,
} from 'date-fns';
import { getTransactions, getSpendingByCategory, getTransactionStats } from './transactionService';
import { getAllBudgetProgress, getBudgetSummary } from './budgetService';

// Daily spending for charts
export interface DailySpending {
  date: string;
  amount: number;
  count: number;
}

// Get daily spending for a date range
export async function getDailySpending(
  startDate: Date,
  endDate: Date
): Promise<DailySpending[]> {
  const transactions = await getTransactions({
    startDate,
    endDate,
    types: ['expense'],
  });

  // Create map of dates to spending
  const dailyMap = new Map<string, { amount: number; count: number }>();

  // Initialize all days in range
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  for (const day of days) {
    const key = format(day, 'yyyy-MM-dd');
    dailyMap.set(key, { amount: 0, count: 0 });
  }

  // Add transaction data
  for (const t of transactions) {
    const key = format(new Date(t.date), 'yyyy-MM-dd');
    const existing = dailyMap.get(key) || { amount: 0, count: 0 };
    dailyMap.set(key, {
      amount: existing.amount + t.amount,
      count: existing.count + 1,
    });
  }

  return Array.from(dailyMap.entries())
    .map(([date, data]) => ({ date, ...data }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

// Get current month daily spending
export async function getCurrentMonthDailySpending(): Promise<DailySpending[]> {
  const now = new Date();
  return getDailySpending(startOfMonth(now), now);
}

// Monthly spending comparison
export interface MonthlyComparison {
  month: string;
  totalSpent: number;
  totalIncome: number;
  netAmount: number;
  transactionCount: number;
}

// Get spending for last N months
export async function getMonthlyComparison(months: number = 6): Promise<MonthlyComparison[]> {
  const results: MonthlyComparison[] = [];
  const now = new Date();

  for (let i = 0; i < months; i++) {
    const monthDate = subMonths(now, i);
    const start = startOfMonth(monthDate);
    const end = endOfMonth(monthDate);

    const stats = await getTransactionStats(start, end);

    results.push({
      month: format(monthDate, 'MMM yyyy'),
      totalSpent: stats.totalExpenses,
      totalIncome: stats.totalIncome,
      netAmount: stats.netAmount,
      transactionCount: stats.transactionCount,
    });
  }

  return results.reverse();
}

// Spending by day of week
export interface DayOfWeekSpending {
  day: string;
  average: number;
  total: number;
  count: number;
}

export async function getSpendingByDayOfWeek(): Promise<DayOfWeekSpending[]> {
  const transactions = await getTransactions({ types: ['expense'] });

  const dayMap = new Map<number, { total: number; count: number }>();

  // Initialize all days
  for (let i = 0; i < 7; i++) {
    dayMap.set(i, { total: 0, count: 0 });
  }

  // Add transaction data
  for (const t of transactions) {
    const dayOfWeek = new Date(t.date).getDay();
    const existing = dayMap.get(dayOfWeek)!;
    dayMap.set(dayOfWeek, {
      total: existing.total + t.amount,
      count: existing.count + 1,
    });
  }

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return Array.from(dayMap.entries()).map(([dayIndex, data]) => ({
    day: dayNames[dayIndex],
    total: data.total,
    count: data.count,
    average: data.count > 0 ? data.total / data.count : 0,
  }));
}

// Dashboard data aggregation
export interface DashboardData {
  currentMonth: {
    totalSpent: number;
    totalIncome: number;
    netAmount: number;
    transactionCount: number;
    averageExpense: number;
  };
  budgetSummary: Awaited<ReturnType<typeof getBudgetSummary>>;
  categoryBreakdown: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
  recentTransactions: Transaction[];
  dailySpending: DailySpending[];
  budgetProgress: Awaited<ReturnType<typeof getAllBudgetProgress>>;
}

export async function getDashboardData(): Promise<DashboardData> {
  const now = new Date();
  const thirtyDaysAgo = subDays(now, 30);

  // Fetch all data in parallel using last 30 days for stats/charts
  const [
    stats,
    budgetSummary,
    categorySpending,
    recentTransactions,
    dailySpending,
    budgetProgress,
  ] = await Promise.all([
    getTransactionStats(thirtyDaysAgo, now),
    getBudgetSummary(),
    getSpendingByCategory(thirtyDaysAgo, now),
    getTransactions({}).then((txs) => txs.slice(0, 10)),
    getDailySpending(thirtyDaysAgo, now),
    getAllBudgetProgress(),
  ]);

  // Calculate category percentages
  const totalCategorySpending = categorySpending.reduce((sum, c) => sum + c.amount, 0);
  const categoryBreakdown = categorySpending.map((c) => ({
    category: c.category,
    amount: c.amount,
    percentage: totalCategorySpending > 0 ? (c.amount / totalCategorySpending) * 100 : 0,
  }));

  return {
    currentMonth: {
      totalSpent: stats.totalExpenses,
      totalIncome: stats.totalIncome,
      netAmount: stats.netAmount,
      transactionCount: stats.transactionCount,
      averageExpense: stats.averageExpense,
    },
    budgetSummary,
    categoryBreakdown,
    recentTransactions,
    dailySpending,
    budgetProgress,
  };
}

// Top merchants by spending
export async function getTopMerchants(
  limit: number = 5,
  startDate?: Date,
  endDate?: Date
): Promise<Array<{ merchant: string; amount: number; count: number }>> {
  const transactions = await getTransactions({
    startDate,
    endDate,
    types: ['expense'],
  });

  const merchantMap = new Map<string, { amount: number; count: number }>();

  for (const t of transactions) {
    const existing = merchantMap.get(t.merchant) || { amount: 0, count: 0 };
    merchantMap.set(t.merchant, {
      amount: existing.amount + t.amount,
      count: existing.count + 1,
    });
  }

  return Array.from(merchantMap.entries())
    .map(([merchant, data]) => ({ merchant, ...data }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, limit);
}
