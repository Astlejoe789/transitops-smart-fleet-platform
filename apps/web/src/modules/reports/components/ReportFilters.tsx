import { useState, useCallback } from 'react';
import { Search, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ReportFiltersProps {
  onFiltersChange: (filters: { search?: string; type?: string; status?: string }) => void;
  reportTypes: { id: string; label: string }[];
}

export function ReportFilters({ onFiltersChange, reportTypes }: ReportFiltersProps) {
  const [search, setSearch] = useState('');
  const [type, setType] = useState('fleet');
  const [status, setStatus] = useState('');

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearch(value);
      onFiltersChange({ search: value || undefined });
    },
    [onFiltersChange],
  );

  const handleTypeChange = useCallback(
    (value: string) => {
      setType(value);
      onFiltersChange({ type: value || undefined });
    },
    [onFiltersChange],
  );

  const handleStatusChange = useCallback(
    (value: string) => {
      setStatus(value);
      onFiltersChange({ status: value || undefined });
    },
    [onFiltersChange],
  );

  return (
    <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center">
      {/* Search input */}
      <div className="relative flex-1 max-w-xl">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-500" />
        <input
          id="report-search"
          placeholder="Search reports..."
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
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

        {/* Report Type dropdown */}
        <div className="relative">
          <select
            id="filter-type"
            value={type}
            onChange={(e) => handleTypeChange(e.target.value)}
            className="flex h-11 items-center justify-between rounded-[var(--radius-lg)] border border-surface-700 bg-surface-900 pl-3 pr-8 py-2 text-[length:var(--text-body-sm)] text-white ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 appearance-none cursor-pointer min-w-[140px]"
          >
            {reportTypes.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-500 pointer-events-none" />
        </div>

        {/* Status dropdown */}
        <div className="relative">
          <select
            id="filter-status"
            value={status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="flex h-11 items-center justify-between rounded-[var(--radius-lg)] border border-surface-700 bg-surface-900 pl-3 pr-8 py-2 text-[length:var(--text-body-sm)] text-white ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 appearance-none cursor-pointer min-w-[120px]"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="PENDING">Pending</option>
            <option value="COMPLETED">Completed</option>
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
