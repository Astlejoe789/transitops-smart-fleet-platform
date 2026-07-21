import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface MaintenanceFiltersProps {
  filters: any;
  onChange: (filters: any) => void;
}

export function MaintenanceFilters({ filters, onChange }: MaintenanceFiltersProps) {
  return (
    <div className="flex flex-col gap-4 p-4 bg-white dark:bg-surface-900 border-b border-surface-200 dark:border-surface-800">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" />
          <Input
            placeholder="Search by ID, Vehicle, Description..."
            value={filters.search || ''}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            className="pl-10"
          />
        </div>
        
        <select
          className="h-10 px-3 py-2 bg-white dark:bg-surface-950 border border-surface-200 dark:border-surface-800 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          value={filters.status || ''}
          onChange={(e) => onChange({ ...filters, status: e.target.value })}
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

        <select
          className="h-10 px-3 py-2 bg-white dark:bg-surface-950 border border-surface-200 dark:border-surface-800 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          value={filters.type || ''}
          onChange={(e) => onChange({ ...filters, type: e.target.value })}
        >
          <option value="">All Types</option>
          <option value="PREVENTIVE">Preventive</option>
          <option value="CORRECTIVE">Corrective</option>
          <option value="EMERGENCY">Emergency</option>
          <option value="INSPECTION">Inspection</option>
          <option value="WARRANTY">Warranty</option>
        </select>

        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          More Filters
        </Button>
      </div>
    </div>
  );
}
