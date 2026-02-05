import { db, generateId } from '@/database/db';
import type {
  Goal,
  CreateGoalDTO,
  UpdateGoalDTO,
  GoalProgress,
} from '@/types';
import { differenceInDays, differenceInWeeks, differenceInMonths } from 'date-fns';

// Create a new goal
export async function createGoal(data: CreateGoalDTO): Promise<Goal> {
  const now = new Date();
  const goal: Goal = {
    id: generateId(),
    name: data.name,
    description: data.description,
    targetAmount: data.targetAmount,
    currentAmount: data.currentAmount ?? 0,
    deadline: data.deadline,
    priority: data.priority,
    category: data.category,
    motivations: data.motivations ?? [],
    status: 'active',
    createdAt: now,
    updatedAt: now,
  };

  await db.goals.add(goal);
  return goal;
}

// Get a goal by ID
export async function getGoal(id: string): Promise<Goal | undefined> {
  return db.goals.get(id);
}

// Get all goals
export async function getGoals(): Promise<Goal[]> {
  return db.goals.toArray();
}

// Get goals filtered by status
export async function getGoalsByStatus(status: Goal['status']): Promise<Goal[]> {
  return db.goals.where('status').equals(status).toArray();
}

// Update a goal
export async function updateGoal(
  id: string,
  data: UpdateGoalDTO
): Promise<Goal | undefined> {
  const existing = await db.goals.get(id);
  if (!existing) return undefined;

  const updated: Goal = {
    ...existing,
    ...data,
    updatedAt: new Date(),
  };

  // Auto-complete if current amount reaches target
  if (updated.currentAmount >= updated.targetAmount && updated.status === 'active') {
    updated.status = 'completed';
  }

  await db.goals.put(updated);
  return updated;
}

// Delete a goal
export async function deleteGoal(id: string): Promise<boolean> {
  const existing = await db.goals.get(id);
  if (!existing) return false;

  await db.goals.delete(id);
  return true;
}

// Add a contribution to a goal
export async function contributeToGoal(
  id: string,
  amount: number
): Promise<Goal | undefined> {
  const goal = await db.goals.get(id);
  if (!goal) return undefined;

  const newAmount = goal.currentAmount + amount;
  return updateGoal(id, { currentAmount: newAmount });
}

// Calculate progress for a single goal
export function getGoalProgress(goal: Goal): GoalProgress {
  const now = new Date();
  const deadline = new Date(goal.deadline);

  const amountRemaining = Math.max(0, goal.targetAmount - goal.currentAmount);
  const percentage = goal.targetAmount > 0
    ? Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)
    : 0;

  const daysRemaining = differenceInDays(deadline, now);
  const weeksRemaining = differenceInWeeks(deadline, now);
  const monthsRemaining = differenceInMonths(deadline, now);

  // Calculate required savings rates
  const monthlyRequired = monthsRemaining > 0 ? amountRemaining / monthsRemaining : amountRemaining;
  const weeklyRequired = weeksRemaining > 0 ? amountRemaining / weeksRemaining : amountRemaining;

  // Determine if on track based on time elapsed vs progress made
  const totalDays = differenceInDays(deadline, new Date(goal.createdAt));
  const daysElapsed = totalDays - daysRemaining;
  const expectedProgress = totalDays > 0 ? (daysElapsed / totalDays) * 100 : 100;
  const onTrack = goal.status === 'completed' || percentage >= expectedProgress * 0.85;

  return {
    goal,
    amountRemaining,
    percentage,
    daysRemaining,
    monthlyRequired,
    weeklyRequired,
    onTrack,
  };
}

// Get progress for all active goals
export async function getAllGoalProgress(): Promise<GoalProgress[]> {
  const goals = await getGoals();
  return goals
    .filter((g) => g.status === 'active')
    .map((goal) => getGoalProgress(goal));
}

// Goals summary for dashboard / summary cards
export interface GoalsSummary {
  activeGoals: number;
  completedGoals: number;
  totalSaved: number;
  totalTarget: number;
  overallPercentage: number;
}

export async function getGoalsSummary(): Promise<GoalsSummary> {
  const goals = await getGoals();

  const activeGoals = goals.filter((g) => g.status === 'active');
  const completedGoals = goals.filter((g) => g.status === 'completed');

  const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const overallPercentage = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  return {
    activeGoals: activeGoals.length,
    completedGoals: completedGoals.length,
    totalSaved,
    totalTarget,
    overallPercentage,
  };
}
