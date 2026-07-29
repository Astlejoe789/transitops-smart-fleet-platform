import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface VehicleFiltersProps {
  onFiltersChange: (filters: { search?: string; status?: string; type?: string }) => void;
}

export function VehicleFilters({ onFiltersChange }: VehicleFiltersProps) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [type, setType] = useState('');

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      onFiltersChange({ search, status, type });
    }, 300);

    return () => clearTimeout(handler);
  }, [search, status, type, onFiltersChange]);

  return (
    <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center">
      {/* Search input */}
      <div className="relative flex-1 max-w-xl">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-500" />
        <input
          placeholder="Search by plate, VIN, make, model, or driver..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
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
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="flex h-11 items-center justify-between rounded-[var(--radius-lg)] border border-surface-700 bg-surface-900 pl-3 pr-8 py-2 text-[length:var(--text-body-sm)] text-white ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 appearance-none cursor-pointer min-w-[140px]"
          >
            <option value="">All Statuses</option>
            <option value="AVAILABLE">Available</option>
            <option value="IN_TRANSIT">In Transit</option>
            <option value="MAINTENANCE">Maintenance</option>
            <option value="OUT_OF_SERVICE">Out of Service</option>
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-500 pointer-events-none" />
        </div>

        {/* Type dropdown */}
        <div className="relative">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="flex h-11 items-center justify-between rounded-[var(--radius-lg)] border border-surface-700 bg-surface-900 pl-3 pr-8 py-2 text-[length:var(--text-body-sm)] text-white ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 appearance-none cursor-pointer min-w-[120px]"
          >
            <option value="">All Types</option>
            <option value="TRUCK">Truck</option>
            <option value="VAN">Van</option>
            <option value="CAR">Car</option>
            <option value="BUS">Bus</option>
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
