import { format } from 'date-fns';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { MapPin, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import type { Trip } from '../types';

const columnHelper = createColumnHelper<Trip>();

const statusColors: Record<string, 'default' | 'secondary' | 'success' | 'destructive' | 'warning' | 'outline'> = {
  DRAFT: 'secondary',
  SCHEDULED: 'outline',
  DRIVER_ASSIGNED: 'secondary',
  VEHICLE_ASSIGNED: 'secondary',
  READY_FOR_DISPATCH: 'primary' as any,
  DISPATCHED: 'warning',
  IN_PROGRESS: 'primary' as any,
  COMPLETED: 'success',
  CANCELLED: 'destructive',
  CLOSED: 'secondary',
  DELAYED: 'destructive',
};

interface TripTableProps {
  data: Trip[];
  isLoading: boolean;
  onView: (id: string) => void;
}

export function TripTable({ data, isLoading, onView }: TripTableProps) {
  const columns = [
    columnHelper.accessor('tripNumber', {
      header: 'Trip',
      cell: (info) => (
        <div className="font-medium text-surface-900 dark:text-white">
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => (
        <Badge variant={statusColors[info.getValue()] || 'default'}>
          {info.getValue().replace(/_/g, ' ')}
        </Badge>
      ),
    }),
    columnHelper.display({
      id: 'route',
      header: 'Route',
      cell: (info) => {
        const trip = info.row.original;
        return (
          <div className="flex flex-col gap-1 text-sm">
            <div className="flex items-center text-surface-700 dark:text-surface-300">
              <MapPin className="mr-1.5 h-3.5 w-3.5 text-surface-400" />
              <span className="truncate max-w-[150px]">{trip.origin}</span>
            </div>
            <div className="flex items-center text-surface-700 dark:text-surface-300">
              <Navigation className="mr-1.5 h-3.5 w-3.5 text-surface-400" />
              <span className="truncate max-w-[150px]">{trip.destination}</span>
            </div>
          </div>
        );
      },
    }),
    columnHelper.accessor('scheduledStart', {
      header: 'Scheduled',
      cell: (info) => (
        <div className="text-sm text-surface-500">
          {format(new Date(info.getValue()), 'MMM d, yyyy HH:mm')}
        </div>
      ),
    }),
    columnHelper.display({
      id: 'assignments',
      header: 'Assignments',
      cell: (info) => {
        const trip = info.row.original;
        return (
          <div className="flex flex-col gap-1 text-sm text-surface-600 dark:text-surface-400">
            <div>
              <span className="font-medium">Dr: </span>
              {trip.driver ? `${trip.driver.user.firstName} ${trip.driver.user.lastName}` : <span className="text-surface-400 italic">Unassigned</span>}
            </div>
            <div>
              <span className="font-medium">Veh: </span>
              {trip.vehicle ? trip.vehicle.plateNumber : <span className="text-surface-400 italic">Unassigned</span>}
            </div>
          </div>
        );
      },
    }),
    columnHelper.display({
      id: 'actions',
      cell: (info) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView(info.row.original.id)}
          >
            View Details
          </Button>
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-surface-900 rounded-lg shadow-sm border border-surface-200 dark:border-surface-800 p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-surface-900 rounded-lg shadow-sm border border-surface-200 dark:border-surface-800 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-surface-200 dark:divide-surface-800">
          <thead className="bg-surface-50 dark:bg-surface-800/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider whitespace-nowrap"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white dark:bg-surface-900 divide-y divide-surface-200 dark:divide-surface-800">
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-8 text-center text-surface-500">
                  No trips found matching the current filters.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-surface-50 dark:hover:bg-surface-800/50">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
