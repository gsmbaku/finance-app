import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { CalendarDays, DollarSign } from 'lucide-react';
import { Button, Input, Modal } from '@/components/ui';
import { CategoryPicker, SubcategoryPicker } from './CategoryPicker';
import type { Transaction, PaymentMethod } from '@/types';

const transactionFormSchema = z.object({
  amount: z.string().min(1, 'Amount is required').refine(
    (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
    'Amount must be a positive number'
  ),
  category: z.string().min(1, 'Category is required'),
  subcategory: z.string().optional(),
  merchant: z.string().min(1, 'Merchant is required'),
  description: z.string().optional(),
  date: z.string().min(1, 'Date is required'),
  type: z.enum(['expense', 'income']),
  paymentMethod: z.enum(['cash', 'credit_card', 'debit_card', 'bank_transfer', 'mobile_payment', 'other']),
  notes: z.string().optional(),
});

type TransactionFormData = z.infer<typeof transactionFormSchema>;

interface TransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  initialData?: Transaction;
  mode?: 'create' | 'edit';
}

const paymentMethods: { value: PaymentMethod; label: string }[] = [
  { value: 'credit_card', label: 'Credit Card' },
  { value: 'debit_card', label: 'Debit Card' },
  { value: 'cash', label: 'Cash' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'mobile_payment', label: 'Mobile Payment' },
  { value: 'other', label: 'Other' },
];

export function TransactionForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode = 'create',
}: TransactionFormProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: initialData
      ? {
          amount: initialData.amount.toString(),
          category: initialData.category,
          subcategory: initialData.subcategory,
          merchant: initialData.merchant,
          description: initialData.description,
          date: format(new Date(initialData.date), 'yyyy-MM-dd'),
          type: initialData.type,
          paymentMethod: initialData.paymentMethod,
          notes: initialData.notes,
        }
      : {
          amount: '',
          category: '',
          subcategory: '',
          merchant: '',
          description: '',
          date: format(new Date(), 'yyyy-MM-dd'),
          type: 'expense',
          paymentMethod: 'credit_card',
          notes: '',
        },
  });

  const transactionType = watch('type');
  const selectedCategory = watch('category');

  const handleFormSubmit = async (data: TransactionFormData) => {
    await onSubmit({
      amount: parseFloat(data.amount),
      category: data.category,
      subcategory: data.subcategory,
      merchant: data.merchant,
      description: data.description || '',
      date: new Date(data.date),
      type: data.type,
      paymentMethod: data.paymentMethod,
      notes: data.notes,
      tags: [],
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
      title={mode === 'create' ? 'Add Transaction' : 'Edit Transaction'}
      size="lg"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
        {/* Transaction Type Toggle */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Type
          </label>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <div className="flex rounded-xl border border-gray-200 dark:border-gray-700 p-1">
                <button
                  type="button"
                  onClick={() => {
                    field.onChange('expense');
                    setValue('category', '');
                  }}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                    field.value === 'expense'
                      ? 'bg-expense-100 text-expense-700 dark:bg-expense-900/30 dark:text-expense-400'
                      : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() => {
                    field.onChange('income');
                    setValue('category', '');
                  }}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                    field.value === 'income'
                      ? 'bg-accent-100 text-accent-700 dark:bg-accent-900/30 dark:text-accent-400'
                      : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  Income
                </button>
              </div>
            )}
          />
        </div>

        {/* Amount */}
        <Input
          label="Amount"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          leftIcon={<DollarSign className="w-4 h-4" />}
          error={errors.amount?.message}
          {...register('amount')}
        />

        {/* Merchant */}
        <Input
          label="Merchant"
          placeholder="Where did you spend?"
          error={errors.merchant?.message}
          {...register('merchant')}
        />

        {/* Category */}
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <CategoryPicker
              value={field.value}
              onChange={(category) => {
                field.onChange(category);
                setValue('subcategory', '');
              }}
              type={transactionType}
              error={errors.category?.message}
            />
          )}
        />

        {/* Subcategory */}
        {selectedCategory && (
          <Controller
            name="subcategory"
            control={control}
            render={({ field }) => (
              <SubcategoryPicker
                categoryId={selectedCategory}
                value={field.value}
                onChange={field.onChange}
                type={transactionType}
              />
            )}
          />
        )}

        {/* Date and Payment Method Row */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Date"
            type="date"
            leftIcon={<CalendarDays className="w-4 h-4" />}
            error={errors.date?.message}
            {...register('date')}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Payment Method
            </label>
            <select
              {...register('paymentMethod')}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {paymentMethods.map((method) => (
                <option key={method.value} value={method.value}>
                  {method.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <Input
          label="Description (optional)"
          placeholder="Add a description"
          {...register('description')}
        />

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Notes (optional)
          </label>
          <textarea
            {...register('notes')}
            rows={2}
            placeholder="Any additional notes..."
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={handleClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting} className="flex-1">
            {mode === 'create' ? 'Add Transaction' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
