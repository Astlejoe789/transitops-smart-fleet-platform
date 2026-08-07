import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (expenseData: any) => Promise<void>;
}

export function AddExpenseModal({ isOpen, onClose, onSave }: AddExpenseModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    category: 'TOLLS',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    description: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave({
        ...formData,
        amount: Number(formData.amount),
      });
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const footer = (
    <>
      <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
      <Button type="submit" form="add-expense-form" isLoading={loading}>Add Expense</Button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Expense" description="Log a new operational expense." footer={footer}>
      <form id="add-expense-form" onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Category</label>
            <select name="category" value={formData.category} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
              <option value="TOLLS">Tolls</option>
              <option value="MAINTENANCE">Maintenance</option>
              <option value="FOOD">Food/Lodging</option>
              <option value="INSURANCE">Insurance</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Date</label>
            <Input type="date" name="date" value={formData.date} onChange={handleChange} required />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Amount ($)</label>
          <Input type="number" name="amount" value={formData.amount} onChange={handleChange} required />
        </div>
        <div>
          <label className="text-sm font-medium">Description</label>
          <Input name="description" value={formData.description} onChange={handleChange} required placeholder="e.g. Highway toll" />
        </div>
      </form>
    </Modal>
  );
}
