import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { reportsApi } from '../services/reportsApi';
import { AnalyticsTable } from '@/components/analytics/AnalyticsTable';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Plus, Download } from 'lucide-react';

import { ReportSummaryCards } from '../components/ReportSummaryCards';
import { ReportFilters } from '../components/ReportFilters';
import { ReportQuickActions } from '../components/ReportQuickActions';
import { ExportButton } from '@/components/analytics/ExportButton';

const REPORT_TYPES = [
  { id: 'fleet', label: 'Fleet Status' },
  { id: 'drivers', label: 'Driver Activity' },
  { id: 'trips', label: 'Trip Logs' },
  { id: 'fuel', label: 'Fuel Logs' },
  { id: 'maintenance', label: 'Maintenance Logs' },
  { id: 'expenses', label: 'Expense Logs' },
  { id: 'billing', label: 'Billing Invoices' },
];

// ─── Report Empty State Illustration ──────────────────────────────────────────
function ReportEmptyIllustration() {
  return (
    <div className="relative flex items-center justify-center h-24 w-36 mx-auto mb-2">
      {/* Chart icon */}
      <div className="absolute left-1 top-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-900/30 border border-primary-800/30">
          <svg className="h-6 w-6 text-primary-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
        </div>
      </div>
      {/* Document center */}
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
      {/* Small pie icon */}
      <div className="absolute right-2 bottom-0">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-900/20 border border-blue-800/20">
          <svg className="h-4 w-4 text-blue-500/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
            <path d="M22 12A10 10 0 0 0 12 2v10z" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default function ReportsPage() {
  const [filters, setFilters] = useState<Record<string, string>>({ type: 'fleet' });

  const reportType = filters.type || 'fleet';

  const { data: reportData, isLoading } = useQuery({
    queryKey: ['reports', reportType, filters],
    queryFn: () => reportsApi.getReport(reportType, filters),
  });

  const isEmpty = !isLoading && (!reportData || reportData.length === 0);

  // We enforce 'empty details' as requested: 0 for all metrics.
  const stats = {
    totalReports: 0,
    scheduledReports: 0,
    exportedData: 0,
    activeInsights: 0,
  };

  // Generate dynamic columns based on report data
  const generateColumns = () => {
    if (!reportData || reportData.length === 0) return [];
    
    return Object.keys(reportData[0])
      .filter(key => typeof reportData[0][key] !== 'object')
      .map(key => ({
        accessorKey: key,
        header: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
        cell: (info: any) => {
          const val = info.getValue();
          if (val instanceof Date || (typeof val === 'string' && val.includes('T') && val.endsWith('Z'))) {
            return new Date(val).toLocaleDateString();
          }
          return val;
        }
      }));
  };

  const handleCreateReport = () => {
    // Placeholder for creating report
  };

  return (
    <PageContainer>
      {/* Page Header */}
      <PageHeader
        title="Operational Reports"
        subtitle="Generate, view, and export analytics across all modules."
        actions={
          <div className="flex gap-2 items-center">
            <ExportButton data={reportData || []} filename={`${reportType}-report.csv`} />
            <Button onClick={handleCreateReport}>
              <Plus className="w-4 h-4 mr-2" />
              Create Report
            </Button>
          </div>
        }
      />

      {/* Summary Stat Cards */}
      <ReportSummaryCards
        totalReports={stats.totalReports}
        scheduledReports={stats.scheduledReports}
        exportedData={stats.exportedData}
        activeInsights={stats.activeInsights}
        isLoading={isLoading}
      />

      {/* Filters + Table Section */}
      <div className="rounded-[18px] border border-surface-800/40 bg-[#0B1426]/50 p-6 shadow-sm">
        <ReportFilters 
          onFiltersChange={(newFilters) => setFilters((prev) => ({ ...prev, ...newFilters }))} 
          reportTypes={REPORT_TYPES} 
        />

        {isEmpty ? (
          <div className="flex flex-col items-center justify-center rounded-[18px] border border-dashed border-surface-700/50 bg-surface-900/30 text-center p-16 min-h-[340px]">
            <ReportEmptyIllustration />
            <h3 className="mt-4 text-[length:var(--text-h3)] leading-[var(--leading-h3)] font-semibold text-white">
              No data found
            </h3>
            <p className="mt-2 max-w-sm text-[length:var(--text-body-sm)] text-surface-400">
              No data is available for this report type and filter combination.
            </p>
            <Button onClick={handleCreateReport} className="mt-8">
              <Plus className="mr-2 h-4 w-4" />
              Create Report
            </Button>
            <button
              onClick={() => {}}
              className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-surface-400 hover:text-primary-400 transition-colors"
            >
              <Download className="h-4 w-4" />
              Import historic data
            </button>
          </div>
        ) : (
          <AnalyticsTable 
            columns={generateColumns()} 
            data={reportData || []} 
          />
        )}
      </div>

      {/* Quick Actions / Getting Started */}
      <ReportQuickActions onCreateReport={handleCreateReport} onExport={() => {}} />

    </PageContainer>
  );
}
