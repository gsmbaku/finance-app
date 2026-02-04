import { useState } from 'react';
import { Plus, Wallet } from 'lucide-react';
import { Button, Card } from '@/components/ui';
import { BudgetForm, BudgetCard, BudgetSummaryCard } from '@/components/budget';
import { useBudgets, useBudgetProgress } from '@/hooks/useBudgets';
import type { Budget, CreateBudgetDTO } from '@/types';

export function BudgetsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

  const { budgets, addBudget, updateBudget, deleteBudget } = useBudgets();
  const { progress, summary, loading, refetch } = useBudgetProgress();

  const existingCategories = budgets.map((b) => b.category);

  const handleAddBudget = async (data: CreateBudgetDTO) => {
    await addBudget(data);
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
      {summary && <BudgetSummaryCard summary={summary} />}

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
      ) : progress.length === 0 ? (
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
      ) : (
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
      )}

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
