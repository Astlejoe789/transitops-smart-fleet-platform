import { format } from 'date-fns';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Wrench, FileText, Settings } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import type { MaintenanceLog } from '../types';
import { useNavigate } from 'react-router-dom';

interface MaintenanceTableProps {
  data: MaintenanceLog[];
  isLoading: boolean;
  onEdit: (log: MaintenanceLog) => void;
}

const columnHelper = createColumnHelper<MaintenanceLog>();

export function MaintenanceTable({ data, isLoading, onEdit }: MaintenanceTableProps) {
  const navigate = useNavigate();

  const columns = [
    columnHelper.accessor('maintenanceId', {
      header: 'ID',
      cell: (info) => (
        <span className="font-medium text-surface-900 dark:text-white">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor('vehicle.plateNumber', {
      header: 'Vehicle',
      cell: (info) => (
        <div className="flex flex-col">
          <span className="font-medium text-surface-900 dark:text-white">{info.getValue()}</span>
          <span className="text-xs text-surface-500">{info.row.original.vehicle?.make} {info.row.original.vehicle?.model}</span>
        </div>
      ),
    }),
    columnHelper.accessor('maintenanceType', {
      header: 'Type',
      cell: (info) => {
        const type = info.getValue();
        return (
          <Badge variant={type === 'EMERGENCY' ? 'destructive' : 'secondary'}>
            {type.replace(/_/g, ' ')}
          </Badge>
        );
      },
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => {
        const status = info.getValue();
        return (
          <Badge variant={
            status === 'COMPLETED' || status === 'VERIFIED' ? 'success' :
            status === 'IN_PROGRESS' ? 'default' :
            status === 'WAITING_FOR_PARTS' ? 'warning' : 'secondary'
          }>
            {status.replace(/_/g, ' ')}
          </Badge>
        );
      },
    }),
    columnHelper.accessor('priority', {
      header: 'Priority',
      cell: (info) => {
        const p = info.getValue();
        return (
          <Badge variant={p === 'CRITICAL' || p === 'HIGH' ? 'destructive' : 'outline'}>
            {p}
          </Badge>
        );
      },
    }),
    columnHelper.accessor('scheduledDate', {
      header: 'Scheduled',
      cell: (info) => (
        <span className="text-surface-600 dark:text-surface-400">
          {format(new Date(info.getValue()), 'MMM d, yyyy')}
        </span>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: (info) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(info.row.original)}
            title="Edit"
          >
            <Settings className="w-4 h-4 text-surface-500" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/maintenance/${info.row.original.id}`)}
            title="View Details"
          >
            <FileText className="w-4 h-4 text-surface-500" />
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
    return <div className="p-8 text-center text-surface-500">Loading maintenance records...</div>;
  }

  if (data.length === 0) {
    return (
      <div className="p-8 text-center border border-dashed rounded-lg border-surface-200 dark:border-surface-700 m-4">
        <Wrench className="w-8 h-8 mx-auto mb-3 text-surface-400" />
        <h3 className="text-sm font-medium text-surface-900 dark:text-white">No maintenance records found</h3>
        <p className="mt-1 text-sm text-surface-500">
          Get started by scheduling a new maintenance service.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs uppercase bg-surface-50 dark:bg-surface-800/50 text-surface-500 dark:text-surface-400">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="px-4 py-3 font-medium">
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-surface-200 dark:divide-surface-800">
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors"
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-3">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
