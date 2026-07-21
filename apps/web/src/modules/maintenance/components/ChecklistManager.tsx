import { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useUpdateMaintenance } from '../hooks/useMaintenance';
import type { MaintenanceLog } from '../types';

interface ChecklistManagerProps {
  maintenance: MaintenanceLog;
}

const DEFAULT_ITEMS = [
  'Engine Oil & Filter',
  'Air Filter',
  'Fuel Filter',
  'Brake Pads & Rotors',
  'Brake Fluid',
  'Coolant/Antifreeze',
  'Battery Health',
  'Tire Tread & Pressure',
  'Wheel Alignment',
  'Suspension System',
  'Transmission Fluid',
  'Wiper Blades',
  'Lights & Indicators',
];

export function ChecklistManager({ maintenance }: ChecklistManagerProps) {
  const [items, setItems] = useState<{ name: string; completed: boolean }[]>([]);
  const [newItemName, setNewItemName] = useState('');
  
  const updateMutation = useUpdateMaintenance(maintenance.id);

  useEffect(() => {
    if (maintenance.checklist && Array.isArray(maintenance.checklist) && maintenance.checklist.length > 0) {
      setItems(maintenance.checklist);
    } else {
      // Initialize with defaults if empty
      setItems(DEFAULT_ITEMS.map(name => ({ name, completed: false })));
    }
  }, [maintenance.checklist]);

  const toggleItem = (index: number) => {
    const newItems = [...items];
    newItems[index].completed = !newItems[index].completed;
    setItems(newItems);
  };

  const addItem = () => {
    if (!newItemName.trim()) return;
    setItems([...items, { name: newItemName, completed: false }]);
    setNewItemName('');
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const saveChecklist = async () => {
    try {
      await updateMutation.mutateAsync({ checklist: items });
    } catch (error) {
      console.error('Failed to save checklist', error);
    }
  };

  const completedCount = items.filter(i => i.completed).length;
  const progress = items.length === 0 ? 0 : Math.round((completedCount / items.length) * 100);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-surface-900 dark:text-white">Service Checklist</h3>
          <p className="text-sm text-surface-500">Track tasks for this maintenance service.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-surface-700 dark:text-surface-300">
              {progress}%
            </span>
            <div className="w-32 h-2 bg-surface-200 dark:bg-surface-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <Button 
            onClick={saveChecklist} 
            isLoading={updateMutation.isPending}
          >
            Save Progress
          </Button>
        </div>
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Add custom checklist item..."
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addItem()}
        />
        <Button variant="secondary" onClick={addItem}>
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item, index) => (
          <div 
            key={index}
            className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
              item.completed 
                ? 'bg-primary-50 border-primary-100 dark:bg-primary-900/10 dark:border-primary-900/20' 
                : 'bg-white dark:bg-surface-950 border-surface-200 dark:border-surface-800 hover:border-primary-200'
            }`}
          >
            <button 
              className="flex items-center gap-3 flex-1 text-left"
              onClick={() => toggleItem(index)}
            >
              {item.completed ? (
                <CheckCircle2 className="w-5 h-5 text-primary-500 shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-surface-300 shrink-0" />
              )}
              <span className={`text-sm ${item.completed ? 'text-surface-500 line-through' : 'text-surface-900 dark:text-white'}`}>
                {item.name}
              </span>
            </button>
            <button
              onClick={() => removeItem(index)}
              className="p-1 text-surface-400 hover:text-red-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
