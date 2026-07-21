import { useMemo } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from '@tanstack/react-table';
import { Eye, Send, Ban, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Invoice, InvoiceStatus } from '../types';

const columnHelper = createColumnHelper<Invoice>();

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(n);
}

const statusVariant: Record<InvoiceStatus, 'default' | 'success' | 'warning' | 'destructive' | 'secondary' | 'outline'> = {
  DRAFT: 'secondary',
  PENDING_APPROVAL: 'warning',
  APPROVED: 'default',
  ISSUED: 'default',
  SENT: 'default',
  PARTIALLY_PAID: 'warning',
  PAID: 'success',
  OVERDUE: 'destructive',
  VOID: 'outline',
  CANCELLED: 'outline',
};

interface InvoicesTableProps {
  data: Invoice[];
  onIssue: (invoice: Invoice) => void;
  onVoid: (invoice: Invoice) => void;
  onDelete: (invoice: Invoice) => void;
}

export function InvoicesTable({ data, onIssue, onVoid, onDelete }: InvoicesTableProps) {
  const columns = useMemo(() => [
    columnHelper.accessor('invoiceNumber', {
      header: 'Invoice #',
      cell: (info) => (
        <Link to={`/billing/${info.row.original.id}`} className="font-mono text-sm text-primary-600 hover:underline font-medium">
          {info.getValue()}
        </Link>
      ),
    }),
    columnHelper.accessor('customer', {
      header: 'Customer',
      cell: (info) => (
        <span className="font-medium">{info.getValue()?.name ?? '—'}</span>
      ),
    }),
    columnHelper.accessor('issueDate', {
      header: 'Issue Date',
      cell: (info) => new Date(info.getValue()).toLocaleDateString(),
    }),
    columnHelper.accessor('dueDate', {
      header: 'Due Date',
      cell: (info) => {
        const due = new Date(info.getValue());
        const isOverdue = due < new Date() && !['PAID', 'VOID', 'CANCELLED'].includes(info.row.original.status);
        return (
          <span className={isOverdue ? 'text-red-500 font-medium' : ''}>
            {due.toLocaleDateString()}
          </span>
        );
      },
    }),
    columnHelper.accessor('totalAmount', {
      header: 'Amount',
      cell: (info) => <span className="font-semibold">{formatCurrency(info.getValue())}</span>,
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => (
        <Badge variant={statusVariant[info.getValue()] ?? 'default'}>
          {info.getValue().replace('_', ' ')}
        </Badge>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      cell: (info) => {
        const inv = info.row.original;
        return (
          <div className="flex items-center justify-end gap-1">
            <Link
              to={`/billing/${inv.id}`}
              className="p-2 text-surface-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg transition-colors"
              title="View"
            >
              <Eye className="h-4 w-4" />
            </Link>
            {inv.status === 'DRAFT' && (
              <button
                onClick={() => onIssue(inv)}
                className="p-2 text-surface-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                title="Issue Invoice"
              >
                <Send className="h-4 w-4" />
              </button>
            )}
            {['DRAFT', 'ISSUED'].includes(inv.status) && (
              <button
                onClick={() => onVoid(inv)}
                className="p-2 text-surface-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30 rounded-lg transition-colors"
                title="Void"
              >
                <Ban className="h-4 w-4" />
              </button>
            )}
            {['DRAFT', 'VOID', 'CANCELLED'].includes(inv.status) && (
              <button
                onClick={() => onDelete(inv)}
                className="p-2 text-surface-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        );
      },
    }),
  ], [onIssue, onVoid, onDelete]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 12 } },
  });

  return (
    <div className="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-surface-50 dark:bg-surface-800/50 text-surface-500 dark:text-surface-400 font-medium border-b border-surface-200 dark:border-surface-800">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((h) => (
                  <th key={h.id} className="px-6 py-4 whitespace-nowrap">
                    {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
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
                <td colSpan={columns.length} className="px-6 py-12 text-center text-surface-400">
                  No invoices found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {data.length > 0 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-surface-200 dark:border-surface-800 text-sm">
          <span className="text-surface-500">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-3 py-1.5 rounded-lg border border-surface-200 dark:border-surface-700 disabled:opacity-40 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-3 py-1.5 rounded-lg border border-surface-200 dark:border-surface-700 disabled:opacity-40 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
