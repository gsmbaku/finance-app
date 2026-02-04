import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { getCategoryById } from '@/utils/categories';
import { formatCurrency } from '@/utils/formatters';

interface CategoryData {
  category: string;
  amount: number;
  percentage: number;
}

interface SpendingPieChartProps {
  data: CategoryData[];
}

export function SpendingPieChart({ data }: SpendingPieChartProps) {
  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400 dark:text-gray-500">
        No spending data to display
      </div>
    );
  }

  const chartData = data.slice(0, 6).map((item) => {
    const category = getCategoryById(item.category);
    return {
      name: category?.name || item.category,
      value: item.amount,
      color: category?.color || '#6b7280',
      percentage: item.percentage,
    };
  });

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={2}
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const data = payload[0].payload;
              return (
                <div className="bg-white dark:bg-gray-800 px-3 py-2 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                  <p className="font-medium text-gray-900 dark:text-white">{data.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formatCurrency(data.value)} ({data.percentage.toFixed(1)}%)
                  </p>
                </div>
              );
            }
            return null;
          }}
        />
        <Legend
          layout="vertical"
          align="right"
          verticalAlign="middle"
          formatter={(value: string) => (
            <span className="text-sm text-gray-700 dark:text-gray-300">{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
