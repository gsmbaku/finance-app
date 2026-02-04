export type TransactionType = 'expense' | 'income';

export type PaymentMethod =
  | 'cash'
  | 'credit_card'
  | 'debit_card'
  | 'bank_transfer'
  | 'mobile_payment'
  | 'other';

export interface Transaction {
  id: string;
  amount: number;
  category: string;
  subcategory?: string;
  description: string;
  merchant: string;
  date: Date;
  type: TransactionType;
  paymentMethod?: PaymentMethod;
  tags: string[];
  notes?: string;
  plaidTransactionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTransactionDTO {
  amount: number;
  category: string;
  subcategory?: string;
  description?: string;
  merchant: string;
  date: Date;
  type: TransactionType;
  paymentMethod?: PaymentMethod;
  tags?: string[];
  notes?: string;
  plaidTransactionId?: string;
}

export interface UpdateTransactionDTO extends Partial<CreateTransactionDTO> {}

export interface TransactionFilters {
  startDate?: Date;
  endDate?: Date;
  categories?: string[];
  types?: TransactionType[];
  merchants?: string[];
  minAmount?: number;
  maxAmount?: number;
  searchQuery?: string;
}

export interface TransactionStats {
  totalIncome: number;
  totalExpenses: number;
  netAmount: number;
  transactionCount: number;
  averageExpense: number;
  largestExpense: Transaction | null;
}
