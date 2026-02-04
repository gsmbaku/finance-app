import { useState } from 'react';
import { Receipt, Plus } from 'lucide-react';
import { Button, Card } from '@/components/ui';
import { TransactionItem } from './TransactionItem';
import type { Transaction } from '@/types';

interface TransactionListProps {
  transactions: Transaction[];
  loading: boolean;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  onAddNew: () => void;
}

export function TransactionList({
  transactions,
  loading,
  onEdit,
  onDelete,
  onAddNew,
}: TransactionListProps) {
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    if (confirmDelete === id) {
      onDelete(id);
      setConfirmDelete(null);
    } else {
      setConfirmDelete(id);
      // Auto-reset after 3 seconds
      setTimeout(() => setConfirmDelete(null), 3000);
    }
  };

  if (loading) {
    return (
      <Card>
        <div className="animate-pulse space-y-4 p-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-xl" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
              </div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (transactions.length === 0) {
    return (
      <Card>
        <div className="text-center text-gray-400 dark:text-gray-500 py-16">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <Receipt className="w-8 h-8" />
          </div>
          <p className="font-medium text-gray-900 dark:text-white">No transactions yet</p>
          <p className="text-sm mt-1">Add your first transaction to start tracking your finances.</p>
          <Button className="mt-4" leftIcon={<Plus className="w-4 h-4" />} onClick={onAddNew}>
            Add Transaction
          </Button>
        </div>
      </Card>
    );
  }

  // Group transactions by date
  const groupedTransactions = transactions.reduce((groups, transaction) => {
    const date = new Date(transaction.date).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {} as Record<string, Transaction[]>);

  return (
    <Card padding="none">
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {Object.entries(groupedTransactions).map(([date, dayTransactions]) => (
          <div key={date}>
            {/* Date header */}
            <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800/50 sticky top-0">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {new Date(date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
            {/* Transactions for this date */}
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {dayTransactions.map((transaction) => (
                <div key={transaction.id} className="relative">
                  <TransactionItem
                    transaction={transaction}
                    onEdit={onEdit}
                    onDelete={handleDelete}
                  />
                  {/* Delete confirmation overlay */}
                  {confirmDelete === transaction.id && (
                    <div className="absolute inset-0 bg-expense-50 dark:bg-expense-900/20 flex items-center justify-center gap-3 px-4">
                      <span className="text-sm text-expense-700 dark:text-expense-300">
                        Click again to confirm delete
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setConfirmDelete(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
