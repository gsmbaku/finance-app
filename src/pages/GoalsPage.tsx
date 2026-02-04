import { Button, Card, CardHeader, CardContent, ProgressBar } from '@/components/ui';
import { Plus, Target, TrendingUp } from 'lucide-react';

export function GoalsPage() {
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
        <Button leftIcon={<Plus className="w-4 h-4" />}>
          New Goal
        </Button>
      </div>

      {/* Goals summary */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30">
                <Target className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Active Goals</p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">0</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent-100 dark:bg-accent-900/30">
                <TrendingUp className="w-5 h-5 text-accent-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Saved</p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">$0</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2 lg:col-span-1">
          <CardContent>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Overall Progress</p>
              <ProgressBar value={0} max={100} showLabel />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Goals list */}
      <Card>
        <CardHeader title="Your Goals" subtitle="Track progress towards your financial objectives" />
        <CardContent>
          <div className="text-center text-gray-400 dark:text-gray-500 py-12">
            <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="font-medium">No goals yet</p>
            <p className="text-sm mt-1">Create your first financial goal to start saving!</p>
            <Button className="mt-4" leftIcon={<Plus className="w-4 h-4" />}>
              Create Goal
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
