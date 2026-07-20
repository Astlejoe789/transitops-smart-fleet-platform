import { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
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

  const clearFilters = () => {
    setSearch('');
    setStatus('');
    setType('');
  };

  const hasFilters = search || status || type;

  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="relative max-w-md flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-surface-500" />
        <Input
          placeholder="Search plate, VIN, make, model..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="flex flex-1 items-center gap-2">
        <div className="flex items-center gap-2 text-sm text-surface-500 dark:text-surface-400">
          <Filter className="h-4 w-4" />
          <span className="hidden sm:inline">Filters:</span>
        </div>

        <Select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="max-w-[150px]"
        >
          <option value="">All Statuses</option>
          <option value="AVAILABLE">Available</option>
          <option value="IN_TRANSIT">In Transit</option>
          <option value="MAINTENANCE">Maintenance</option>
          <option value="OUT_OF_SERVICE">Out of Service</option>
        </Select>

        <Select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="max-w-[150px]"
        >
          <option value="">All Types</option>
          <option value="TRUCK">Truck</option>
          <option value="VAN">Van</option>
          <option value="CAR">Car</option>
          <option value="BUS">Bus</option>
        </Select>

        {hasFilters && (
          <Button variant="ghost" size="icon" onClick={clearFilters} title="Clear filters">
            <X className="h-4 w-4 text-surface-500" />
          </Button>
        )}
      </div>
    </div>
  );
}
