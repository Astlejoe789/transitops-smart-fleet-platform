import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  RowSelectionState,
} from '@tanstack/react-table';
import {
  Eye,
  Edit,
  Trash2,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Download,
  UserCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { format, differenceInDays } from 'date-fns';
import type { Driver, DriverStatus } from '../types';

interface DriverTableProps {
  data: Driver[];
  isLoading: boolean;
  total: number;
  page: number;
  limit: number;
  onEdit: (driver: Driver) => void;
  onDelete: (driver: Driver) => void;
  onPageChange: (page: number) => void;
  onBulkDelete: (ids: string[]) => void;
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: DriverStatus }) {
  const config: Record<DriverStatus, { variant: any; label: string }> = {
    AVAILABLE: { variant: 'success', label: 'Available' },
    ON_TRIP: { variant: 'default', label: 'On Trip' },
    ON_LEAVE: { variant: 'warning', label: 'On Leave' },
    SUSPENDED: { variant: 'destructive', label: 'Suspended' },
    TERMINATED: { variant: 'outline', label: 'Terminated' },
  };
  const { variant, label } = config[status] ?? { variant: 'secondary', label: status };
  return <Badge variant={variant}>{label}</Badge>;
}

// ─── License Expiry Badge ─────────────────────────────────────────────────────
function LicenseExpiryBadge({ expiryDate }: { expiryDate: string }) {
  const daysLeft = differenceInDays(new Date(expiryDate), new Date());
  const formattedDate = format(new Date(expiryDate), 'MMM dd, yyyy');

  if (daysLeft < 0) {
    return (
      <div>
        <Badge variant="destructive">Expired</Badge>
        <p className="mt-0.5 text-xs text-surface-500">{formattedDate}</p>
      </div>
    );
  }
  if (daysLeft <= 30) {
    return (
      <div>
        <Badge variant="warning">{daysLeft}d left</Badge>
        <p className="mt-0.5 text-xs text-surface-500">{formattedDate}</p>
      </div>
    );
  }
  return (
    <div>
      <span className="text-sm text-surface-700 dark:text-surface-300">{formattedDate}</span>
    </div>
  );
}

