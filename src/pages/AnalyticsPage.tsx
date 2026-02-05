import { Card, CardHeader, CardContent } from '@/components/ui';
import { SpendingPieChart } from '@/components/charts';
import { useMonthlyComparison, useTopMerchants, useSpendingByCategory, useSpendingByDayOfWeek } from '@/hooks/useAnalytics';
import { formatCurrency } from '@/utils/formatters';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

export function AnalyticsPage() {
  const { data: monthlyData, loading: monthlyLoading } = useMonthlyComparison(6);
  const { data: merchants, loading: merchantsLoading } = useTopMerchants(10);
  const { data: categoryData, loading: categoryLoading } = useSpendingByCategory();
  const { data: dayOfWeekData, loading: dayOfWeekLoading } = useSpendingByDayOfWeek();

  // Transform category data for pie chart
  const totalCategorySpending = categoryData.reduce((sum, c) => sum + c.amount, 0);
  const pieData = categoryData.map((c) => ({
    category: c.category,
    amount: c.amount,
    percentage: totalCategorySpending > 0 ? (c.amount / totalCategorySpending) * 100 : 0,
  }));

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
        <Card className="lg:col-span-2">
          <CardHeader
            title="Monthly Overview"
            subtitle="Income vs spending over the last 6 months"
          />
          <CardContent>
            {monthlyLoading ? (
              <div className="h-72 animate-pulse bg-gray-100 dark:bg-gray-800 rounded-xl" />
            ) : monthlyData.length === 0 ? (
              <div className="h-72 flex items-center justify-center text-gray-400 dark:text-gray-500">
                No monthly data yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:opacity-20" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    tickLine={false}
                    axisLine={{ stroke: '#e5e7eb' }}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `$${v}`}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white dark:bg-gray-800 px-4 py-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                            <p className="font-medium text-gray-900 dark:text-white mb-1">{label}</p>
                            {payload.map((entry, i) => (
                              <p key={i} className="text-sm" style={{ color: entry.color }}>
                                {entry.name}: {formatCurrency(entry.value as number)}
                              </p>
                            ))}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="totalIncome"
                    name="Income"
                    stroke="#10b981"
                    strokeWidth={2}
                    fill="url(#colorIncome)"
                  />
                  <Area
                    type="monotone"
                    dataKey="totalSpent"
                    name="Spending"
                    stroke="#ef4444"
                    strokeWidth={2}
                    fill="url(#colorSpent)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Category breakdown */}
        <Card>
          <CardHeader
            title="Category Breakdown"
            subtitle="Where your money goes"
          />
          <CardContent>
            {categoryLoading ? (
              <div className="h-72 animate-pulse bg-gray-100 dark:bg-gray-800 rounded-xl" />
            ) : (
              <SpendingPieChart data={pieData} />
            )}
          </CardContent>
        </Card>

        {/* Day of week spending */}
        <Card>
          <CardHeader
            title="Spending by Day"
            subtitle="Which days you spend the most"
          />
          <CardContent>
            {dayOfWeekLoading ? (
              <div className="h-72 animate-pulse bg-gray-100 dark:bg-gray-800 rounded-xl" />
            ) : dayOfWeekData.length === 0 ? (
              <div className="h-72 flex items-center justify-center text-gray-400 dark:text-gray-500">
                No spending data yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={dayOfWeekData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:opacity-20" />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 11, fill: '#6b7280' }}
                    tickLine={false}
                    axisLine={{ stroke: '#e5e7eb' }}
                    tickFormatter={(v) => v.slice(0, 3)}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `$${v}`}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white dark:bg-gray-800 px-3 py-2 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                            <p className="font-medium text-gray-900 dark:text-white">{label}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Total: {formatCurrency(payload[0].payload.total)}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Avg: {formatCurrency(payload[0].payload.average)}
                            </p>
                            <p className="text-xs text-gray-400">{payload[0].payload.count} transactions</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar
                    dataKey="total"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Top merchants */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="Top Merchants"
            subtitle="Where you spend the most"
          />
          <CardContent>
            {merchantsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg" />
                ))}
              </div>
            ) : merchants.length === 0 ? (
              <div className="text-center text-gray-400 dark:text-gray-500 py-8">
                No transaction data yet.
              </div>
            ) : (
              <div className="space-y-3">
                {merchants.map((merchant, index) => {
                  const maxAmount = merchants[0]?.amount || 1;
                  const widthPercent = (merchant.amount / maxAmount) * 100;

                  return (
                    <div key={merchant.merchant} className="flex items-center gap-4">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-6 text-right">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {merchant.merchant}
                          </span>
                          <span className="text-sm font-semibold text-gray-900 dark:text-white ml-4 tabular-nums">
                            {formatCurrency(merchant.amount)}
                          </span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                          <div
                            className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${widthPercent}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                          {merchant.count} transaction{merchant.count !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
