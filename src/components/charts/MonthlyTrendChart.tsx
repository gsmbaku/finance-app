import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { format } from 'date-fns';
import { formatCurrency } from '@/utils/formatters';

interface DailyData {
  date: string;
  amount: number;
  count: number;
}

interface MonthlyTrendChartProps {
  data: DailyData[];
  showArea?: boolean;
}

export function MonthlyTrendChart({ data, showArea = true }: MonthlyTrendChartProps) {
  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400 dark:text-gray-500">
        No spending data to display
      </div>
    );
  }

  const chartData = data.map((item) => ({
    ...item,
    displayDate: format(new Date(item.date), 'MMM d'),
  }));

  const Chart = showArea ? AreaChart : LineChart;

  return (
    <ResponsiveContainer width="100%" height={280}>
      <Chart data={chartData}>
        <defs>
          <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:opacity-20" />
        <XAxis
          dataKey="displayDate"
          tick={{ fontSize: 12, fill: '#6b7280' }}
          tickLine={false}
          axisLine={{ stroke: '#e5e7eb' }}
        />
        <YAxis
          tick={{ fontSize: 12, fill: '#6b7280' }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-white dark:bg-gray-800 px-3 py-2 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                  <p className="font-medium text-gray-900 dark:text-white">{label}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formatCurrency(payload[0].value as number)}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    {payload[0].payload.count} transactions
                  </p>
                </div>
              );
            }
            return null;
          }}
        />
        {showArea ? (
          <Area
            type="monotone"
            dataKey="amount"
            stroke="#3b82f6"
            strokeWidth={2}
            fill="url(#colorAmount)"
          />
        ) : (
          <Line
            type="monotone"
            dataKey="amount"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#3b82f6' }}
          />
        )}
      </Chart>
    </ResponsiveContainer>
  );
}
