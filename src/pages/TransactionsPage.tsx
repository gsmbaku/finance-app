import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui';
import {
  TransactionForm,
  TransactionList,
  TransactionFilters,
} from '@/components/transactions';
import { useTransactions } from '@/hooks/useTransactions';
import type { Transaction, TransactionFilters as FilterType, CreateTransactionDTO } from '@/types';

export function TransactionsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [filters, setFilters] = useState<FilterType>({});

  const { transactions, loading, addTransaction, updateTransaction, deleteTransaction } =
    useTransactions({ filters });

  const handleAddTransaction = async (data: CreateTransactionDTO) => {
    await addTransaction(data);
  };

  const handleEditTransaction = async (data: CreateTransactionDTO) => {
    if (editingTransaction) {
      await updateTransaction(editingTransaction.id, data);
      setEditingTransaction(null);
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    await deleteTransaction(id);
  };

  const openEditForm = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingTransaction(null);
  };

  // Calculate summary stats
  const summary = useMemo(() => {
    const expenses = transactions.filter((t) => t.type === 'expense');
    const income = transactions.filter((t) => t.type === 'income');
    return {
      totalExpenses: expenses.reduce((sum, t) => sum + t.amount, 0),
      totalIncome: income.reduce((sum, t) => sum + t.amount, 0),
      count: transactions.length,
    };
  }, [transactions]);

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transactions</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {summary.count} transactions
            {summary.count > 0 && (
              <span className="ml-2">
                • <span className="text-expense-600">-${summary.totalExpenses.toLocaleString()}</span>
                {' / '}
                <span className="text-accent-600">+${summary.totalIncome.toLocaleString()}</span>
              </span>
            )}
          </p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsFormOpen(true)}>
          Add Transaction
        </Button>
      </div>

      {/* Filters */}
      <TransactionFilters filters={filters} onChange={setFilters} />

      {/* Transaction list */}
      <TransactionList
        transactions={transactions}
        loading={loading}
        onEdit={openEditForm}
        onDelete={handleDeleteTransaction}
        onAddNew={() => setIsFormOpen(true)}
      />

      {/* Transaction form modal */}
      <TransactionForm
        isOpen={isFormOpen}
        onClose={closeForm}
        onSubmit={editingTransaction ? handleEditTransaction : handleAddTransaction}
        initialData={editingTransaction || undefined}
        mode={editingTransaction ? 'edit' : 'create'}
      />
    </div>
  );
}
