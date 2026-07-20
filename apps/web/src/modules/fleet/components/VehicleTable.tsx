import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Eye, Edit, Trash2 } from 'lucide-react';
import type { Vehicle } from '../hooks/useFleet';

interface VehicleTableProps {
  data: Vehicle[];
  isLoading: boolean;
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (vehicle: Vehicle) => void;
}

export function VehicleTable({ data, isLoading, onEdit, onDelete }: VehicleTableProps) {
  const navigate = useNavigate();

  const columns = useMemo<ColumnDef<Vehicle>[]>(
    () => [
      {
        accessorKey: 'plateNumber',
        header: 'Plate Number',
        cell: ({ row }) => (
          <div className="font-semibold text-surface-900 dark:text-white">
            {row.original.plateNumber}
          </div>
        ),
      },
      {
        accessorKey: 'vin',
        header: 'VIN',
        cell: ({ row }) => (
          <div className="text-surface-500 font-mono text-xs dark:text-surface-400">
            {row.original.vin}
          </div>
        ),
      },
      {
        id: 'makeModel',
        header: 'Make & Model',
        accessorFn: (row) => `${row.make} ${row.model}`,
        cell: ({ row }) => (
          <div>
            <div className="font-medium text-surface-900 dark:text-surface-100">
              {row.original.make} {row.original.model}
            </div>
            <div className="text-xs text-surface-500 dark:text-surface-400">
              {row.original.year} • {row.original.color || 'N/A'}
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const status = row.original.status;
          let variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' = 'default';
          
          if (status === 'AVAILABLE') variant = 'success';
          else if (status === 'IN_TRANSIT') variant = 'secondary';
          else if (status === 'MAINTENANCE') variant = 'warning';
          else if (status === 'OUT_OF_SERVICE') variant = 'destructive';

          return (
            <Badge variant={variant}>
              {status.replace('_', ' ')}
            </Badge>
          );
        },
      },
      {
        accessorKey: 'currentOdometer',
        header: 'Odometer',
        cell: ({ row }) => (
          <div className="text-surface-600 dark:text-surface-300">
            {row.original.currentOdometer.toLocaleString()} km
          </div>
        ),
      },
      {
        id: 'actions',
        cell: ({ row }) => (
          <div className="flex items-center justify-end space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(`/fleet/${row.original.id}`)}
              title="View Details"
            >
              <Eye className="h-4 w-4 text-surface-500" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(row.original)}
              title="Edit Vehicle"
            >
              <Edit className="h-4 w-4 text-blue-500" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(row.original)}
              title="Delete Vehicle"
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        ),
      },
    ],
    [navigate, onEdit, onDelete]
  );

  if (isLoading) {
    return (
      <div className="rounded-md border border-surface-200 p-8 text-center dark:border-surface-800">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
        <p className="mt-4 text-sm text-surface-500">Loading vehicles...</p>
      </div>
    );
  }

  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey="plateNumber"
      searchPlaceholder="Search by plate number..."
    />
  );
}
