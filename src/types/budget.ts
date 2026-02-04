export type BudgetStatus = 'under' | 'warning' | 'over';

export interface Budget {
  id: string;
  category: string;
  monthlyLimit: number;
  alertThreshold: number; // percentage (0-100), default 75
  rollover: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBudgetDTO {
  category: string;
  monthlyLimit: number;
  alertThreshold?: number;
  rollover?: boolean;
}

export interface UpdateBudgetDTO extends Partial<CreateBudgetDTO> {}

export interface BudgetProgress {
  budget: Budget;
  spent: number;
  remaining: number;
  percentage: number;
  status: BudgetStatus;
  daysRemaining: number;
  projectedTotal: number;
}

export interface BudgetSummary {
  totalBudgeted: number;
  totalSpent: number;
  totalRemaining: number;
  overallPercentage: number;
  budgetsOnTrack: number;
  budgetsAtRisk: number;
  budgetsOverBudget: number;
}
