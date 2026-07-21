import { useState } from 'react';
import { FuelDashboard } from '../components/FuelDashboard';
import { FuelTable } from '../components/FuelTable';
import { FuelFormModal } from '../components/FuelFormModal';
import { useFuelLogs, useCreateFuelLog, useUpdateFuelLog } from '../hooks/useFuel';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Plus, Search, Filter } from 'lucide-react';
import type { FuelLog } from '../types';

export function FuelPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLog, setEditingLog] = useState<FuelLog | null>(null);
  const [search, setSearch] = useState('');

  const { data: logsData, isLoading } = useFuelLogs({ search, limit: 50 });
  const { mutate: createLog } = useCreateFuelLog();
  const { mutate: updateLog } = useUpdateFuelLog();

  const handleEdit = (log: FuelLog) => {
    setEditingLog(log);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingLog(null);
    setIsModalOpen(false);
  };

  const handleSubmit = (data: Partial<FuelLog>) => {
    if (editingLog) {
      updateLog({ id: editingLog.id, data }, { onSuccess: handleCloseModal });
    } else {
      createLog(data, { onSuccess: handleCloseModal });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Fuel Management</h1>
          <p className="mt-1 text-sm text-surface-500">Monitor fuel consumption and costs</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Log Fuel Entry
          </Button>
        </div>
      </div>

      <FuelDashboard />

      <div className="p-6 bg-white border shadow-sm dark:bg-surface-900 rounded-xl border-surface-200 dark:border-surface-800">
        <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute w-5 h-5 text-surface-400 left-3 top-1/2 -translate-y-1/2" />
            <Input
              className="pl-10"
              placeholder="Search by ID, Vehicle, Station..."
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

        <FuelTable
          data={logsData?.data || []}
          isLoading={isLoading}
          onEdit={handleEdit}
        />
      </div>

      <FuelFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        initialData={editingLog}
      />
    </div>
  );
}
