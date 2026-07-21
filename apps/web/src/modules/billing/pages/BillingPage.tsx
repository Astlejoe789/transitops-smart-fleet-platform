import { useState } from 'react';
import { Plus, Search, Filter, Download } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { InvoicesDashboardCards } from '../components/InvoicesDashboardCards';
import { InvoicesTable } from '../components/InvoicesTable';
import { InvoiceFormModal } from '../components/InvoiceFormModal';
import { RecordPaymentModal } from '../components/RecordPaymentModal';
import {
  useInvoiceSummary,
  useInvoices,
  useCreateInvoice,
  useIssueInvoice,
  useVoidInvoice,
  useDeleteInvoice,
} from '../hooks/useInvoices';
import { useRecordPayment } from '../hooks/usePayments';
import { Invoice, InvoiceStatus } from '../types';

export function BillingPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const { data: summary, isLoading: summaryLoading } = useInvoiceSummary();
  const { data: invoicesResp, isLoading: listLoading } = useInvoices({
    search: search || undefined,
    status: statusFilter || undefined,
  });

  const createInvoice = useCreateInvoice();
  const issueInvoice = useIssueInvoice();
  const voidInvoice = useVoidInvoice();
  const deleteInvoice = useDeleteInvoice();
  const recordPayment = useRecordPayment();

  const handleCreate = async (data: any) => {
    await createInvoice.mutateAsync(data);
    setIsCreateOpen(false);
  };

  const handleIssue = async (invoice: Invoice) => {
    if (window.confirm(`Issue invoice ${invoice.invoiceNumber} to the customer?`)) {
      await issueInvoice.mutateAsync(invoice.id);
    }
  };

  const handleVoid = async (invoice: Invoice) => {
    if (window.confirm(`Are you sure you want to void invoice ${invoice.invoiceNumber}?`)) {
      await voidInvoice.mutateAsync(invoice.id);
    }
  };

  const handleDelete = async (invoice: Invoice) => {
    if (window.confirm(`Permanently delete invoice ${invoice.invoiceNumber}?`)) {
      await deleteInvoice.mutateAsync(invoice.id);
    }
  };


  const handleRecordPayment = async (data: any) => {
    await recordPayment.mutateAsync(data);
    setIsPaymentOpen(false);
    setSelectedInvoice(null);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Billing & Payments</h1>
          <p className="text-sm text-surface-500 mt-1">Create invoices, track payments, and manage receivables</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button className="flex items-center gap-2" onClick={() => setIsCreateOpen(true)}>
            <Plus className="h-4 w-4" />
            New Invoice
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <InvoicesDashboardCards summary={summary} isLoading={summaryLoading} />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-surface-400" />
          <Input
            placeholder="Search invoices..."
            className="pl-10 w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 rounded-md border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Statuses</option>
            {Object.values(InvoiceStatus).map((s) => (
              <option key={s} value={s}>{s.replace('_', ' ')}</option>
            ))}
          </select>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      {/* Invoices Table */}
      {listLoading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
        </div>
      ) : (
        <InvoicesTable
          data={invoicesResp?.data ?? []}
          onIssue={handleIssue}
          onVoid={handleVoid}
          onDelete={handleDelete}
        />
      )}

      {/* Modals */}
      <InvoiceFormModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreate}
        isLoading={createInvoice.isPending}
      />
      <RecordPaymentModal
        isOpen={isPaymentOpen}
        invoice={selectedInvoice}
        onClose={() => { setIsPaymentOpen(false); setSelectedInvoice(null); }}
        onSubmit={handleRecordPayment}
        isLoading={recordPayment.isPending}
      />
    </div>
  );
}