// ─── Avatar Cell ──────────────────────────────────────────────────────────────
function DriverAvatar({ driver }: { driver: Driver }) {
  const initials =
    `${driver.user?.firstName?.[0] ?? ''}${driver.user?.lastName?.[0] ?? ''}`.toUpperCase();
  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        {driver.photoUrl ? (
          <img
            src={driver.photoUrl}
            alt={`${driver.user?.firstName} ${driver.user?.lastName}`}
            className="h-9 w-9 rounded-full object-cover ring-2 ring-surface-200 dark:ring-surface-700"
          />
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-sm font-semibold text-white ring-2 ring-surface-200 dark:ring-surface-700">
            {initials || '?'}
          </div>
        )}
        <span
          className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white dark:border-surface-900 ${
            driver.status === 'AVAILABLE'
              ? 'bg-emerald-500'
              : driver.status === 'ON_TRIP'
                ? 'bg-blue-500'
                : driver.status === 'SUSPENDED'
                  ? 'bg-red-500'
                  : 'bg-surface-400'
          }`}
        />
      </div>
      <div className="min-w-0">
        <div className="truncate font-semibold text-surface-900 dark:text-white">
          {driver.user?.firstName} {driver.user?.lastName}
        </div>
        <div className="text-xs text-surface-500 dark:text-surface-400">{driver.employeeId}</div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function DriverTable({
  data,
  isLoading,
  total,
  page,
  limit,
  onEdit,
  onDelete,
  onPageChange,
  onBulkDelete,
}: DriverTableProps) {
  const navigate = useNavigate();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const totalPages = Math.ceil(total / limit);
  const selectedIds = Object.keys(rowSelection)
    .filter((k) => rowSelection[k])
    .map((idx) => data[Number(idx)]?.id)
    .filter(Boolean) as string[];

  const columns = useMemo<ColumnDef<Driver>[]>(
    () => [
      // Checkbox
      {
        id: 'select',
        header: ({ table }) => (
          <input
            type="checkbox"
            checked={table.getIsAllPageRowsSelected()}
            onChange={table.getToggleAllPageRowsSelectedHandler()}
            className="h-4 w-4 rounded border-surface-300 text-primary-600 focus:ring-primary-500"
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
            className="h-4 w-4 rounded border-surface-300 text-primary-600 focus:ring-primary-500"
          />
        ),
        size: 48,
        enableSorting: false,
      },
      // Driver Name
      {
        id: 'name',
        header: 'Driver',
        accessorFn: (row) => `${row.user?.firstName} ${row.user?.lastName}`,
        cell: ({ row }) => <DriverAvatar driver={row.original} />,
      },
      // Status
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      // License
      {
        id: 'license',
        header: 'License',
        cell: ({ row }) => (
          <div>
            <div className="font-mono text-sm font-medium text-surface-800 dark:text-surface-200">
              {row.original.licenseNumber}
            </div>
            <div className="text-xs text-surface-500">
              {row.original.licenseCategory?.replace('_', ' ')}
            </div>
          </div>
        ),
      },
      // License Expiry
      {
        accessorKey: 'licenseExpiry',
        header: 'License Expiry',
        cell: ({ row }) => <LicenseExpiryBadge expiryDate={row.original.licenseExpiry} />,
      },
      // Phone
      {
        accessorKey: 'phone',
        header: 'Phone',
        cell: ({ row }) => (
          <span className="text-sm text-surface-600 dark:text-surface-400">
            {row.original.phone || row.original.user?.email || '-'}
          </span>
        ),
      },
      // Branch
      {
        id: 'branch',
        header: 'Branch',
        cell: ({ row }) => (
          <span className="text-sm text-surface-600 dark:text-surface-400">
            {row.original.branch?.name || '-'}
          </span>
        ),
      },
      // Assigned Vehicle
      {
        id: 'vehicle',
        header: 'Vehicle',
        cell: ({ row }) =>
          row.original.assignedVehicle ? (
            <div className="flex items-center gap-1.5">
              <UserCheck className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-sm font-medium text-surface-800 dark:text-surface-200">
                {row.original.assignedVehicle.plateNumber}
              </span>
            </div>
          ) : (
            <span className="text-sm text-surface-400">Unassigned</span>
          ),
      },
      // Actions
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(`/drivers/${row.original.id}`)}
              title="View Details"
              id={`driver-view-${row.original.id}`}
            >
              <Eye className="h-4 w-4 text-surface-500" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(row.original)}
              title="Edit Driver"
              id={`driver-edit-${row.original.id}`}
            >
              <Edit className="h-4 w-4 text-blue-500" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(row.original)}
              title="Delete Driver"
              id={`driver-delete-${row.original.id}`}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        ),
        enableSorting: false,
      },
    ],
    [navigate, onEdit, onDelete],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    state: { sorting, rowSelection },
    manualPagination: true,
  });

  // ─── Loading Skeleton ───────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="space-y-3 rounded-xl border border-surface-200 bg-white p-6 dark:border-surface-800 dark:bg-surface-900">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="h-9 w-9 animate-pulse rounded-full bg-surface-200 dark:bg-surface-700" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3.5 w-40 animate-pulse rounded bg-surface-200 dark:bg-surface-700" />
              <div className="h-3 w-24 animate-pulse rounded bg-surface-100 dark:bg-surface-800" />
            </div>
            <div className="h-6 w-20 animate-pulse rounded-full bg-surface-200 dark:bg-surface-700" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-surface-200 bg-white shadow-sm dark:border-surface-800 dark:bg-surface-900">
      {/* Bulk Actions Bar */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between border-b border-surface-200 bg-primary-50 px-4 py-2.5 dark:border-surface-700 dark:bg-primary-950/30">
          <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
            {selectedIds.length} driver{selectedIds.length > 1 ? 's' : ''} selected
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Export selected as CSV
                const csv = data
                  .filter((d) => selectedIds.includes(d.id))
                  .map((d) =>
                    [
                      d.employeeId,
                      `${d.user?.firstName} ${d.user?.lastName}`,
                      d.user?.email,
                      d.phone,
                      d.licenseNumber,
                      d.status,
                    ].join(','),
                  )
                  .join('\n');
                const blob = new Blob([`EmployeeID,Name,Email,Phone,License,Status\n${csv}`], {
                  type: 'text/csv',
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'drivers.csv';
                a.click();
              }}
            >
              <Download className="mr-1.5 h-3.5 w-3.5" />
              Export
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                onBulkDelete(selectedIds);
                setRowSelection({});
              }}
            >
              <Trash2 className="mr-1.5 h-3.5 w-3.5" />
              Delete ({selectedIds.length})
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-surface-200 bg-surface-50 dark:border-surface-800 dark:bg-surface-800/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="h-11 px-4 text-left align-middle text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400"
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={
                          header.column.getCanSort()
                            ? 'flex cursor-pointer select-none items-center gap-1 hover:text-surface-900 dark:hover:text-surface-100'
                            : ''
                        }
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() && (
                          <span>
                            {
                              {
                                asc: <ChevronUp className="h-3.5 w-3.5" />,
                                desc: <ChevronDown className="h-3.5 w-3.5" />,
                              }[header.column.getIsSorted() as string] ?? (
                                <ChevronsUpDown className="h-3.5 w-3.5 text-surface-300 dark:text-surface-600" />
                              )
                            }
                          </span>
                        )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-surface-100 dark:divide-surface-800">
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="transition-colors hover:bg-surface-50 dark:hover:bg-surface-800/50"
                  data-state={row.getIsSelected() ? 'selected' : undefined}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 align-middle">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-100 dark:bg-surface-800">
                      <UserCheck className="h-6 w-6 text-surface-400" />
                    </div>
                    <p className="font-medium text-surface-700 dark:text-surface-300">No drivers found</p>
                    <p className="text-sm text-surface-500">
                      Try adjusting your search or filter criteria
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-surface-200 px-4 py-3 dark:border-surface-800">
          <p className="text-sm text-surface-500">
            Showing <span className="font-medium">{(page - 1) * limit + 1}</span>–
            <span className="font-medium">{Math.min(page * limit, total)}</span> of{' '}
            <span className="font-medium">{total}</span> drivers
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
            >
              Previous
            </Button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <Button
                  key={pageNum}
                  variant={page === pageNum ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onPageChange(pageNum)}
                  className="h-8 w-8 p-0"
                >
                  {pageNum}
                </Button>
              );
            })}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
