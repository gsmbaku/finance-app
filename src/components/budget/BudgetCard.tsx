import { MoreVertical, Pencil, Trash2, AlertTriangle } from 'lucide-react';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { ProgressBar, Badge } from '@/components/ui';
import { getCategoryById } from '@/utils/categories';
import { formatCurrency } from '@/utils/formatters';
import type { BudgetProgress } from '@/types';

interface BudgetCardProps {
  progress: BudgetProgress;
  onEdit: () => void;
  onDelete: () => void;
}

export function BudgetCard({ progress, onEdit, onDelete }: BudgetCardProps) {
  const { budget, spent, remaining, percentage, status, daysRemaining, projectedTotal } = progress;
  const category = getCategoryById(budget.category);
  const CategoryIcon = category?.icon;

  const statusConfig = {
    under: { label: 'On Track', variant: 'success' as const },
    warning: { label: 'At Risk', variant: 'warning' as const },
    over: { label: 'Over Budget', variant: 'danger' as const },
  };

  const dailyRemaining = daysRemaining > 0 ? remaining / daysRemaining : 0;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${category?.color}20` }}
          >
            {CategoryIcon && (
              <CategoryIcon className="w-5 h-5" style={{ color: category?.color }} />
            )}
          </div>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">{category?.name}</h3>
            <Badge variant={statusConfig[status].variant} size="sm" dot>
              {statusConfig[status].label}
            </Badge>
          </div>
        </div>

        <Menu as="div" className="relative">
          <Menu.Button className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-gray-300 dark:hover:bg-gray-800 transition-colors">
            <MoreVertical className="w-4 h-4" />
          </Menu.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 z-10 mt-1 w-36 origin-top-right rounded-xl bg-white dark:bg-gray-900 shadow-lg ring-1 ring-black/5 dark:ring-white/10 focus:outline-none">
              <div className="py-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={onEdit}
                      className={`${
                        active ? 'bg-gray-100 dark:bg-gray-800' : ''
                      } flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300`}
                    >
                      <Pencil className="w-4 h-4" />
                      Edit
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={onDelete}
                      className={`${
                        active ? 'bg-gray-100 dark:bg-gray-800' : ''
                      } flex w-full items-center gap-2 px-3 py-2 text-sm text-expense-600 dark:text-expense-400`}
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>

      {/* Progress */}
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">
            {formatCurrency(spent)} of {formatCurrency(budget.monthlyLimit)}
          </span>
          <span className="font-medium text-gray-900 dark:text-white tabular-nums">
            {percentage.toFixed(0)}%
          </span>
        </div>

        <ProgressBar value={percentage} max={100} size="md" color="auto" />

        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">
            {formatCurrency(remaining)} remaining
          </span>
          {daysRemaining > 0 && (
            <span className="text-gray-500 dark:text-gray-400">
              {daysRemaining} days left
            </span>
          )}
        </div>
      </div>

      {/* Insights */}
      {status !== 'under' && (
        <div className={`mt-4 p-3 rounded-xl ${
          status === 'over'
            ? 'bg-expense-50 dark:bg-expense-900/20'
            : 'bg-warning-50 dark:bg-warning-900/20'
        }`}>
          <div className="flex items-start gap-2">
            <AlertTriangle className={`w-4 h-4 mt-0.5 ${
              status === 'over' ? 'text-expense-600' : 'text-warning-600'
            }`} />
            <div className="text-sm">
              {status === 'over' ? (
                <p className="text-expense-700 dark:text-expense-300">
                  You've exceeded your budget by {formatCurrency(spent - budget.monthlyLimit)}.
                </p>
              ) : (
                <p className="text-warning-700 dark:text-warning-300">
                  At this pace, you'll spend {formatCurrency(projectedTotal)} by month end.
                  Try to keep daily spending under {formatCurrency(dailyRemaining)}.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
