import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { Check, ChevronDown } from 'lucide-react';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/utils/categories';
import type { TransactionType } from '@/types';

interface CategoryPickerProps {
  value: string;
  onChange: (category: string, subcategory?: string) => void;
  type: TransactionType;
  error?: string;
}

export function CategoryPicker({ value, onChange, type, error }: CategoryPickerProps) {
  const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
  const selectedCategory = categories.find((c) => c.id === value);

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
        Category
      </label>
      <Listbox value={value} onChange={(val) => onChange(val)}>
        <div className="relative">
          <Listbox.Button
            className={`
              relative w-full cursor-pointer rounded-xl border py-2.5 pl-4 pr-10 text-left text-sm
              bg-white dark:bg-gray-900
              ${error ? 'border-expense-500' : 'border-gray-200 dark:border-gray-700'}
              focus:outline-none focus:ring-2 focus:ring-primary-500
              transition-all duration-200
            `}
          >
            {selectedCategory ? (
              <span className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: selectedCategory.color }}
                />
                <span className="text-gray-900 dark:text-white">{selectedCategory.name}</span>
              </span>
            ) : (
              <span className="text-gray-400">Select a category</span>
            )}
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </span>
          </Listbox.Button>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options
              className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white dark:bg-gray-900 py-1 text-sm shadow-lg ring-1 ring-black/5 dark:ring-white/10 focus:outline-none"
            >
              {categories.map((category) => (
                <Listbox.Option
                  key={category.id}
                  value={category.id}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2.5 pl-10 pr-4 ${
                      active ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                    }`
                  }
                >
                  {({ selected }) => (
                    <>
                      <span className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <span
                          className={`block truncate ${
                            selected
                              ? 'font-medium text-primary-600 dark:text-primary-400'
                              : 'text-gray-900 dark:text-white'
                          }`}
                        >
                          {category.name}
                        </span>
                      </span>
                      {selected && (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary-600">
                          <Check className="h-4 w-4" />
                        </span>
                      )}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
      {error && <p className="mt-1.5 text-sm text-expense-600">{error}</p>}
    </div>
  );
}

// Subcategory picker for more granular categorization
interface SubcategoryPickerProps {
  categoryId: string;
  value?: string;
  onChange: (subcategory: string) => void;
  type: TransactionType;
}

export function SubcategoryPicker({ categoryId, value, onChange, type }: SubcategoryPickerProps) {
  const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
  const category = categories.find((c) => c.id === categoryId);
  const subcategories = category?.subcategories || [];

  if (subcategories.length === 0) return null;

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
        Subcategory (optional)
      </label>
      <Listbox value={value || ''} onChange={onChange}>
        <div className="relative">
          <Listbox.Button
            className="relative w-full cursor-pointer rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 py-2.5 pl-4 pr-10 text-left text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <span className={value ? 'text-gray-900 dark:text-white' : 'text-gray-400'}>
              {value || 'Select subcategory'}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </span>
          </Listbox.Button>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white dark:bg-gray-900 py-1 text-sm shadow-lg ring-1 ring-black/5 dark:ring-white/10 focus:outline-none">
              {subcategories.map((sub) => (
                <Listbox.Option
                  key={sub}
                  value={sub}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2.5 pl-10 pr-4 ${
                      active ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                    }`
                  }
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected
                            ? 'font-medium text-primary-600 dark:text-primary-400'
                            : 'text-gray-900 dark:text-white'
                        }`}
                      >
                        {sub}
                      </span>
                      {selected && (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary-600">
                          <Check className="h-4 w-4" />
                        </span>
                      )}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
