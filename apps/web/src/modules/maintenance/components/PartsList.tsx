import { useState } from 'react';
import { Package, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAddPart, useDeletePart } from '../hooks/useMaintenance';
import type { MaintenanceLog } from '../types';
import { formatCurrency } from '@/lib/utils';

interface PartsListProps {
  maintenance: MaintenanceLog;
}

export function PartsList({ maintenance }: PartsListProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    quantity: 1,
    unitCost: 0,
    stockReference: '',
    warranty: '',
  });

  const addPartMutation = useAddPart(maintenance.id);
  const deletePartMutation = useDeletePart(maintenance.id);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addPartMutation.mutateAsync(formData);
      setIsAdding(false);
      setFormData({
        name: '',
        quantity: 1,
        unitCost: 0,
        stockReference: '',
        warranty: '',
      });
    } catch (error) {
      console.error('Failed to add part', error);
    }
  };

  const parts = maintenance.parts || [];
  const totalPartsCost = parts.reduce((acc, part) => acc + part.totalCost, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-surface-900 dark:text-white">Parts Used</h3>
          <p className="text-sm text-surface-500">Track replacement parts and inventory costs.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-surface-500">Total Parts Cost</p>
            <p className="text-lg font-semibold text-surface-900 dark:text-white">
              {formatCurrency(totalPartsCost)}
            </p>
          </div>
          {!isAdding && (
            <Button onClick={() => setIsAdding(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Part
            </Button>
          )}
        </div>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="bg-surface-50 dark:bg-surface-800/50 p-4 rounded-lg border border-surface-200 dark:border-surface-800 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2 col-span-2 md:col-span-1">
              <label className="text-xs font-medium text-surface-700 dark:text-surface-300">Part Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Oil Filter"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-surface-700 dark:text-surface-300">Quantity</label>
              <Input
                type="number"
                min="1"
                step="0.01"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-surface-700 dark:text-surface-300">Unit Cost ($)</label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={formData.unitCost}
                onChange={(e) => setFormData({ ...formData, unitCost: Number(e.target.value) })}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-surface-700 dark:text-surface-300">Stock Ref (Optional)</label>
              <Input
                value={formData.stockReference}
                onChange={(e) => setFormData({ ...formData, stockReference: e.target.value })}
                placeholder="e.g. SKU-123"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsAdding(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={addPartMutation.isPending}>
              Save Part
            </Button>
          </div>
        </form>
      )}

      {parts.length === 0 && !isAdding ? (
        <div className="text-center py-12 bg-white dark:bg-surface-950 border border-dashed rounded-lg border-surface-200 dark:border-surface-800">
          <Package className="w-8 h-8 mx-auto text-surface-400 mb-3" />
          <p className="text-sm font-medium text-surface-900 dark:text-white">No parts added</p>
          <p className="text-sm text-surface-500">Record parts used during this service.</p>
        </div>
      ) : (
        <div className="overflow-x-auto border rounded-lg border-surface-200 dark:border-surface-800">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-surface-50 dark:bg-surface-900 text-surface-500">
              <tr>
                <th className="px-4 py-3 font-medium">Part Name</th>
                <th className="px-4 py-3 font-medium">Stock Ref</th>
                <th className="px-4 py-3 font-medium text-right">Quantity</th>
                <th className="px-4 py-3 font-medium text-right">Unit Cost</th>
                <th className="px-4 py-3 font-medium text-right">Total</th>
                <th className="px-4 py-3 font-medium text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-200 dark:divide-surface-800 bg-white dark:bg-surface-950">
              {parts.map((part) => (
                <tr key={part.id} className="hover:bg-surface-50 dark:hover:bg-surface-900">
                  <td className="px-4 py-3 font-medium text-surface-900 dark:text-white">{part.name}</td>
                  <td className="px-4 py-3 text-surface-500">{part.stockReference || '-'}</td>
                  <td className="px-4 py-3 text-right">{part.quantity}</td>
                  <td className="px-4 py-3 text-right">{formatCurrency(part.unitCost)}</td>
                  <td className="px-4 py-3 text-right font-medium">{formatCurrency(part.totalCost)}</td>
                  <td className="px-4 py-3 text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      onClick={() => deletePartMutation.mutate(part.id)}
                      disabled={deletePartMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
