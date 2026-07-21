import { useState } from 'react';
import { Search, Filter, Download, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { usePayments, usePaymentSummary, useRefundPayment } from '../../billing/hooks/usePayments';
import { PaymentStatus, PaymentMethod, Payment } from '../../billing/types';
import { format } from 'date-fns';

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

const statusVariant: Record<PaymentStatus, 'default' | 'success' | 'warning' | 'destructive' | 'secondary'> = {
  PENDING: 'warning',
  COMPLETED: 'success',
  FAILED: 'destructive',
  REFUNDED: 'secondary',
};

const methodLabels: Record<PaymentMethod, string> = {
  BANK_TRANSFER: 'Bank Transfer',
  CREDIT_CARD: 'Credit Card',
  CASH: 'Cash',
  CHECK: 'Check',
  DIGITAL_WALLET: 'Digital Wallet',
  CORPORATE_CARD: 'Corporate Card',
  FUEL_CARD: 'Fuel Card',
  UPI: 'UPI',
  OTHER: 'Other',
};

export default function PaymentsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const { data: summary, isLoading: summaryLoading } = usePaymentSummary();
  const { data: paymentsResp, isLoading: listLoading } = usePayments({
    search: search || undefined,
    paymentStatus: statusFilter || undefined,
  });

  const refundPayment = useRefundPayment();

  const handleExportCSV = () => {
    window.location.href = '/api/v1/payments/export/csv';
  };

  const handleRefund = async (paymentId: string) => {
    if (window.confirm('Are you sure you want to refund this payment? This action cannot be undone.')) {
      await refundPayment.mutateAsync(paymentId);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Payments</h1>
          <p className="text-sm text-surface-500 mt-1">Track and manage all incoming payments and refunds.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="flex items-center gap-2" onClick={handleExportCSV}>
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      {!summaryLoading && summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg">
                <ArrowDownRight className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-sm font-medium text-surface-500">Collected (MTD)</h3>
            </div>
            <p className="text-2xl font-bold text-surface-900 dark:text-white">{formatCurrency(summary.collectedMtd.amount)}</p>
            <p className="text-xs text-surface-400 mt-1">{summary.collectedMtd.count} payments</p>
          </div>
          
          <div className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-amber-50 dark:bg-amber-900/30 rounded-lg">
                <ArrowUpRight className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-sm font-medium text-surface-500">Pending</h3>
            </div>
            <p className="text-2xl font-bold text-surface-900 dark:text-white">{formatCurrency(summary.pending.amount)}</p>
            <p className="text-xs text-surface-400 mt-1">{summary.pending.count} payments</p>
          </div>

          <div className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-surface-100 dark:bg-surface-800 rounded-lg">
                <ArrowUpRight className="h-5 w-5 text-surface-500" />
              </div>
              <h3 className="text-sm font-medium text-surface-500">Refunded</h3>
            </div>
            <p className="text-2xl font-bold text-surface-900 dark:text-white">{formatCurrency(summary.refunded.amount)}</p>
            <p className="text-xs text-surface-400 mt-1">{summary.refunded.count} payments</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-surface-400" />
          <Input
            placeholder="Search by invoice or reference..."
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
            {Object.values(PaymentStatus).map((s) => (
              <option key={s} value={s}>{s.replace('_', ' ')}</option>
            ))}
          </select>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 overflow-hidden">
        {listLoading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-surface-50 dark:bg-surface-800/50">
                <tr>
                  <th className="px-6 py-4 font-semibold text-surface-900 dark:text-white">Payment #</th>
                  <th className="px-6 py-4 font-semibold text-surface-900 dark:text-white">Date</th>
                  <th className="px-6 py-4 font-semibold text-surface-900 dark:text-white">Invoice #</th>
                  <th className="px-6 py-4 font-semibold text-surface-900 dark:text-white">Customer</th>
                  <th className="px-6 py-4 font-semibold text-surface-900 dark:text-white">Method</th>
                  <th className="px-6 py-4 font-semibold text-surface-900 dark:text-white">Status</th>
                  <th className="px-6 py-4 font-semibold text-surface-900 dark:text-white text-right">Amount</th>
                  <th className="px-6 py-4 font-semibold text-surface-900 dark:text-white text-center">Receipt</th>
                  <th className="px-6 py-4 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-200 dark:divide-surface-800">
                {(paymentsResp?.data || []).map((payment: Payment) => (
                  <tr key={payment.id} className="hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-surface-900 dark:text-white">
                      {payment.paymentNumber}
                    </td>
                    <td className="px-6 py-4 text-surface-600 dark:text-surface-300">
                      {format(new Date(payment.paymentDate), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4 text-surface-600 dark:text-surface-300">
                      {payment.invoice?.invoiceNumber || '—'}
                    </td>
                    <td className="px-6 py-4 font-medium text-surface-900 dark:text-white truncate max-w-[150px]">
                      {payment.invoice?.customer?.name || '—'}
                    </td>
                    <td className="px-6 py-4 text-surface-600 dark:text-surface-300">
                      {methodLabels[payment.paymentMethod] || payment.paymentMethod}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={statusVariant[payment.paymentStatus]}>{payment.paymentStatus}</Badge>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-surface-900 dark:text-white">
                      {formatCurrency(payment.amount)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {payment.receiptUrl ? (
                        <a href={payment.receiptUrl} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline text-xs">
                          View Receipt
                        </a>
                      ) : (
                        <span className="text-surface-400 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {payment.paymentStatus === 'COMPLETED' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRefund(payment.id)}
                          className="text-xs h-8"
                        >
                          Refund
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
                {(paymentsResp?.data?.length === 0) && (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center text-surface-500">
                      No payments found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
