import { useState, useMemo } from 'react';
import { Plus, Truck, Download } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';

import { VehicleTable } from '../components/VehicleTable';
import { VehicleFilters } from '../components/VehicleFilters';
import { VehicleFormModal } from '../components/VehicleFormModal';
import { FleetSummaryCards } from '../components/FleetSummaryCards';
import { FleetQuickActions } from '../components/FleetQuickActions';
import { useVehicles, useDeleteVehicle, type Vehicle } from '../hooks/useFleet';

export default function FleetPage() {
  const [filters, setFilters] = useState({ page: 1, limit: 10 });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  const { data, isLoading } = useVehicles(filters);
  const deleteMutation = useDeleteVehicle();

  // Derive summary stats from data
  const stats = useMemo(() => {
    const vehicles = data?.data || [];
    return {
      total: data?.meta?.total ?? vehicles.length,
      active: vehicles.filter((v) => v.status === 'AVAILABLE' || v.status === 'IN_TRANSIT').length,
      maintenance: vehicles.filter((v) => v.status === 'MAINTENANCE').length,
      documentsExpiring: 0, // Will be populated when document expiry tracking is implemented
    };
  }, [data]);

  const isEmpty = !isLoading && (!data?.data || data.data.length === 0);

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

      {/* Summary Stat Cards */}
      <FleetSummaryCards
        totalVehicles={stats.total}
        activeVehicles={stats.active}
        inMaintenance={stats.maintenance}
        documentsExpiring={stats.documentsExpiring}
      />

      {/* Filter + Table Section */}
      <div className="rounded-[18px] border border-surface-800/40 bg-[#0B1426]/50 p-6 shadow-sm">
        <VehicleFilters onFiltersChange={(newFilters) => setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }))} />

        {isEmpty ? (
          <div className="flex flex-col items-center justify-center rounded-[18px] border border-dashed border-surface-700/50 bg-surface-900/30 text-center p-16 min-h-[340px]">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-900/30">
              <Truck className="h-8 w-8 text-primary-400" />
            </div>
            <h3 className="mt-4 text-[length:var(--text-h3)] leading-[var(--leading-h3)] font-semibold text-white">
              No vehicles available
            </h3>
            <p className="mt-2 max-w-sm text-[length:var(--text-body-sm)] text-surface-400">
              Get started by adding your first vehicle to the fleet.
            </p>
            <Button onClick={() => setIsFormOpen(true)} className="mt-8">
              <Plus className="mr-2 h-4 w-4" />
              Add Vehicle
            </Button>
            <button className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-surface-400 hover:text-primary-400 transition-colors">
              <Download className="h-4 w-4" />
              Import vehicles in bulk
            </button>
          </div>
        ) : (
          <VehicleTable
            data={data?.data || []}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      {/* Quick Actions / Getting Started */}
      <FleetQuickActions onAddVehicle={() => setIsFormOpen(true)} />

      <VehicleFormModal
        isOpen={isFormOpen}
        onClose={closeForm}
        vehicle={editingVehicle}
      />
    </PageContainer>
  );
}
