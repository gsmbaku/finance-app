import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { DollarSign, Calendar } from 'lucide-react';
import { Button, Input, Modal } from '@/components/ui';
import type { Goal } from '@/types';
import { format } from 'date-fns';

const goalFormSchema = z.object({
  name: z.string().min(1, 'Goal name is required').max(100),
  description: z.string().max(500).optional(),
  targetAmount: z.string().min(1, 'Target amount is required').refine(
    (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
    'Target amount must be a positive number'
  ),
  currentAmount: z.string().refine(
    (val) => val === '' || (!isNaN(parseFloat(val)) && parseFloat(val) >= 0),
    'Must be a non-negative number'
  ).optional(),
  deadline: z.string().min(1, 'Deadline is required'),
  priority: z.enum(['high', 'medium', 'low']),
  category: z.string().min(1, 'Category is required'),
});

type GoalFormData = z.infer<typeof goalFormSchema>;

const goalCategories = [
  'Emergency Fund',
  'Vacation',
  'Home Down Payment',
  'Car',
  'Debt Payoff',
  'Education',
  'Retirement',
  'Wedding',
  'Investment',
  'Other',
];

interface GoalFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    description?: string;
    targetAmount: number;
    currentAmount?: number;
    deadline: Date;
    priority: 'high' | 'medium' | 'low';
    category: string;
  }) => Promise<void>;
  initialData?: Goal;
  mode?: 'create' | 'edit';
}

export function GoalForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode = 'create',
}: GoalFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<GoalFormData>({
    resolver: zodResolver(goalFormSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          description: initialData.description || '',
          targetAmount: initialData.targetAmount.toString(),
          currentAmount: initialData.currentAmount.toString(),
          deadline: format(new Date(initialData.deadline), 'yyyy-MM-dd'),
          priority: initialData.priority,
          category: initialData.category,
        }
      : {
          name: '',
          description: '',
          targetAmount: '',
          currentAmount: '',
          deadline: '',
          priority: 'medium',
          category: '',
        },
  });

  const handleFormSubmit = async (data: GoalFormData) => {
    await onSubmit({
      name: data.name,
      description: data.description || undefined,
      targetAmount: parseFloat(data.targetAmount),
      currentAmount: data.currentAmount ? parseFloat(data.currentAmount) : 0,
      deadline: new Date(data.deadline),
      priority: data.priority,
      category: data.category,
    });
    reset();
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={mode === 'create' ? 'Create Goal' : 'Edit Goal'}
      size="md"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
        {/* Goal Name */}
        <Input
          label="Goal Name"
          placeholder="e.g., Emergency Fund"
          error={errors.name?.message}
          {...register('name')}
        />

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Description (optional)
          </label>
          <textarea
            placeholder="Why is this goal important to you?"
            rows={2}
            className="w-full rounded-xl border px-4 py-2.5 text-sm bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-none"
            {...register('description')}
          />
        </div>

        {/* Target Amount */}
        <Input
          label="Target Amount"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          leftIcon={<DollarSign className="w-4 h-4" />}
          error={errors.targetAmount?.message}
          {...register('targetAmount')}
        />

        {/* Current Amount */}
        <Input
          label="Already Saved (optional)"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          leftIcon={<DollarSign className="w-4 h-4" />}
          error={errors.currentAmount?.message}
          {...register('currentAmount')}
        />

        {/* Deadline */}
        <Input
          label="Target Date"
          type="date"
          leftIcon={<Calendar className="w-4 h-4" />}
          error={errors.deadline?.message}
          {...register('deadline')}
        />

        {/* Priority */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Priority
          </label>
          <div className="flex gap-2">
            {(['low', 'medium', 'high'] as const).map((level) => (
              <label
                key={level}
                className="flex-1 cursor-pointer"
              >
                <input
                  type="radio"
                  value={level}
                  {...register('priority')}
                  className="sr-only peer"
                />
                <div className={`text-center py-2 px-3 rounded-xl border text-sm font-medium transition-all
                  peer-checked:border-primary-500 peer-checked:bg-primary-50 peer-checked:text-primary-700
                  dark:peer-checked:bg-primary-900/30 dark:peer-checked:text-primary-300 dark:peer-checked:border-primary-600
                  border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400
                  hover:border-gray-300 dark:hover:border-gray-600`}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </div>
              </label>
            ))}
          </div>
          {errors.priority?.message && (
            <p className="mt-1.5 text-sm text-expense-600">{errors.priority.message}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Category
          </label>
          <select
            className="w-full rounded-xl border px-4 py-2.5 text-sm bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            {...register('category')}
          >
            <option value="">Select a category</option>
            {goalCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category?.message && (
            <p className="mt-1.5 text-sm text-expense-600">{errors.category.message}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={handleClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting} className="flex-1">
            {mode === 'create' ? 'Create Goal' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
