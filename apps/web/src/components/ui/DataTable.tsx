import { useState } from 'react';
import type {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  VisibilityState} from '@tanstack/react-table';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel
} from '@tanstack/react-table';
import { ChevronDown, ChevronUp, ChevronsUpDown, Search, FileText } from 'lucide-react';
import { Input } from './Input';
import { Button } from './Button';
import { EmptyState } from './EmptyState';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
  searchPlaceholder?: string;
  emptyStateIcon?: any;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
  emptyStateAction?: { label: string; onClick: () => void };
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder = 'Search...',
  emptyStateIcon = FileText,
  emptyStateTitle = 'No results found',
  emptyStateDescription = 'There are no records matching your criteria.',
  emptyStateAction
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div>
      <div className="flex items-center py-4">
        {searchKey && (
          <div className="relative max-w-sm">
            <Search className="absolute left-2.5 top-3 h-4 w-4 text-surface-500" />
            <Input
              placeholder={searchPlaceholder}
              value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ''}
              onChange={(event) =>
                table.getColumn(searchKey)?.setFilterValue(event.target.value)
              }
              className="pl-9"
            />
          </div>
        )}
      </div>
      <div className="rounded-[var(--radius-xl)] border border-surface-800 bg-surface-900 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[length:var(--text-table-cell)]">
            <thead className="bg-surface-800/50 text-[length:var(--text-table-head)] uppercase tracking-wider text-surface-400 border-b border-surface-800">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <th key={header.id} className="h-12 px-4 align-middle font-semibold whitespace-nowrap">
                        {header.isPlaceholder ? null : (
                          <div 
                            className={header.column.getCanSort() ? 'cursor-pointer select-none flex items-center gap-1 hover:text-white transition-colors' : ''}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {header.column.getCanSort() && (
                              <span className="w-4">
                                {{
                                  asc: <ChevronUp className="h-4 w-4" />,
                                  desc: <ChevronDown className="h-4 w-4" />,
                                }[header.column.getIsSorted() as string] ?? (
                                  <ChevronsUpDown className="h-4 w-4 text-surface-600" />
                                )}
                              </span>
                            )}
                          </div>
                        )}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="h-14 border-b border-surface-800 transition-colors hover:bg-surface-850 data-[state=selected]:bg-surface-850 last:border-0"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="p-4 align-middle text-surface-300">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="p-8">
                    <EmptyState
                      icon={emptyStateIcon}
                      title={emptyStateTitle}
                      description={emptyStateDescription}
                      action={emptyStateAction}
                      compact
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex items-center justify-between py-4">
        <div className="text-[length:var(--text-body-sm)] text-surface-500">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
