import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { MaintenanceFilters } from '../components/MaintenanceFilters';
import { MaintenanceTable } from '../components/MaintenanceTable';
import { MaintenanceFormModal } from '../components/MaintenanceFormModal';
import { useMaintenance } from '../hooks/useMaintenance';
import type { MaintenanceLog } from '../types';

export default function MaintenancePage() {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: '',
    type: '',
    search: '',
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editData, setEditData] = useState<MaintenanceLog | null>(null);

  const { data, isLoading } = useMaintenance(filters);

  const handleEdit = (log: MaintenanceLog) => {
    setEditData(log);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setEditData(null);
    setIsFormOpen(true);
  };

  return (
    <div className="flex flex-col h-full bg-surface-50 dark:bg-surface-950">
      <div className="flex items-center justify-between px-8 py-6 bg-white dark:bg-surface-900 border-b border-surface-200 dark:border-surface-800">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Maintenance</h1>
          <p className="text-sm text-surface-500">Manage vehicle service and repair logs.</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Schedule Service
        </Button>
      </div>

      <MaintenanceFilters filters={filters} onChange={setFilters} />

      <div className="flex-1 p-8 overflow-auto">
        <div className="bg-white dark:bg-surface-900 rounded-xl shadow-sm border border-surface-200 dark:border-surface-800">
          <MaintenanceTable 
            data={data?.data || []} 
            isLoading={isLoading} 
            onEdit={handleEdit}
          />
        </div>
      </div>

      <MaintenanceFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        editData={editData}
      />
    </div>
  );
}
