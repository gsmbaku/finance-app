import { useState } from 'react';
import { Plus, Target } from 'lucide-react';
import { Button, Card } from '@/components/ui';
import { GoalForm, GoalCard, GoalSummaryCard } from '@/components/goals';
import { useGoals, useGoalProgress } from '@/hooks/useGoals';
import type { Goal, CreateGoalDTO } from '@/types';

export function GoalsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  const { goals, addGoal, updateGoal, deleteGoal, contributeToGoal } = useGoals();
  const { progress, summary, loading, refetch } = useGoalProgress();

  const activeGoals = progress.filter((p) => p.goal.status === 'active');
  const completedGoals = goals.filter((g) => g.status === 'completed');
  const pausedGoals = goals.filter((g) => g.status === 'paused');

  const handleAddGoal = async (data: CreateGoalDTO) => {
    await addGoal(data);
    refetch();
  };

  const handleEditGoal = async (data: CreateGoalDTO) => {
    if (editingGoal) {
      await updateGoal(editingGoal.id, data);
      setEditingGoal(null);
      refetch();
    }
  };

  const handleDeleteGoal = async (id: string) => {
    if (confirm('Are you sure you want to delete this goal?')) {
      await deleteGoal(id);
      refetch();
    }
  };

  const handleContribute = async (id: string, amount: number) => {
    await contributeToGoal(id, amount);
    refetch();
  };

  const handleStatusChange = async (id: string, status: 'active' | 'paused' | 'cancelled') => {
    await updateGoal(id, { status });
    refetch();
  };

  const openEditForm = (goal: Goal) => {
    setEditingGoal(goal);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingGoal(null);
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Goals</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Set and track your financial goals.
          </p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsFormOpen(true)}>
          New Goal
        </Button>
      </div>

      {/* Summary Cards */}
      {summary && (summary.activeGoals > 0 || summary.completedGoals > 0) && (
        <GoalSummaryCard summary={summary} />
      )}

      {/* Active Goals */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <div className="animate-pulse space-y-4 p-5">
                <div className="flex items-center gap-3">
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20" />
                  </div>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24" />
              </div>
            </Card>
          ))}
        </div>
      ) : goals.length === 0 ? (
        <Card>
          <div className="text-center text-gray-400 dark:text-gray-500 py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <Target className="w-8 h-8" />
            </div>
            <p className="font-medium text-gray-900 dark:text-white">No goals yet</p>
            <p className="text-sm mt-1">Create your first financial goal to start saving!</p>
            <Button
              className="mt-4"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => setIsFormOpen(true)}
            >
              Create Goal
            </Button>
          </div>
        </Card>
      ) : (
        <>
          {/* Active goals */}
          {activeGoals.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Active Goals ({activeGoals.length})
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeGoals.map((p) => (
                  <GoalCard
                    key={p.goal.id}
                    progress={p}
                    onEdit={() => openEditForm(p.goal)}
                    onDelete={() => handleDeleteGoal(p.goal.id)}
                    onContribute={(amount) => handleContribute(p.goal.id, amount)}
                    onStatusChange={(status) => handleStatusChange(p.goal.id, status)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Paused goals */}
          {pausedGoals.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-500 dark:text-gray-400 mb-4">
                Paused ({pausedGoals.length})
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pausedGoals.map((goal) => {
                  const goalProgress = {
                    goal,
                    amountRemaining: goal.targetAmount - goal.currentAmount,
                    percentage: goal.targetAmount > 0
                      ? (goal.currentAmount / goal.targetAmount) * 100
                      : 0,
                    daysRemaining: 0,
                    monthlyRequired: 0,
                    weeklyRequired: 0,
                    onTrack: false,
                  };
                  return (
                    <GoalCard
                      key={goal.id}
                      progress={goalProgress}
                      onEdit={() => openEditForm(goal)}
                      onDelete={() => handleDeleteGoal(goal.id)}
                      onContribute={(amount) => handleContribute(goal.id, amount)}
                      onStatusChange={(status) => handleStatusChange(goal.id, status)}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Completed goals */}
          {completedGoals.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-accent-600 dark:text-accent-400 mb-4">
                Completed ({completedGoals.length})
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {completedGoals.map((goal) => {
                  const goalProgress = {
                    goal,
                    amountRemaining: 0,
                    percentage: 100,
                    daysRemaining: 0,
                    monthlyRequired: 0,
                    weeklyRequired: 0,
                    onTrack: true,
                  };
                  return (
                    <GoalCard
                      key={goal.id}
                      progress={goalProgress}
                      onEdit={() => openEditForm(goal)}
                      onDelete={() => handleDeleteGoal(goal.id)}
                      onContribute={async () => {}}
                      onStatusChange={async () => {}}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      {/* Goal form modal */}
      <GoalForm
        isOpen={isFormOpen}
        onClose={closeForm}
        onSubmit={editingGoal ? handleEditGoal : handleAddGoal}
        initialData={editingGoal || undefined}
        mode={editingGoal ? 'edit' : 'create'}
      />
    </div>
  );
}
