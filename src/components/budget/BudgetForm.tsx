import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { DollarSign } from 'lucide-react';
import { Button, Input, Modal } from '@/components/ui';
import { CategoryPicker } from '@/components/transactions/CategoryPicker';
import type { Budget } from '@/types';

const budgetFormSchema = z.object({
  category: z.string().min(1, 'Category is required'),
  monthlyLimit: z.string().min(1, 'Budget limit is required').refine(
    (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
    'Budget limit must be a positive number'
  ),
  alertThreshold: z.number().min(0).max(100),
  rollover: z.boolean(),
});

type BudgetFormData = z.infer<typeof budgetFormSchema>;

interface BudgetFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { category: string; monthlyLimit: number; alertThreshold: number; rollover: boolean }) => Promise<void>;
  initialData?: Budget;
  mode?: 'create' | 'edit';
  existingCategories?: string[];
}

export function BudgetForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode = 'create',
  existingCategories = [],
}: BudgetFormProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BudgetFormData>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: initialData
      ? {
          category: initialData.category,
          monthlyLimit: initialData.monthlyLimit.toString(),
          alertThreshold: initialData.alertThreshold,
          rollover: initialData.rollover,
        }
      : {
          category: '',
          monthlyLimit: '',
          alertThreshold: 75,
          rollover: false,
        },
  });

  const alertThreshold = watch('alertThreshold');

  const handleFormSubmit = async (data: BudgetFormData) => {
    await onSubmit({
      category: data.category,
      monthlyLimit: parseFloat(data.monthlyLimit),
      alertThreshold: data.alertThreshold,
      rollover: data.rollover,
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
      title={mode === 'create' ? 'Create Budget' : 'Edit Budget'}
      size="md"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
        {/* Category */}
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <CategoryPicker
              value={field.value}
              onChange={field.onChange}
              type="expense"
              error={
                errors.category?.message ||
                (existingCategories.includes(field.value) && mode === 'create'
                  ? 'Budget already exists for this category'
                  : undefined)
              }
            />
          )}
        />

        {/* Monthly Limit */}
        <Input
          label="Monthly Budget"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          leftIcon={<DollarSign className="w-4 h-4" />}
          error={errors.monthlyLimit?.message}
          {...register('monthlyLimit')}
        />

        {/* Alert Threshold */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Alert Threshold: {alertThreshold}%
          </label>
          <input
            type="range"
            min="50"
            max="100"
            step="5"
            {...register('alertThreshold', { valueAsNumber: true })}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-600"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            You'll be alerted when spending reaches this percentage of your budget.
          </p>
        </div>

        {/* Rollover */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="rollover"
            {...register('rollover')}
            className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <label htmlFor="rollover" className="text-sm text-gray-700 dark:text-gray-300">
            Roll over unused budget to next month
          </label>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={handleClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting} className="flex-1">
            {mode === 'create' ? 'Create Budget' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
