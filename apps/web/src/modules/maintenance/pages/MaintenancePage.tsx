import { useState, useMemo } from 'react';
import { Plus, Wrench, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';

import { MaintenanceFilters } from '../components/MaintenanceFilters';
import { MaintenanceTable } from '../components/MaintenanceTable';
import { MaintenanceFormModal } from '../components/MaintenanceFormModal';
import { MaintenanceSummaryCards } from '../components/MaintenanceSummaryCards';
import { MaintenanceQuickActions } from '../components/MaintenanceQuickActions';
import { useMaintenance } from '../hooks/useMaintenance';
import type { MaintenanceLog } from '../types';

// ─── Maintenance Empty State Illustration ─────────────────────────────────────
function MaintenanceEmptyIllustration() {
  return (
    <div className="relative flex items-center justify-center h-24 w-36 mx-auto mb-2">
      {/* Wrench icon */}
      <div className="absolute left-3 top-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-800/30 border border-primary-700/20">
          <Wrench className="h-5 w-5 text-primary-400" />
        </div>
      </div>
      {/* Vehicle / clipboard center */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary-600/15 border-2 border-primary-500/30">
          <svg className="h-8 w-8 text-primary-400/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M9 7h6M9 11h6M9 15h4" />
          </svg>
        </div>
      </div>
      {/* Gear / settings icon */}
      <div className="absolute right-3 top-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-800/30 border border-primary-700/20">
          <svg className="h-5 w-5 text-primary-500/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
        </div>
      </div>
    </div>
  );
}

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

  const isEmpty = !isLoading && (!data?.data || data.data.length === 0);

  // Derive summary stats from data
  const stats = useMemo(() => {
    const records: MaintenanceLog[] = data?.data || [];
    return {
      total: data?.meta?.total ?? records.length,
      upcoming: records.filter((r) => r.status === 'SCHEDULED' || r.status === 'TECHNICIAN_ASSIGNED').length,
      overdue: 0, // Would need backend support for overdue detection
      completed: records.filter((r) => r.status === 'COMPLETED' || r.status === 'VERIFIED' || r.status === 'CLOSED').length,
      openIssues: records.filter((r) => r.status === 'IN_PROGRESS' || r.status === 'WAITING_FOR_PARTS').length,
    };
  }, [data]);

  const handleEdit = (log: MaintenanceLog) => {
    setEditData(log);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setEditData(null);
    setIsFormOpen(true);
  };

  return (
    <PageContainer>
      {/* Page Header */}
      <PageHeader
        title="Maintenance"
        subtitle="Manage vehicle service and repair logs."
        actions={
          <Button onClick={handleCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Schedule Service
          </Button>
        }
      />

      {/* Summary Stat Cards */}
      <MaintenanceSummaryCards
        totalServices={stats.total}
        upcoming={stats.upcoming}
        overdue={stats.overdue}
        completed={stats.completed}
        openIssues={stats.openIssues}
        isLoading={isLoading}
      />

      {/* Filters + Table Section */}
      <div className="rounded-[18px] border border-surface-800/40 bg-[#0B1426]/50 p-6 shadow-sm">
        <MaintenanceFilters filters={filters} onChange={setFilters} />

        {isEmpty ? (
          <div className="flex flex-col items-center justify-center rounded-[18px] border border-dashed border-surface-700/50 bg-surface-900/30 text-center p-16 min-h-[340px]">
            <MaintenanceEmptyIllustration />
            <h3 className="mt-4 text-[length:var(--text-h3)] leading-[var(--leading-h3)] font-semibold text-white">
              No maintenance records
            </h3>
            <p className="mt-2 max-w-sm text-[length:var(--text-body-sm)] text-surface-400">
              Schedule a service or add a repair log to keep your fleet running smoothly.
            </p>
            <Button onClick={handleCreate} className="mt-8">
              <Plus className="mr-2 h-4 w-4" />
              Schedule Service
            </Button>
            <button
              onClick={handleCreate}
              className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-surface-400 hover:text-primary-400 transition-colors"
            >
              <ClipboardList className="h-4 w-4" />
              Add Repair Log
            </button>
          </div>
        ) : (
          <MaintenanceTable
            data={data?.data || []}
            isLoading={isLoading}
            onEdit={handleEdit}
          />
        )}
      </div>

      {/* Quick Actions / Getting Started */}
      <MaintenanceQuickActions onScheduleService={handleCreate} />

      <MaintenanceFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        editData={editData}
      />
    </PageContainer>
  );
}
