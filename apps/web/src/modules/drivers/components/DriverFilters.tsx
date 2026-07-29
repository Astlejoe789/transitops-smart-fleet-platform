import { useState, useCallback } from 'react';
import { Search, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { DriverFilters as DriverFiltersType } from '../types';

interface DriverFiltersProps {
  onFiltersChange: (filters: Partial<DriverFiltersType>) => void;
}

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'AVAILABLE', label: 'Available' },
  { value: 'ON_TRIP', label: 'On Trip' },
  { value: 'ON_LEAVE', label: 'On Leave' },
  { value: 'SUSPENDED', label: 'Suspended' },
  { value: 'TERMINATED', label: 'Terminated' },
];

const TYPE_OPTIONS = [
  { value: '', label: 'All Types' },
  { value: 'CLASS_A', label: 'Class A' },
  { value: 'CLASS_B', label: 'Class B' },
  { value: 'CLASS_C', label: 'Class C' },
  { value: 'CLASS_D', label: 'Class D' },
  { value: 'HEAVY_RIGID', label: 'Heavy Rigid' },
  { value: 'COMBINATION', label: 'Combination' },
];

export function DriverFilters({ onFiltersChange }: DriverFiltersProps) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [licenseCategory, setLicenseCategory] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

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

  const handleLicenseCategoryChange = useCallback(
    (value: string) => {
      setLicenseCategory(value);
      onFiltersChange({ licenseCategory: value || undefined });
    },
    [onFiltersChange],
  );

  return (
    <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center">
      {/* Search input */}
      <div className="relative flex-1 max-w-xl">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-500" />
        <input
          id="driver-search"
          placeholder="Search by name, employee ID, license, phone, email..."
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

        {/* License Category / Type dropdown */}
        <div className="relative">
          <select
            id="filter-license-category"
            value={licenseCategory}
            onChange={(e) => handleLicenseCategoryChange(e.target.value)}
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
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          <SlidersHorizontal className="h-4 w-4" />
          More Filters
        </Button>
      </div>

      {/* Advanced filter panel (hidden by default, shown via More Filters) */}
      {showAdvanced && (
        <div className="w-full rounded-[var(--radius-lg)] border border-surface-700 bg-surface-900/80 p-4 mt-2 lg:mt-0">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-surface-400">License Expiry</label>
              <div className="relative">
                <select
                  className="flex h-11 w-full items-center rounded-[var(--radius-lg)] border border-surface-700 bg-surface-950 pl-3 pr-8 py-2 text-[length:var(--text-body-sm)] text-white appearance-none cursor-pointer"
                  onChange={(e) => onFiltersChange({ licenseExpiryDays: e.target.value ? Number(e.target.value) : undefined })}
                >
                  <option value="">Any Expiry</option>
                  <option value="30">Expiring in 30 days</option>
                  <option value="60">Expiring in 60 days</option>
                  <option value="90">Expiring in 90 days</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-500 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-surface-400">Medical Expiry</label>
              <div className="relative">
                <select
                  className="flex h-11 w-full items-center rounded-[var(--radius-lg)] border border-surface-700 bg-surface-950 pl-3 pr-8 py-2 text-[length:var(--text-body-sm)] text-white appearance-none cursor-pointer"
                  onChange={(e) => onFiltersChange({ medicalExpiryDays: e.target.value ? Number(e.target.value) : undefined })}
                >
                  <option value="">Any Expiry</option>
                  <option value="30">Expiring in 30 days</option>
                  <option value="60">Expiring in 60 days</option>
                  <option value="90">Expiring in 90 days</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-500 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
