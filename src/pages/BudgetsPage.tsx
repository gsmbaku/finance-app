import { useState } from 'react';
import { Plus, Wallet, Sparkles } from 'lucide-react';
import { Button, Card } from '@/components/ui';
import { BudgetForm, BudgetCard, BudgetSummaryCard } from '@/components/budget';
import { useBudgets, useBudgetProgress } from '@/hooks/useBudgets';
import { useSpendingByCategory } from '@/hooks/useAnalytics';
import { getCategoryById } from '@/utils/categories';
import { formatCurrency } from '@/utils/formatters';
import type { Budget, CreateBudgetDTO } from '@/types';

export function BudgetsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

  const { budgets, addBudget, updateBudget, deleteBudget } = useBudgets();
  const { progress, summary, loading, refetch } = useBudgetProgress();
  const { data: categorySpending } = useSpendingByCategory();

  const existingCategories = budgets.map((b) => b.category);

  // Suggest budgets based on spending categories that don't have budgets yet
  const suggestedBudgets = categorySpending
    .filter((c) => !existingCategories.includes(c.category))
    .slice(0, 4)
    .map((c) => ({
      category: c.category,
      currentSpending: c.amount,
      // Suggest a budget that's ~20% above current spending, rounded to nearest $50
      suggestedLimit: Math.ceil((c.amount * 1.2) / 50) * 50,
      count: c.count,
    }));

  const handleAddBudget = async (data: CreateBudgetDTO) => {
    await addBudget(data);
    refetch();
  };

  const handleQuickAddBudget = async (category: string, limit: number) => {
    await addBudget({
      category,
      monthlyLimit: limit,
      alertThreshold: 75,
      rollover: false,
    });
    refetch();
  };

  const handleEditBudget = async (data: CreateBudgetDTO) => {
    if (editingBudget) {
      await updateBudget(editingBudget.id, data);
      setEditingBudget(null);
      refetch();
    }
  };

  const handleDeleteBudget = async (id: string) => {
    if (confirm('Are you sure you want to delete this budget?')) {
      await deleteBudget(id);
      refetch();
    }
  };

  const openEditForm = (budget: Budget) => {
    setEditingBudget(budget);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingBudget(null);
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Budgets</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Set spending limits and track your progress.
          </p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsFormOpen(true)}>
          Create Budget
        </Button>
      </div>

      {/* Summary Cards */}
      {summary && progress.length > 0 && <BudgetSummaryCard summary={summary} />}

      {/* Budget Suggestions */}
      {suggestedBudgets.length > 0 && (
        <Card className="p-6 bg-primary-50/50 dark:bg-primary-900/10 border-primary-200 dark:border-primary-800">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Suggested Budgets
            </h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Based on your spending patterns
            </span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {suggestedBudgets.map((suggestion) => {
              const category = getCategoryById(suggestion.category);
              const CategoryIcon = category?.icon;
              return (
                <div
                  key={suggestion.category}
                  className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center gap-2 mb-2">
                    {CategoryIcon && (
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${category?.color}20` }}
                      >
                        <CategoryIcon className="w-4 h-4" style={{ color: category?.color }} />
                      </div>
                    )}
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {category?.name || suggestion.category}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                    Current spending: {formatCurrency(suggestion.currentSpending)} ({suggestion.count} transactions)
                  </p>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full"
                    onClick={() => handleQuickAddBudget(suggestion.category, suggestion.suggestedLimit)}
                  >
                    Set {formatCurrency(suggestion.suggestedLimit)}/mo
                  </Button>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Budget Grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <div className="animate-pulse space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-xl" />
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16" />
                  </div>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            </Card>
          ))}
        </div>
      ) : progress.length === 0 && suggestedBudgets.length === 0 ? (
        <Card>
          <div className="text-center text-gray-400 dark:text-gray-500 py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <Wallet className="w-8 h-8" />
            </div>
            <p className="font-medium text-gray-900 dark:text-white">No budgets yet</p>
            <p className="text-sm mt-1">Create your first budget to start tracking spending.</p>
            <Button className="mt-4" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsFormOpen(true)}>
              Create Budget
            </Button>
          </div>
        </Card>
      ) : progress.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {progress.map((p) => (
            <BudgetCard
              key={p.budget.id}
              progress={p}
              onEdit={() => openEditForm(p.budget)}
              onDelete={() => handleDeleteBudget(p.budget.id)}
            />
          ))}
        </div>
      ) : null}

      {/* Budget form modal */}
      <BudgetForm
        isOpen={isFormOpen}
        onClose={closeForm}
        onSubmit={editingBudget ? handleEditBudget : handleAddBudget}
        initialData={editingBudget || undefined}
        mode={editingBudget ? 'edit' : 'create'}
        existingCategories={editingBudget ? [] : existingCategories}
      />
    </div>
  );
}
