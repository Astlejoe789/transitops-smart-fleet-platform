import { format } from 'date-fns';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { FileText, Edit2, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import type { Expense } from '../types';
import { ExpenseStatus } from '../types';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '@/lib/utils';

interface ExpensesTableProps {
  data: Expense[];
  isLoading: boolean;
  onEdit: (expense: Expense) => void;
}

const columnHelper = createColumnHelper<Expense>();

const statusColors: Record<ExpenseStatus, 'default' | 'success' | 'warning' | 'destructive' | 'secondary'> = {
  DRAFT: 'secondary',
  SUBMITTED: 'warning',
  APPROVED: 'success',
  REJECTED: 'destructive',
  PAID: 'success'
};

const statusIcons = {
  DRAFT: <Edit2 className="w-3 h-3 mr-1" />,
  SUBMITTED: <Clock className="w-3 h-3 mr-1" />,
  APPROVED: <CheckCircle className="w-3 h-3 mr-1" />,
  REJECTED: <XCircle className="w-3 h-3 mr-1" />,
  PAID: <CheckCircle className="w-3 h-3 mr-1" />,
};

export function ExpensesTable({ data, isLoading, onEdit }: ExpensesTableProps) {
  const navigate = useNavigate();

  const columns = [
    columnHelper.accessor('expenseNumber', {
      header: 'Expense ID',
      cell: (info) => (
        <span className="font-medium text-surface-900 dark:text-white">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor('category', {
      header: 'Category',
      cell: (info) => (
        <span className="font-medium capitalize">{info.getValue().replace(/_/g, ' ').toLowerCase()}</span>
      ),
    }),
    columnHelper.accessor('amount', {
      header: 'Amount',
      cell: (info) => (
        <span className="font-medium">{formatCurrency(info.getValue())}</span>
      ),
    }),
    columnHelper.accessor('expenseDate', {
      header: 'Date',
      cell: (info) => (
        <span className="text-surface-600 dark:text-surface-400">
          {format(new Date(info.getValue()), 'MMM d, yyyy')}
        </span>
      ),
    }),
    columnHelper.accessor('vendorName', {
      header: 'Vendor',
      cell: (info) => (
        <span className="text-surface-600 dark:text-surface-400">
          {info.getValue() || '-'}
        </span>
      ),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => {
        const status = info.getValue();
        return (
          <Badge variant={statusColors[status]} className="flex items-center w-max">
            {statusIcons[status]}
            {status}
          </Badge>
        );
      },
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
            <Edit2 className="w-4 h-4 text-surface-500" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/expenses/${info.row.original.id}`)}
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
    return (
      <div className="p-8 text-center border rounded-xl border-surface-200 dark:border-surface-800">
        <div className="w-8 h-8 mx-auto border-4 rounded-full border-primary-500 border-t-transparent animate-spin" />
        <p className="mt-4 text-surface-500">Loading expenses...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="p-12 text-center bg-white border border-dashed rounded-xl border-surface-300 dark:border-surface-700 dark:bg-surface-900">
        <div className="flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-surface-100 dark:bg-surface-800">
          <FileText className="w-6 h-6 text-surface-400" />
        </div>
        <h3 className="mt-4 text-lg font-medium text-surface-900 dark:text-white">No expenses found</h3>
        <p className="mt-1 text-surface-500">Get started by creating a new expense entry.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white border border-surface-200 dark:border-surface-800 dark:bg-surface-900 rounded-xl">
      <table className="w-full text-sm text-left">
        <thead className="bg-surface-50 dark:bg-surface-800/50 text-surface-500 dark:text-surface-400">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="px-6 py-4 font-medium border-b border-surface-200 dark:border-surface-800">
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-surface-200 dark:divide-surface-800">
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="transition-colors hover:bg-surface-50 dark:hover:bg-surface-800/50"
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-6 py-4">
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
