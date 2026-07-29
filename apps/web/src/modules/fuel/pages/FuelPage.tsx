import { useState } from 'react';
import { Plus, Download } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';

import { FuelFilters } from '../components/FuelFilters';
import { FuelTable } from '../components/FuelTable';
import { FuelFormModal } from '../components/FuelFormModal';
import { FuelSummaryCards } from '../components/FuelSummaryCards';
import { FuelQuickActions } from '../components/FuelQuickActions';
import { useFuelLogs, useCreateFuelLog, useUpdateFuelLog } from '../hooks/useFuel';
import type { FuelLog } from '../types';

// ─── Fuel Empty State Illustration ────────────────────────────────────────────
function FuelEmptyIllustration() {
  return (
    <div className="relative flex items-center justify-center h-24 w-36 mx-auto mb-2">
      {/* Fuel pump icon */}
      <div className="absolute left-1 top-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-900/30 border border-primary-800/30">
          <svg className="h-6 w-6 text-primary-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 22v-8p2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v8" />
            <path d="M7 22V11a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v11" />
            <path d="M13 5h3a2 2 0 0 1 2 2v2" />
            <path d="M18 10a2 2 0 0 0-2-2h-3" />
            <circle cx="7" cy="6" r="2" />
          </svg>
        </div>
      </div>
      {/* Clipboard / document center */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="flex h-16 w-14 items-center justify-center rounded-xl bg-primary-800/20 border-2 border-primary-700/30">
          <svg className="h-8 w-8 text-primary-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
        </div>
      </div>
      {/* Small leaf icon */}
      <div className="absolute right-2 bottom-0">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-900/20 border border-emerald-800/20">
          <svg className="h-4 w-4 text-emerald-500/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
            <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export function FuelPage() {
  const [filters, setFilters] = useState({ page: 1, limit: 10, search: '', status: '', type: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLog, setEditingLog] = useState<FuelLog | null>(null);

  const { data: logsData, isLoading } = useFuelLogs(filters);
  const { mutate: createLog } = useCreateFuelLog();
  const { mutate: updateLog } = useUpdateFuelLog();

  const isEmpty = !isLoading && (!logsData?.data || logsData.data.length === 0);

  // We enforce 'empty details' as requested: 0 for all metrics.
  const stats = {
    totalRefuels: 0,
    monthlyCost: 0,
    avgEfficiency: 'N/A',
    highestCostVehicle: 'N/A',
  };

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

  const handleCreate = () => {
    setEditingLog(null);
    setIsModalOpen(true);
  };

  return (
    <PageContainer>
      {/* Page Header */}
      <PageHeader
        title="Fuel Management"
        subtitle="Monitor fuel consumption and costs."
        actions={
          <Button onClick={handleCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Log Fuel Entry
          </Button>
        }
      />

      {/* Summary Stat Cards */}
      <FuelSummaryCards
        todayRefuels={stats.totalRefuels}
        monthlyCost={stats.monthlyCost}
        avgEfficiency={stats.avgEfficiency}
        highestCostVehicle={stats.highestCostVehicle}
        isLoading={isLoading}
      />

      {/* Filters + Table Section */}
      <div className="rounded-[18px] border border-surface-800/40 bg-[#0B1426]/50 p-6 shadow-sm">
        <FuelFilters onFiltersChange={(newFilters) => setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }))} />

        {isEmpty ? (
          <div className="flex flex-col items-center justify-center rounded-[18px] border border-dashed border-surface-700/50 bg-surface-900/30 text-center p-16 min-h-[340px]">
            <FuelEmptyIllustration />
            <h3 className="mt-4 text-[length:var(--text-h3)] leading-[var(--leading-h3)] font-semibold text-white">
              No fuel logs
            </h3>
            <p className="mt-2 max-w-sm text-[length:var(--text-body-sm)] text-surface-400">
              Log your first fuel entry to start tracking fuel consumption and costs.
            </p>
            <Button onClick={handleCreate} className="mt-8">
              <Plus className="mr-2 h-4 w-4" />
              Log Fuel Entry
            </Button>
            <button
              onClick={handleCreate}
              className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-surface-400 hover:text-primary-400 transition-colors"
            >
              <Download className="h-4 w-4" />
              Import fuel logs
            </button>
          </div>
        ) : (
          <FuelTable
            data={logsData?.data || []}
            isLoading={isLoading}
            onEdit={handleEdit}
          />
        )}
      </div>

      {/* Quick Actions / Getting Started */}
      <FuelQuickActions onLogFuel={handleCreate} />

      <FuelFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        initialData={editingLog}
      />
    </PageContainer>
  );
}
