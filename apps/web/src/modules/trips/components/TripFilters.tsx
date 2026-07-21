import { Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface TripFiltersProps {
  search: string;
  setSearch: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
}

export function TripFilters({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
}: TripFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-4 w-4 text-surface-400" />
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="block w-full rounded-md border-0 py-2 pl-10 pr-3 text-surface-900 ring-1 ring-inset ring-surface-300 placeholder:text-surface-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6 dark:bg-surface-800 dark:text-white dark:ring-surface-700"
          placeholder="Search trips by number, origin, or destination..."
        />
      </div>
      <div className="flex items-center gap-2">
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="block w-full appearance-none rounded-md border-0 py-2 pl-3 pr-10 text-surface-900 ring-1 ring-inset ring-surface-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6 dark:bg-surface-800 dark:text-white dark:ring-surface-700"
          >
            <option value="">All Statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="DRIVER_ASSIGNED">Driver Assigned</option>
            <option value="VEHICLE_ASSIGNED">Vehicle Assigned</option>
            <option value="READY_FOR_DISPATCH">Ready</option>
            <option value="DISPATCHED">Dispatched</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <Filter className="h-4 w-4 text-surface-400" />
          </div>
        </div>
        <Button variant="outline" className="shrink-0">
          More Filters
        </Button>
      </div>
    </div>
  );
}
