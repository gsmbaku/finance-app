import { Card, CardHeader, CardContent } from '@/components/ui';
import { BarChart3, PieChart, TrendingUp } from 'lucide-react';

export function AnalyticsPage() {
  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Insights and trends from your financial data.
        </p>
      </div>

      {/* Charts grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Monthly trend */}
        <Card>
          <CardHeader
            title="Monthly Trend"
            subtitle="Your spending over time"
            action={
              <div className="p-1.5 rounded-lg bg-primary-100 dark:bg-primary-900/30">
                <TrendingUp className="w-4 h-4 text-primary-600" />
              </div>
            }
          />
          <CardContent>
            <div className="h-64 flex items-center justify-center text-gray-400 dark:text-gray-500 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
              Monthly trend chart will be displayed here
            </div>
          </CardContent>
        </Card>

        {/* Category breakdown */}
        <Card>
          <CardHeader
            title="Category Breakdown"
            subtitle="Where your money goes"
            action={
              <div className="p-1.5 rounded-lg bg-accent-100 dark:bg-accent-900/30">
                <PieChart className="w-4 h-4 text-accent-600" />
              </div>
            }
          />
          <CardContent>
            <div className="h-64 flex items-center justify-center text-gray-400 dark:text-gray-500 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
              Category pie chart will be displayed here
            </div>
          </CardContent>
        </Card>

        {/* Day of week spending */}
        <Card>
          <CardHeader
            title="Spending by Day"
            subtitle="Which days you spend the most"
            action={
              <div className="p-1.5 rounded-lg bg-warning-100 dark:bg-warning-900/30">
                <BarChart3 className="w-4 h-4 text-warning-600" />
              </div>
            }
          />
          <CardContent>
            <div className="h-64 flex items-center justify-center text-gray-400 dark:text-gray-500 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
              Day of week chart will be displayed here
            </div>
          </CardContent>
        </Card>

        {/* Top merchants */}
        <Card>
          <CardHeader
            title="Top Merchants"
            subtitle="Where you spend the most"
          />
          <CardContent>
            <div className="text-center text-gray-400 dark:text-gray-500 py-8">
              Add transactions to see your top merchants.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
