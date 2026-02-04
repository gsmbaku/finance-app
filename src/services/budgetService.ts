import { db, generateId } from '@/database/db';
import type {
  Budget,
  CreateBudgetDTO,
  UpdateBudgetDTO,
  BudgetProgress,
  BudgetSummary,
  BudgetStatus,
} from '@/types';
import { getCategorySpending } from './transactionService';
import { startOfMonth, endOfMonth, differenceInDays } from 'date-fns';

// Create a new budget
export async function createBudget(data: CreateBudgetDTO): Promise<Budget> {
  // Check if budget for this category already exists
  const existing = await db.budgets.where('category').equals(data.category).first();
  if (existing) {
    throw new Error(`Budget for category "${data.category}" already exists`);
  }

  const now = new Date();
  const budget: Budget = {
    id: generateId(),
    category: data.category,
    monthlyLimit: data.monthlyLimit,
    alertThreshold: data.alertThreshold ?? 75,
    rollover: data.rollover ?? false,
    createdAt: now,
    updatedAt: now,
  };

  await db.budgets.add(budget);
  return budget;
}

// Get a budget by ID
export async function getBudget(id: string): Promise<Budget | undefined> {
  return db.budgets.get(id);
}

// Get budget by category
export async function getBudgetByCategory(category: string): Promise<Budget | undefined> {
  return db.budgets.where('category').equals(category).first();
}

// Update a budget
export async function updateBudget(
  id: string,
  data: UpdateBudgetDTO
): Promise<Budget | undefined> {
  const existing = await db.budgets.get(id);
  if (!existing) return undefined;

  const updated: Budget = {
    ...existing,
    ...data,
    updatedAt: new Date(),
  };

  await db.budgets.put(updated);
  return updated;
}

// Delete a budget
export async function deleteBudget(id: string): Promise<boolean> {
  const existing = await db.budgets.get(id);
  if (!existing) return false;

  await db.budgets.delete(id);
  return true;
}

// Get all budgets
export async function getBudgets(): Promise<Budget[]> {
  return db.budgets.toArray();
}

// Calculate budget progress for a single budget
export async function getBudgetProgress(budget: Budget): Promise<BudgetProgress> {
  const spent = await getCategorySpending(budget.category);
  const remaining = Math.max(0, budget.monthlyLimit - spent);
  const percentage = (spent / budget.monthlyLimit) * 100;

  // Calculate days remaining in month
  const now = new Date();
  const monthEnd = endOfMonth(now);
  const daysRemaining = differenceInDays(monthEnd, now) + 1;

  // Project total spending for the month based on current pace
  const monthStart = startOfMonth(now);
  const daysPassed = differenceInDays(now, monthStart) + 1;
  const dailyAverage = spent / daysPassed;
  const totalDaysInMonth = differenceInDays(monthEnd, monthStart) + 1;
  const projectedTotal = dailyAverage * totalDaysInMonth;

  // Determine status
  let status: BudgetStatus;
  if (percentage >= 100) {
    status = 'over';
  } else if (percentage >= budget.alertThreshold) {
    status = 'warning';
  } else {
    status = 'under';
  }

  return {
    budget,
    spent,
    remaining,
    percentage,
    status,
    daysRemaining,
    projectedTotal,
  };
}

// Get progress for all budgets
export async function getAllBudgetProgress(): Promise<BudgetProgress[]> {
  const budgets = await getBudgets();
  return Promise.all(budgets.map((budget) => getBudgetProgress(budget)));
}

// Get budget summary
export async function getBudgetSummary(): Promise<BudgetSummary> {
  const progressList = await getAllBudgetProgress();

  const totalBudgeted = progressList.reduce((sum, p) => sum + p.budget.monthlyLimit, 0);
  const totalSpent = progressList.reduce((sum, p) => sum + p.spent, 0);
  const totalRemaining = totalBudgeted - totalSpent;
  const overallPercentage = totalBudgeted > 0 ? (totalSpent / totalBudgeted) * 100 : 0;

  const budgetsOnTrack = progressList.filter((p) => p.status === 'under').length;
  const budgetsAtRisk = progressList.filter((p) => p.status === 'warning').length;
  const budgetsOverBudget = progressList.filter((p) => p.status === 'over').length;

  return {
    totalBudgeted,
    totalSpent,
    totalRemaining,
    overallPercentage,
    budgetsOnTrack,
    budgetsAtRisk,
    budgetsOverBudget,
  };
}

// Check if any budgets need alerts
export async function checkBudgetAlerts(): Promise<BudgetProgress[]> {
  const progressList = await getAllBudgetProgress();
  return progressList.filter((p) => p.status === 'warning' || p.status === 'over');
}

// Get recommended daily spending to stay within budget
export async function getDailySpendingRecommendation(budget: Budget): Promise<number> {
  const progress = await getBudgetProgress(budget);
  if (progress.daysRemaining <= 0) return 0;
  return progress.remaining / progress.daysRemaining;
}
