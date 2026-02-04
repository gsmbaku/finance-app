import { Wallet, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent, ProgressBar } from '@/components/ui';
import { formatCurrency, formatPercentage } from '@/utils/formatters';
import type { BudgetSummary } from '@/types';

interface BudgetSummaryCardProps {
  summary: BudgetSummary;
}

export function BudgetSummaryCard({ summary }: BudgetSummaryCardProps) {
  const {
    totalBudgeted,
    totalSpent,
    totalRemaining,
    overallPercentage,
    budgetsOnTrack,
    budgetsAtRisk,
    budgetsOverBudget,
  } = summary;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Budget */}
      <Card>
        <CardContent>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30">
              <Wallet className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Budget</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white tabular-nums">
                {formatCurrency(totalBudgeted)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Spent */}
      <Card>
        <CardContent>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-expense-100 dark:bg-expense-900/30">
              <TrendingUp className="w-5 h-5 text-expense-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Spent</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white tabular-nums">
                {formatCurrency(totalSpent)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Remaining */}
      <Card>
        <CardContent>
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">Remaining</p>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {formatPercentage(100 - overallPercentage)}
              </span>
            </div>
            <p className="text-xl font-semibold text-gray-900 dark:text-white tabular-nums mb-2">
              {formatCurrency(totalRemaining)}
            </p>
            <ProgressBar value={overallPercentage} max={100} size="sm" color="auto" />
          </div>
        </CardContent>
      </Card>

      {/* Budget Status */}
      <Card>
        <CardContent>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Budget Status</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-accent-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">On Track</span>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{budgetsOnTrack}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-warning-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">At Risk</span>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{budgetsAtRisk}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-expense-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Over Budget</span>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{budgetsOverBudget}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
