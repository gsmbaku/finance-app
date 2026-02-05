import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, Wallet, PiggyBank, Plus, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardContent, Button, ProgressBar } from '@/components/ui';
import { SpendingPieChart, MonthlyTrendChart } from '@/components/charts';
import { useDashboardData } from '@/hooks/useAnalytics';
import { formatCurrency, formatDateShort } from '@/utils/formatters';
import { getCategoryById } from '@/utils/categories';

export function DashboardPage() {
  const { data, loading } = useDashboardData();

  if (loading) {
    return (
      <div className="p-4 lg:p-6 space-y-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded" />
              </Card>
            ))}
          </div>
          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <div className="h-72 bg-gray-200 dark:bg-gray-700 rounded" />
            </Card>
            <Card>
              <div className="h-72 bg-gray-200 dark:bg-gray-700 rounded" />
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const stats = data?.currentMonth || {
    totalSpent: 0,
    totalIncome: 0,
    netAmount: 0,
    transactionCount: 0,
    averageExpense: 0,
  };

  const budgetSummary = data?.budgetSummary || {
    totalBudgeted: 0,
    totalSpent: 0,
    overallPercentage: 0,
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Your financial overview for the last 30 days.
          </p>
        </div>
        <Link to="/transactions">
          <Button leftIcon={<Plus className="w-4 h-4" />}>
            Add Transaction
          </Button>
        </Link>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-expense-100 dark:bg-expense-900/30">
                <TrendingDown className="w-5 h-5 text-expense-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Spent</p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white tabular-nums">
                  {formatCurrency(stats.totalSpent)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent-100 dark:bg-accent-900/30">
                <TrendingUp className="w-5 h-5 text-accent-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Income</p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white tabular-nums">
                  {formatCurrency(stats.totalIncome)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30">
                <Wallet className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Budget Used</p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white tabular-nums">
                  {budgetSummary.totalBudgeted > 0
                    ? `${budgetSummary.overallPercentage.toFixed(0)}%`
                    : '—'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning-100 dark:bg-warning-900/30">
                <PiggyBank className="w-5 h-5 text-warning-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Net</p>
                <p className={`text-xl font-semibold tabular-nums ${
                  stats.netAmount >= 0
                    ? 'text-accent-600 dark:text-accent-400'
                    : 'text-expense-600 dark:text-expense-400'
                }`}>
                  {formatCurrency(stats.netAmount)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main content grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Spending trend chart */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="Spending Trend"
            subtitle="Last 30 days"
            action={
              <Link to="/analytics">
                <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  View All
                </Button>
              </Link>
            }
          />
          <CardContent>
            <MonthlyTrendChart data={data?.dailySpending || []} />
          </CardContent>
        </Card>

        {/* Category breakdown */}
        <Card>
          <CardHeader title="By Category" subtitle="Where your money goes" />
          <CardContent>
            <SpendingPieChart data={data?.categoryBreakdown || []} />
          </CardContent>
        </Card>
      </div>

      {/* Budget progress and recent transactions */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Budget progress */}
        <Card>
          <CardHeader
            title="Budget Progress"
            subtitle="Track your category budgets"
            action={
              <Link to="/budgets">
                <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Manage
                </Button>
              </Link>
            }
          />
          <CardContent>
            {data?.budgetProgress && data.budgetProgress.length > 0 ? (
              <div className="space-y-4">
                {data.budgetProgress.slice(0, 4).map((bp) => {
                  const category = getCategoryById(bp.budget.category);
                  return (
                    <div key={bp.budget.id}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {category?.name}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {formatCurrency(bp.spent)} / {formatCurrency(bp.budget.monthlyLimit)}
                        </span>
                      </div>
                      <ProgressBar value={bp.percentage} max={100} size="sm" color="auto" />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center text-gray-400 dark:text-gray-500 py-8">
                <p>No budgets set yet.</p>
                <Link to="/budgets">
                  <Button variant="secondary" size="sm" className="mt-2">
                    Create Budget
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent transactions */}
        <Card>
          <CardHeader
            title="Recent Transactions"
            subtitle="Your latest activity"
            action={
              <Link to="/transactions">
                <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  View All
                </Button>
              </Link>
            }
          />
          <CardContent>
            {data?.recentTransactions && data.recentTransactions.length > 0 ? (
              <div className="space-y-3">
                {data.recentTransactions.map((transaction) => {
                  const category = getCategoryById(transaction.category);
                  const CategoryIcon = category?.icon;
                  const isExpense = transaction.type === 'expense';

                  return (
                    <div key={transaction.id} className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${category?.color}20` }}
                      >
                        {CategoryIcon && (
                          <CategoryIcon className="w-4 h-4" style={{ color: category?.color }} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {transaction.merchant}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDateShort(transaction.date)}
                        </p>
                      </div>
                      <span
                        className={`text-sm font-medium tabular-nums ${
                          isExpense
                            ? 'text-expense-600 dark:text-expense-400'
                            : 'text-accent-600 dark:text-accent-400'
                        }`}
                      >
                        {isExpense ? '-' : '+'}
                        {formatCurrency(transaction.amount)}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center text-gray-400 dark:text-gray-500 py-8">
                <p>No transactions yet.</p>
                <Link to="/transactions">
                  <Button variant="secondary" size="sm" className="mt-2">
                    Add Transaction
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
