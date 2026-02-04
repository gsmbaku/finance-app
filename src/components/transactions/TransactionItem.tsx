import { memo } from 'react';
import { MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import type { Transaction } from '@/types';
import { formatCurrency, formatDateShort } from '@/utils/formatters';
import { getCategoryById } from '@/utils/categories';

interface TransactionItemProps {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

export const TransactionItem = memo(function TransactionItem({
  transaction,
  onEdit,
  onDelete,
}: TransactionItemProps) {
  const category = getCategoryById(transaction.category);
  const CategoryIcon = category?.icon;
  const isExpense = transaction.type === 'expense';

  return (
    <div className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      {/* Category Icon */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: `${category?.color}20` }}
      >
        {CategoryIcon && (
          <CategoryIcon className="w-5 h-5" style={{ color: category?.color }} />
        )}
      </div>

      {/* Transaction Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900 dark:text-white truncate">
            {transaction.merchant}
          </span>
          {transaction.subcategory && (
            <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
              {transaction.subcategory}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {category?.name}
          </span>
          <span className="text-gray-300 dark:text-gray-600">•</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {formatDateShort(transaction.date)}
          </span>
        </div>
      </div>

      {/* Amount */}
      <div className="text-right">
        <span
          className={`font-semibold tabular-nums ${
            isExpense
              ? 'text-expense-600 dark:text-expense-400'
              : 'text-accent-600 dark:text-accent-400'
          }`}
        >
          {isExpense ? '-' : '+'}
          {formatCurrency(transaction.amount)}
        </span>
      </div>

      {/* Actions Menu */}
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
                    onClick={() => onEdit(transaction)}
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
                    onClick={() => onDelete(transaction.id)}
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
  );
});
