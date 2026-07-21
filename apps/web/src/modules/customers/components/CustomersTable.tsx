import { useMemo } from 'react';
import { 
  createColumnHelper, 
  flexRender, 
  getCoreRowModel, 
  useReactTable, 
  getPaginationRowModel 
} from '@tanstack/react-table';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Customer, CustomerStatus } from '../types';

const columnHelper = createColumnHelper<Customer>();

const statusColors: Record<CustomerStatus, 'default' | 'success' | 'warning' | 'destructive' | 'secondary'> = {
  ACTIVE: 'success',
  INACTIVE: 'secondary',
  LEAD: 'warning',
  CHURNED: 'destructive',
};

interface CustomersTableProps {
  data: Customer[];
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
}

export function CustomersTable({ data, onEdit, onDelete }: CustomersTableProps) {
  const columns = useMemo(() => [
    columnHelper.accessor('customerNumber', {
      header: 'ID',
      cell: (info) => (
        <span className="font-mono text-sm text-surface-500">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor('name', {
      header: 'Customer Name',
      cell: (info) => (
        <div className="font-medium text-surface-900 dark:text-surface-50">
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor('type', {
      header: 'Type',
      cell: (info) => (
        <Badge variant="outline" className="capitalize">
          {info.getValue().toLowerCase()}
        </Badge>
      ),
    }),
    columnHelper.accessor('email', {
      header: 'Email',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('phone', {
      header: 'Phone',
      cell: (info) => info.getValue() || '-',
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => (
        <Badge variant={statusColors[info.getValue()] || 'default'}>
          {info.getValue()}
        </Badge>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      cell: (info) => (
        <div className="flex items-center justify-end gap-2">
          <Link
            to={`/customers/${info.row.original.id}`}
            className="p-2 text-surface-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/50 rounded-lg transition-colors"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </Link>
          <button
            onClick={() => onEdit(info.row.original)}
            className="p-2 text-surface-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/50 rounded-lg transition-colors"
            title="Edit Customer"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(info.row.original)}
            className="p-2 text-surface-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/50 rounded-lg transition-colors"
            title="Delete Customer"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    }),
  ], [onEdit, onDelete]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-surface-50 dark:bg-surface-800/50 text-surface-500 dark:text-surface-400 font-medium border-b border-surface-200 dark:border-surface-800">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-6 py-4 whitespace-nowrap">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-surface-200 dark:divide-surface-800 text-surface-700 dark:text-surface-300">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-6 py-8 text-center text-surface-500">
                  No customers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {data.length > 0 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-900/50">
          <div className="text-sm text-surface-500">
            Showing {table.getRowModel().rows.length} of {data.length} results
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="p-2 rounded-lg border border-surface-200 dark:border-surface-700 disabled:opacity-50 hover:bg-surface-100 dark:hover:bg-surface-800"
            >
              Previous
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="p-2 rounded-lg border border-surface-200 dark:border-surface-700 disabled:opacity-50 hover:bg-surface-100 dark:hover:bg-surface-800"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
