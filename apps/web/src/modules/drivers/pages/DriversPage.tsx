import { useState } from 'react';
import {
  Users,
  AlertTriangle,
  Plus,
  Download,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { DriverTable } from '../components/DriverTable';
import { DriverFilters } from '../components/DriverFilters';
import { DriverFormModal } from '../components/DriverFormModal';
import { DriverSummaryCards } from '../components/DriverSummaryCards';
import { DriverQuickActions } from '../components/DriverQuickActions';
import {
  useDrivers,
  useDriverStats,
  useDeleteDriver,
  useBulkDeleteDrivers,
} from '../hooks/useDrivers';
import type { Driver, DriverFilters as DriverFiltersType } from '../types';

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
      <div className="mx-4 w-full max-w-md rounded-2xl border border-surface-800 bg-surface-900 p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-950/30">
            <AlertTriangle className="h-5 w-5 text-red-500" />
          </div>
          <h2 className="text-lg font-semibold text-white">Delete Driver</h2>
        </div>
        <p className="mb-1 text-surface-300">
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

// ─── Driver Empty State Illustration ──────────────────────────────────────────
function DriverEmptyIllustration() {
  return (
    <div className="relative flex items-center justify-center h-24 w-32 mx-auto mb-2">
      {/* Left person silhouette */}
      <div className="absolute left-2 bottom-0 flex flex-col items-center">
        <div className="h-6 w-6 rounded-full bg-primary-800/40 border border-primary-700/30" />
        <div className="mt-1 h-8 w-6 rounded-t-lg bg-primary-800/40 border border-primary-700/30 border-b-0" />
      </div>
      {/* Center person (main) */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="h-8 w-8 rounded-full bg-primary-600/30 border-2 border-primary-500/50 flex items-center justify-center">
          <Users className="h-4 w-4 text-primary-400" />
        </div>
        <div className="mt-1 h-10 w-10 rounded-t-xl bg-primary-600/20 border-2 border-primary-500/30 border-b-0" />
      </div>
      {/* Right person silhouette with gear */}
      <div className="absolute right-2 bottom-0 flex flex-col items-center">
        <div className="h-6 w-6 rounded-full bg-primary-800/40 border border-primary-700/30 flex items-center justify-center">
          <svg className="h-3 w-3 text-primary-500/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
        </div>
        <div className="mt-1 h-8 w-6 rounded-t-lg bg-primary-800/40 border border-primary-700/30 border-b-0" />
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

  const isEmpty = !isLoading && (!data?.data || data.data.length === 0);

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
    <PageContainer>
      {/* Page Header */}
      <PageHeader
        title="Driver Management"
        subtitle="Manage driver profiles, licenses, medical certificates, and vehicle assignments."
        actions={
          <Button onClick={() => setIsFormOpen(true)} id="add-driver-btn">
            <Plus className="mr-2 h-4 w-4" />
            Add Driver
          </Button>
        }
      />

      {/* Summary Stat Cards */}
      <DriverSummaryCards stats={stats} isLoading={isLoadingStats} />

      {/* Filters + Table */}
      <div className="rounded-[18px] border border-surface-800/40 bg-[#0B1426]/50 p-6 shadow-sm">
        <DriverFilters
          onFiltersChange={(newFilters) =>
            setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }))
          }
        />

        {isEmpty ? (
          <div className="flex flex-col items-center justify-center rounded-[18px] border border-dashed border-surface-700/50 bg-surface-900/30 text-center p-16 min-h-[340px]">
            <DriverEmptyIllustration />
            <h3 className="mt-4 text-[length:var(--text-h3)] leading-[var(--leading-h3)] font-semibold text-white">
              No drivers available
            </h3>
            <p className="mt-2 max-w-sm text-[length:var(--text-body-sm)] text-surface-400">
              Get started by adding your first driver to the system.
            </p>
            <Button onClick={() => setIsFormOpen(true)} className="mt-8">
              <Plus className="mr-2 h-4 w-4" />
              Add Driver
            </Button>
            <button className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-surface-400 hover:text-primary-400 transition-colors">
              <Download className="h-4 w-4" />
              Import drivers in bulk
            </button>
          </div>
        ) : (
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
        )}
      </div>

      {/* Quick Actions / Getting Started */}
      <DriverQuickActions onAddDriver={() => setIsFormOpen(true)} />

      {/* Driver Form Modal */}
      <DriverFormModal
        isOpen={isFormOpen}
        onClose={closeForm}
        driver={editingDriver}
      />

      <ConfirmDeleteModal
        driver={deletingDriver}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingDriver(null)}
        isLoading={deleteMutation.isPending}
      />
    </PageContainer>
  );
}
