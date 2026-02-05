import { useState } from 'react';
import { MoreVertical, Pencil, Trash2, Plus, Pause, Play, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { ProgressBar, Badge, Button, Input } from '@/components/ui';
import { formatCurrency, formatDaysRemaining } from '@/utils/formatters';
import { format } from 'date-fns';
import type { GoalProgress } from '@/types';

interface GoalCardProps {
  progress: GoalProgress;
  onEdit: () => void;
  onDelete: () => void;
  onContribute: (amount: number) => Promise<void>;
  onStatusChange: (status: 'active' | 'paused' | 'cancelled') => Promise<void>;
}

export function GoalCard({ progress, onEdit, onDelete, onContribute, onStatusChange }: GoalCardProps) {
  const { goal, amountRemaining, percentage, daysRemaining, monthlyRequired, weeklyRequired, onTrack } = progress;
  const [isContributing, setIsContributing] = useState(false);
  const [contributionAmount, setContributionAmount] = useState('');

  const priorityConfig = {
    high: { label: 'High Priority', variant: 'danger' as const },
    medium: { label: 'Medium', variant: 'warning' as const },
    low: { label: 'Low', variant: 'default' as const },
  };

  const handleContribute = async () => {
    const amount = parseFloat(contributionAmount);
    if (isNaN(amount) || amount <= 0) return;
    await onContribute(amount);
    setContributionAmount('');
    setIsContributing(false);
  };

  const isOverdue = daysRemaining < 0;
  const isCompleted = goal.status === 'completed';
  const isPaused = goal.status === 'paused';

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-2xl border p-5 ${
      isCompleted
        ? 'border-accent-200 dark:border-accent-800'
        : isPaused
        ? 'border-gray-300 dark:border-gray-700 opacity-75'
        : 'border-gray-200 dark:border-gray-800'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium text-gray-900 dark:text-white truncate">{goal.name}</h3>
            {isCompleted && <CheckCircle className="w-4 h-4 text-accent-500 flex-shrink-0" />}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant={priorityConfig[goal.priority].variant} size="sm">
              {priorityConfig[goal.priority].label}
            </Badge>
            <span className="text-xs text-gray-500 dark:text-gray-400">{goal.category}</span>
            {!isCompleted && (
              <Badge variant={onTrack ? 'success' : 'warning'} size="sm" dot>
                {onTrack ? 'On Track' : 'Behind'}
              </Badge>
            )}
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
            <Menu.Items className="absolute right-0 z-10 mt-1 w-44 origin-top-right rounded-xl bg-white dark:bg-gray-900 shadow-lg ring-1 ring-black/5 dark:ring-white/10 focus:outline-none">
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
                {goal.status === 'active' && (
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => onStatusChange('paused')}
                        className={`${
                          active ? 'bg-gray-100 dark:bg-gray-800' : ''
                        } flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300`}
                      >
                        <Pause className="w-4 h-4" />
                        Pause Goal
                      </button>
                    )}
                  </Menu.Item>
                )}
                {goal.status === 'paused' && (
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => onStatusChange('active')}
                        className={`${
                          active ? 'bg-gray-100 dark:bg-gray-800' : ''
                        } flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300`}
                      >
                        <Play className="w-4 h-4" />
                        Resume Goal
                      </button>
                    )}
                  </Menu.Item>
                )}
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

      {/* Description */}
      {goal.description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
          {goal.description}
        </p>
      )}

      {/* Progress */}
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">
            {formatCurrency(goal.currentAmount)} of {formatCurrency(goal.targetAmount)}
          </span>
          <span className="font-medium text-gray-900 dark:text-white tabular-nums">
            {percentage.toFixed(0)}%
          </span>
        </div>

        <ProgressBar
          value={percentage}
          max={100}
          size="md"
          color={isCompleted ? 'success' : onTrack ? 'primary' : 'warning'}
        />

        {/* Timeline info */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">
            {isCompleted
              ? 'Goal completed!'
              : `${formatCurrency(amountRemaining)} remaining`}
          </span>
          {!isCompleted && (
            <span className={`flex items-center gap-1 ${
              isOverdue ? 'text-expense-600 dark:text-expense-400' : 'text-gray-500 dark:text-gray-400'
            }`}>
              <Clock className="w-3.5 h-3.5" />
              {formatDaysRemaining(daysRemaining)}
            </span>
          )}
        </div>
      </div>

      {/* Savings rate info */}
      {!isCompleted && !isPaused && daysRemaining > 0 && (
        <div className="mt-4 p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20">
          <div className="flex items-start gap-2">
            <TrendingUp className="w-4 h-4 mt-0.5 text-primary-600 dark:text-primary-400" />
            <div className="text-sm text-primary-700 dark:text-primary-300">
              <p>
                Save <strong>{formatCurrency(monthlyRequired)}/mo</strong> or{' '}
                <strong>{formatCurrency(weeklyRequired)}/wk</strong> to reach your goal by{' '}
                {format(new Date(goal.deadline), 'MMM d, yyyy')}.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Contribute button */}
      {goal.status === 'active' && (
        <div className="mt-4">
          {isContributing ? (
            <div className="flex gap-2">
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="Amount"
                value={contributionAmount}
                onChange={(e) => setContributionAmount(e.target.value)}
                className="flex-1"
              />
              <Button size="sm" onClick={handleContribute}>
                Add
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setIsContributing(false)}>
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              className="w-full"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => setIsContributing(true)}
            >
              Add Savings
            </Button>
          )}
        </div>
      )}

    </div>
  );
}
