import { useState } from 'react';
import {
  Users,
  UserCheck,
  Navigation,
  AlertTriangle,
  ShieldAlert,
  Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { DriverTable } from '../components/DriverTable';
import { DriverFilters } from '../components/DriverFilters';
import { DriverFormModal } from '../components/DriverFormModal';
import {
  useDrivers,
  useDriverStats,
  useDeleteDriver,
  useBulkDeleteDrivers,
} from '../hooks/useDrivers';
import type { Driver, DriverFilters as DriverFiltersType } from '../types';

// ─── Stat Card ────────────────────────────────────────────────────────────────
interface StatCardProps {
  label: string;
  value: number | undefined;
  icon: typeof Users;
  color: string;
  isLoading?: boolean;
}

function StatCard({ label, value, icon: Icon, color, isLoading }: StatCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-surface-200 bg-white p-4 shadow-sm dark:border-surface-800 dark:bg-surface-900">
      <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${color}`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div>
        {isLoading ? (
          <div className="h-6 w-12 animate-pulse rounded bg-surface-200 dark:bg-surface-700" />
        ) : (
          <p className="text-2xl font-bold text-surface-900 dark:text-white">{value ?? 0}</p>
        )}
        <p className="text-xs text-surface-500">{label}</p>
      </div>
    </div>
  );
}

// ─── Confirm Delete Modal ─────────────────────────────────────────────────────
function ConfirmDeleteModal({
  driver,
  onConfirm,
  onCancel,
  isLoading,
}: {
  driver: Driver | null;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}) {
  if (!driver) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-md rounded-2xl border border-surface-200 bg-white p-6 shadow-2xl dark:border-surface-800 dark:bg-surface-900">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/30">
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </div>
          <h2 className="text-lg font-semibold text-surface-900 dark:text-white">Delete Driver</h2>
        </div>
        <p className="mb-1 text-surface-700 dark:text-surface-300">
          Are you sure you want to delete{' '}
          <strong>
            {driver.user?.firstName} {driver.user?.lastName}
          </strong>{' '}
          ({driver.employeeId})?
        </p>
        <p className="mb-6 text-sm text-surface-500">
          This will soft-delete the driver. They can be restored later.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="destructive" isLoading={isLoading} onClick={onConfirm}>
            Delete Driver
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function DriversPage() {
  const [filters, setFilters] = useState<DriverFiltersType>({ page: 1, limit: 10 });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [deletingDriver, setDeletingDriver] = useState<Driver | null>(null);

  const { data, isLoading } = useDrivers(filters);
  const { data: stats, isLoading: isLoadingStats } = useDriverStats();
  const deleteMutation = useDeleteDriver();
  const bulkDeleteMutation = useBulkDeleteDrivers();

  const handleEdit = (driver: Driver) => {
    setEditingDriver(driver);
    setIsFormOpen(true);
  };

  const handleDelete = (driver: Driver) => {
    setDeletingDriver(driver);
  };

  const handleConfirmDelete = async () => {
    if (!deletingDriver) return;
    try {
      await deleteMutation.mutateAsync(deletingDriver.id);
      setDeletingDriver(null);
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  const handleBulkDelete = async (ids: string[]) => {
    if (!confirm(`Delete ${ids.length} driver(s)? They can be restored later.`)) return;
    try {
      await bulkDeleteMutation.mutateAsync(ids);
    } catch (err) {
      console.error('Bulk delete failed', err);
    }
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingDriver(null);
  };

  return (
    <div className="mx-auto max-w-7xl pb-8">
      {/* Page Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-surface-900 dark:text-white sm:text-3xl">
            Driver Management
          </h1>
          <p className="mt-1 text-sm text-surface-500 dark:text-surface-400">
            Manage driver profiles, licenses, medical certificates, and vehicle assignments.
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} id="add-driver-btn">
          <Plus className="mr-2 h-4 w-4" />
          Add Driver
        </Button>
      </div>

      {/* Stats Bar */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard
          label="Total Drivers"
          value={stats?.total}
          icon={Users}
          color="bg-gradient-to-br from-primary-500 to-primary-700"
          isLoading={isLoadingStats}
        />
        <StatCard
          label="Available"
          value={stats?.available}
          icon={UserCheck}
          color="bg-gradient-to-br from-emerald-500 to-emerald-700"
          isLoading={isLoadingStats}
        />
        <StatCard
          label="On Trip"
          value={stats?.onTrip}
          icon={Navigation}
          color="bg-gradient-to-br from-blue-500 to-blue-700"
          isLoading={isLoadingStats}
        />
        <StatCard
          label="License Expiring"
          value={stats?.expiringLicense}
          icon={AlertTriangle}
          color="bg-gradient-to-br from-amber-500 to-amber-700"
          isLoading={isLoadingStats}
        />
        <StatCard
          label="License Expired"
          value={stats?.expiredLicense}
          icon={ShieldAlert}
          color="bg-gradient-to-br from-red-500 to-red-700"
          isLoading={isLoadingStats}
        />
      </div>

      {/* Filters + Table */}
      <div className="rounded-xl border border-surface-200 bg-white p-6 shadow-sm dark:border-surface-800 dark:bg-surface-900">
        <DriverFilters
          onFiltersChange={(newFilters) =>
            setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }))
          }
        />

        <DriverTable
          data={data?.data ?? []}
          isLoading={isLoading}
          total={data?.meta.total ?? 0}
          page={filters.page ?? 1}
          limit={filters.limit ?? 10}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
          onBulkDelete={handleBulkDelete}
        />
      </div>

      {/* Driver Form Modal */}
      <DriverFormModal
        isOpen={isFormOpen}
        onClose={closeForm}
        driver={editingDriver}
      />

      {/* Delete Confirmation */}
      <ConfirmDeleteModal
        driver={deletingDriver}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingDriver(null)}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
