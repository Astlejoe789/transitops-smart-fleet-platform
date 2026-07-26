import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { VehicleTable } from '../components/VehicleTable';
import { VehicleFilters } from '../components/VehicleFilters';
import { VehicleFormModal } from '../components/VehicleFormModal';
import { useVehicles, useDeleteVehicle, type Vehicle } from '../hooks/useFleet';

export default function FleetPage() {
  const [filters, setFilters] = useState({ page: 1, limit: 10 });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  const { data, isLoading } = useVehicles(filters);
  const deleteMutation = useDeleteVehicle();

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setIsFormOpen(true);
  };

  const handleDelete = async (vehicle: Vehicle) => {
    if (confirm(`Are you sure you want to delete vehicle ${vehicle.plateNumber}?`)) {
      try {
        await deleteMutation.mutateAsync(vehicle.id);
      } catch (error) {
        console.error('Failed to delete vehicle', error);
      }
    }
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingVehicle(null);
  };

  return (
    <PageContainer>
      <PageHeader 
        title="Fleet Management"
        subtitle="Manage your vehicles, documents, and lifecycle status."
        actions={
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Vehicle
          </Button>
        }
      />
      <div className="rounded-xl border border-surface-200 bg-white p-6 shadow-sm dark:border-surface-800 dark:bg-surface-900 mt-6">
        <VehicleFilters onFiltersChange={(newFilters) => setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }))} />
        
        <VehicleTable
          data={data?.data || []}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <VehicleFormModal
        isOpen={isFormOpen}
        onClose={closeForm}
        vehicle={editingVehicle}
      />
    </PageContainer>
  );
}
