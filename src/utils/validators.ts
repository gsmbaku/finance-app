import { z } from 'zod';

// Transaction validation schema
export const transactionSchema = z.object({
  amount: z
    .number()
    .positive('Amount must be positive')
    .max(1000000000, 'Amount is too large'),
  category: z.string().min(1, 'Category is required'),
  subcategory: z.string().optional(),
  description: z.string().max(500, 'Description is too long').optional().default(''),
  merchant: z.string().min(1, 'Merchant is required').max(200, 'Merchant name is too long'),
  date: z.date(),
  type: z.enum(['expense', 'income']),
  paymentMethod: z.enum([
    'cash',
    'credit_card',
    'debit_card',
    'bank_transfer',
    'mobile_payment',
    'other',
  ]),
  tags: z.array(z.string()).optional().default([]),
  notes: z.string().max(1000, 'Notes are too long').optional(),
});

export type TransactionInput = z.infer<typeof transactionSchema>;

// Budget validation schema
export const budgetSchema = z.object({
  category: z.string().min(1, 'Category is required'),
  monthlyLimit: z
    .number()
    .positive('Budget limit must be positive')
    .max(1000000000, 'Budget limit is too large'),
  alertThreshold: z
    .number()
    .min(0, 'Alert threshold must be at least 0')
    .max(100, 'Alert threshold cannot exceed 100')
    .optional()
    .default(75),
  rollover: z.boolean().optional().default(false),
});

export type BudgetInput = z.infer<typeof budgetSchema>;

// Goal validation schema
export const goalSchema = z.object({
  name: z
    .string()
    .min(1, 'Goal name is required')
    .max(100, 'Goal name is too long'),
  description: z.string().max(500, 'Description is too long').optional(),
  targetAmount: z
    .number()
    .positive('Target amount must be positive')
    .max(1000000000, 'Target amount is too large'),
  currentAmount: z.number().min(0, 'Current amount cannot be negative').optional().default(0),
  deadline: z.date().refine((date) => date > new Date(), {
    message: 'Deadline must be in the future',
  }),
  priority: z.enum(['high', 'medium', 'low']),
  category: z.string().min(1, 'Category is required'),
  motivations: z.array(z.string()).optional().default([]),
});

export type GoalInput = z.infer<typeof goalSchema>;

// Helper function to validate and parse
export function validateTransaction(data: unknown): TransactionInput {
  return transactionSchema.parse(data);
}

export function validateBudget(data: unknown): BudgetInput {
  return budgetSchema.parse(data);
}

export function validateGoal(data: unknown): GoalInput {
  return goalSchema.parse(data);
}

// Safe validation that returns errors instead of throwing
export function safeValidateTransaction(data: unknown) {
  return transactionSchema.safeParse(data);
}

export function safeValidateBudget(data: unknown) {
  return budgetSchema.safeParse(data);
}

export function safeValidateGoal(data: unknown) {
  return goalSchema.safeParse(data);
}
