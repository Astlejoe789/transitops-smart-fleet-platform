import { useState, useCallback } from 'react';
import { Search, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface FuelFiltersProps {
  onFiltersChange: (filters: { search?: string; status?: string; type?: string }) => void;
}

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'PENDING', label: 'Pending' },
];

const TYPE_OPTIONS = [
  { value: '', label: 'All Types' },
  { value: 'DIESEL', label: 'Diesel' },
  { value: 'PETROL', label: 'Petrol' },
  { value: 'ELECTRIC', label: 'Electric' },
  { value: 'HYBRID', label: 'Hybrid' },
  { value: 'CNG', label: 'CNG' },
];

export function FuelFilters({ onFiltersChange }: FuelFiltersProps) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [type, setType] = useState('');

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearch(value);
      onFiltersChange({ search: value || undefined });
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

  const handleTypeChange = useCallback(
    (value: string) => {
      setType(value);
      onFiltersChange({ type: value || undefined });
    },
    [onFiltersChange],
  );

  return (
    <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center">
      {/* Search input */}
      <div className="relative flex-1 max-w-xl">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-500" />
        <input
          id="fuel-search"
          placeholder="Search by ID, vehicle, station..."
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

        {/* Status dropdown */}
        <div className="relative">
          <select
            id="filter-status"
            value={status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="flex h-11 items-center justify-between rounded-[var(--radius-lg)] border border-surface-700 bg-surface-900 pl-3 pr-8 py-2 text-[length:var(--text-body-sm)] text-white ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 appearance-none cursor-pointer min-w-[140px]"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-500 pointer-events-none" />
        </div>

        {/* Type dropdown */}
        <div className="relative">
          <select
            id="filter-type"
            value={type}
            onChange={(e) => handleTypeChange(e.target.value)}
            className="flex h-11 items-center justify-between rounded-[var(--radius-lg)] border border-surface-700 bg-surface-900 pl-3 pr-8 py-2 text-[length:var(--text-body-sm)] text-white ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 appearance-none cursor-pointer min-w-[120px]"
          >
            {TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
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
