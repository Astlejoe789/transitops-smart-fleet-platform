import { Search, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface MaintenanceFiltersProps {
  filters: any;
  onChange: (filters: any) => void;
}

export function MaintenanceFilters({ filters, onChange }: MaintenanceFiltersProps) {
  return (
    <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center">
      {/* Search input */}
      <div className="relative flex-1 max-w-xl">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-500" />
        <input
          placeholder="Search by ID, vehicle, description..."
          value={filters.search || ''}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          className="flex h-11 w-full rounded-[var(--radius-lg)] border border-surface-700 bg-surface-900 pl-10 pr-3 py-2 text-[length:var(--text-body-sm)] text-white ring-offset-background placeholder:text-surface-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
      </div>

      {/* Filter controls */}
      <div className="flex items-center gap-2">
        {/* Filters label */}
        <div className="flex items-center gap-1.5 px-3 h-11 rounded-[var(--radius-lg)] border border-surface-700 bg-surface-900 text-[13px] font-medium text-surface-400 cursor-default select-none">
          <SlidersHorizontal className="h-4 w-4" />
          <span>Filters</span>
        </div>

        {/* Status dropdown */}
        <div className="relative">
          <select
            value={filters.status || ''}
            onChange={(e) => onChange({ ...filters, status: e.target.value })}
            className="flex h-11 items-center justify-between rounded-[var(--radius-lg)] border border-surface-700 bg-surface-900 pl-3 pr-8 py-2 text-[length:var(--text-body-sm)] text-white ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 appearance-none cursor-pointer min-w-[140px]"
          >
            <option value="">All Statuses</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="TECHNICIAN_ASSIGNED">Technician Assigned</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="WAITING_FOR_PARTS">Waiting for Parts</option>
            <option value="COMPLETED">Completed</option>
            <option value="VERIFIED">Verified</option>
            <option value="CLOSED">Closed</option>
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-500 pointer-events-none" />
        </div>

        {/* Type dropdown */}
        <div className="relative">
          <select
            value={filters.type || ''}
            onChange={(e) => onChange({ ...filters, type: e.target.value })}
            className="flex h-11 items-center justify-between rounded-[var(--radius-lg)] border border-surface-700 bg-surface-900 pl-3 pr-8 py-2 text-[length:var(--text-body-sm)] text-white ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 appearance-none cursor-pointer min-w-[120px]"
          >
            <option value="">All Types</option>
            <option value="PREVENTIVE">Preventive</option>
            <option value="CORRECTIVE">Corrective</option>
            <option value="EMERGENCY">Emergency</option>
            <option value="INSPECTION">Inspection</option>
            <option value="WARRANTY">Warranty</option>
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-500 pointer-events-none" />
        </div>

        {/* More Filters button */}
        <Button
          variant="outline"
          className="gap-1.5 text-surface-400 border-surface-700 hover:text-white"
        >
          <SlidersHorizontal className="h-4 w-4" />
          More Filters
        </Button>
      </div>
    </div>
  );
}
