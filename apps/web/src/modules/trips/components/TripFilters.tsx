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
          className="block w-full rounded-[10px] border border-surface-700/50 bg-[#030712] py-2.5 pl-10 pr-3 text-white placeholder:text-surface-500 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-sm transition-colors"
          placeholder="Search trips by number, origin, or destination..."
        />
      </div>
      <div className="flex items-center gap-2">
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="block w-full appearance-none rounded-[10px] border border-surface-700/50 bg-[#030712] py-2.5 pl-3 pr-10 text-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-sm transition-colors"
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
