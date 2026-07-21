import { useState } from 'react';
import { ExpensesDashboard } from '../components/ExpensesDashboard';
import { ExpensesTable } from '../components/ExpensesTable';
import { ExpenseFormModal } from '../components/ExpenseFormModal';
import { useExpenses, useCreateExpense, useUpdateExpense } from '../hooks/useExpenses';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Plus, Search, Filter } from 'lucide-react';
import type { Expense } from '../types';

export function ExpensesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [search, setSearch] = useState('');

  const { data: expensesData, isLoading } = useExpenses({ search, limit: 50 });
  const { mutate: createExpense } = useCreateExpense();
  const { mutate: updateExpense } = useUpdateExpense();

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingExpense(null);
    setIsModalOpen(false);
  };

  const handleSubmit = (data: Partial<Expense>) => {
    if (editingExpense) {
      updateExpense({ id: editingExpense.id, data }, { onSuccess: handleCloseModal });
    } else {
      createExpense(data, { onSuccess: handleCloseModal });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Expense Management</h1>
          <p className="mt-1 text-sm text-surface-500">Track and manage operational fleet expenses</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Expense
          </Button>
        </div>
      </div>

      <ExpensesDashboard />

      <div className="p-6 bg-white border shadow-sm dark:bg-surface-900 rounded-xl border-surface-200 dark:border-surface-800">
        <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute w-5 h-5 text-surface-400 left-3 top-1/2 -translate-y-1/2" />
            <Input
              className="pl-10"
              placeholder="Search expenses, vendors, references..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        <ExpensesTable
          data={expensesData?.data || []}
          isLoading={isLoading}
          onEdit={handleEdit}
        />
      </div>

      <ExpenseFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        initialData={editingExpense}
      />
    </div>
  );
}
