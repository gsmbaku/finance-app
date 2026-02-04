export type GoalPriority = 'high' | 'medium' | 'low';
export type GoalStatus = 'active' | 'completed' | 'paused' | 'cancelled';

export interface Goal {
  id: string;
  name: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date;
  priority: GoalPriority;
  category: string;
  motivations: string[];
  status: GoalStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateGoalDTO {
  name: string;
  description?: string;
  targetAmount: number;
  currentAmount?: number;
  deadline: Date;
  priority: GoalPriority;
  category: string;
  motivations?: string[];
}

export interface UpdateGoalDTO extends Partial<CreateGoalDTO> {
  status?: GoalStatus;
}

export interface GoalProgress {
  goal: Goal;
  amountRemaining: number;
  percentage: number;
  daysRemaining: number;
  monthlyRequired: number;
  weeklyRequired: number;
  onTrack: boolean;
}
