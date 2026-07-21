import { useState, useCallback } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import type { DriverFilters } from '../types';

interface DriverFiltersProps {
  onFiltersChange: (filters: Partial<DriverFilters>) => void;
}

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'AVAILABLE', label: 'Available' },
  { value: 'ON_TRIP', label: 'On Trip' },
  { value: 'ON_LEAVE', label: 'On Leave' },
  { value: 'SUSPENDED', label: 'Suspended' },
  { value: 'TERMINATED', label: 'Terminated' },
];

const LICENSE_CATEGORIES = [
  { value: '', label: 'All Categories' },
  { value: 'CLASS_A', label: 'Class A' },
  { value: 'CLASS_B', label: 'Class B' },
  { value: 'CLASS_C', label: 'Class C' },
  { value: 'CLASS_D', label: 'Class D' },
  { value: 'HEAVY_RIGID', label: 'Heavy Rigid' },
  { value: 'COMBINATION', label: 'Combination' },
];

const EXPIRY_WINDOWS = [
  { value: '', label: 'Any Expiry' },
  { value: '30', label: 'Expiring in 30 days' },
  { value: '60', label: 'Expiring in 60 days' },
  { value: '90', label: 'Expiring in 90 days' },
];

export function DriverFilters({ onFiltersChange }: DriverFiltersProps) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [licenseCategory, setLicenseCategory] = useState('');
  const [licenseExpiryDays, setLicenseExpiryDays] = useState('');
  const [medicalExpiryDays, setMedicalExpiryDays] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const hasActiveFilters = status || licenseCategory || licenseExpiryDays || medicalExpiryDays || search;

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

  const handleLicenseExpiryChange = useCallback(
    (value: string) => {
      setLicenseExpiryDays(value);
      onFiltersChange({ licenseExpiryDays: value ? Number(value) : undefined });
    },
    [onFiltersChange],
  );

  const handleMedicalExpiryChange = useCallback(
    (value: string) => {
      setMedicalExpiryDays(value);
      onFiltersChange({ medicalExpiryDays: value ? Number(value) : undefined });
    },
    [onFiltersChange],
  );

  const clearFilters = useCallback(() => {
    setSearch('');
    setStatus('');
    setLicenseCategory('');
    setLicenseExpiryDays('');
    setMedicalExpiryDays('');
    onFiltersChange({
      search: undefined,
      status: undefined,
      licenseCategory: undefined,
      licenseExpiryDays: undefined,
      medicalExpiryDays: undefined,
    });
  }, [onFiltersChange]);

  return (
    <div className="mb-4 space-y-3">
      {/* Search + Toggle */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />
          <Input
            id="driver-search"
            placeholder="Search by name, employee ID, license, phone, email..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="shrink-0"
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filters
            {hasActiveFilters && (
              <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-[10px] font-bold text-white">
                !
              </span>
            )}
          </Button>

          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="shrink-0 text-red-500">
              <X className="mr-1 h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="rounded-lg border border-surface-200 bg-surface-50 p-4 dark:border-surface-700 dark:bg-surface-800/50">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-surface-600 dark:text-surface-400">
                Status
              </label>
              <Select
                id="filter-status"
                value={status}
                onChange={(e) => handleStatusChange(e.target.value)}
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-surface-600 dark:text-surface-400">
                License Category
              </label>
              <Select
                id="filter-license-category"
                value={licenseCategory}
                onChange={(e) => handleLicenseCategoryChange(e.target.value)}
              >
                {LICENSE_CATEGORIES.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-surface-600 dark:text-surface-400">
                License Expiry
              </label>
              <Select
                id="filter-license-expiry"
                value={licenseExpiryDays}
                onChange={(e) => handleLicenseExpiryChange(e.target.value)}
              >
                {EXPIRY_WINDOWS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-surface-600 dark:text-surface-400">
                Medical Expiry
              </label>
              <Select
                id="filter-medical-expiry"
                value={medicalExpiryDays}
                onChange={(e) => handleMedicalExpiryChange(e.target.value)}
              >
                {EXPIRY_WINDOWS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
