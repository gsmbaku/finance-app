import { Target, TrendingUp, Trophy } from 'lucide-react';
import { Card, CardContent, ProgressBar } from '@/components/ui';
import { formatCurrency } from '@/utils/formatters';
import type { GoalsSummary } from '@/services/goalsService';

interface GoalSummaryCardProps {
  summary: GoalsSummary;
}

export function GoalSummaryCard({ summary }: GoalSummaryCardProps) {
  const { activeGoals, completedGoals, totalSaved, overallPercentage } = summary;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Active Goals */}
      <Card>
        <CardContent>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30">
              <Target className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Active Goals</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                {activeGoals}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Saved */}
      <Card>
        <CardContent>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent-100 dark:bg-accent-900/30">
              <TrendingUp className="w-5 h-5 text-accent-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Saved</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white tabular-nums">
                {formatCurrency(totalSaved)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Completed */}
      <Card>
        <CardContent>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning-100 dark:bg-warning-900/30">
              <Trophy className="w-5 h-5 text-warning-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Completed</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                {completedGoals}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overall Progress */}
      <Card className="col-span-2 lg:col-span-1">
        <CardContent>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Overall Progress</p>
            <ProgressBar value={overallPercentage} max={100} showLabel color="success" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
