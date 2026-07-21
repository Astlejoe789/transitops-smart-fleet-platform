import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, User, Calendar, FileText,
  CreditCard, Clock, CheckCircle, XCircle, Send, AlertTriangle
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { 
  useInvoice, 
  useVoidInvoice, 
  useSubmitForApproval, 
  useApproveInvoice, 
  useSendInvoice 
} from '../hooks/useInvoices';
import { useRecordPayment } from '../hooks/usePayments';
import { RecordPaymentModal } from '../components/RecordPaymentModal';
import { InvoiceWorkflowTimeline } from '../components/InvoiceWorkflowTimeline';
import { InvoiceStatus, PaymentStatus, PaymentMethod } from '../types';

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

const paymentStatusVariant: Record<PaymentStatus, 'default' | 'success' | 'warning' | 'destructive' | 'secondary'> = {
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

type Tab = 'overview' | 'items' | 'payments';

export function InvoiceDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: invoice, isLoading } = useInvoice(id ?? '');
  const [tab, setTab] = useState<Tab>('overview');
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const voidInvoice = useVoidInvoice();
  const submitInvoice = useSubmitForApproval();
  const approveInvoice = useApproveInvoice();
  const sendInvoice = useSendInvoice();
  const recordPayment = useRecordPayment();

  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-semibold">Invoice not found</h2>
        <Link to="/billing" className="text-primary-600 hover:underline mt-2 inline-block">Back to Billing</Link>
      </div>
    );
  }

  const paidAmount = (invoice.payments ?? [])
    .filter((p) => p.paymentStatus === 'COMPLETED')
    .reduce((s, p) => s + p.amount, 0);
  const remainingAmount = invoice.totalAmount - paidAmount;

  const tabs: { key: Tab; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'items', label: `Line Items (${invoice.items?.length ?? 0})` },
    { key: 'payments', label: `Payments (${invoice.payments?.length ?? 0})` },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-4">
        <Link to="/billing" className="p-2 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-full transition-colors">
          <ArrowLeft className="h-5 w-5 text-surface-500" />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-surface-900 dark:text-white">{invoice.invoiceNumber}</h1>
            <Badge variant={statusVariant[invoice.status]}>{invoice.status.replace('_', ' ')}</Badge>
          </div>
          <p className="text-sm text-surface-500 mt-1">
            Customer: <span className="font-medium text-surface-700 dark:text-surface-300">{invoice.customer?.name ?? '—'}</span>
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            variant="outline"
            className="flex items-center gap-2 mr-2"
            onClick={() => window.print()}
          >
            <FileText className="h-4 w-4" />
            Print to PDF
          </Button>

          {invoice.status === 'DRAFT' && (
            <Button
              className="flex items-center gap-2"
              onClick={() => submitInvoice.mutate(invoice.id)}
              isLoading={submitInvoice.isPending}
            >
              <Send className="h-4 w-4" />
              Submit
            </Button>
          )}
          {invoice.status === 'PENDING_APPROVAL' && (
            <Button
              className="flex items-center gap-2"
              onClick={() => approveInvoice.mutate(invoice.id)}
              isLoading={approveInvoice.isPending}
            >
              <CheckCircle className="h-4 w-4" />
              Approve
            </Button>
          )}
          {invoice.status === 'APPROVED' && (
            <Button
              className="flex items-center gap-2"
              onClick={() => sendInvoice.mutate(invoice.id)}
              isLoading={sendInvoice.isPending}
            >
              <Send className="h-4 w-4" />
              Send
            </Button>
          )}
          {['ISSUED', 'PARTIALLY_PAID', 'SENT'].includes(invoice.status) && (
            <Button
              className="flex items-center gap-2"
              onClick={() => setIsPaymentOpen(true)}
            >
              <CreditCard className="h-4 w-4" />
              Record Payment
            </Button>
          )}
          {['DRAFT', 'ISSUED', 'PENDING_APPROVAL', 'APPROVED'].includes(invoice.status) && (
            <Button
              variant="outline"
              className="text-amber-600 border-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/30 flex items-center gap-2"
              onClick={() => voidInvoice.mutate(invoice.id)}
              isLoading={voidInvoice.isPending}
            >
              <XCircle className="h-4 w-4" />
              Void
            </Button>
          )}
        </div>
      </div>

      {/* Workflow Timeline */}
      <div className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 p-6 print:hidden">
        <h2 className="font-semibold text-surface-900 dark:text-white mb-4">Invoice Lifecycle</h2>
        <InvoiceWorkflowTimeline status={invoice.status} />
      </div>

      {/* Progress Bar (for partially/fully paid) */}
      {['ISSUED', 'SENT', 'PARTIALLY_PAID', 'PAID'].includes(invoice.status) && (
        <div className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 p-6">
          <div className="flex justify-between text-sm font-medium mb-2">
            <span className="text-surface-500">Payment Progress</span>
            <span>{((paidAmount / invoice.totalAmount) * 100).toFixed(1)}%</span>
          </div>
          <div className="h-3 bg-surface-100 dark:bg-surface-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (paidAmount / invoice.totalAmount) * 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span className="text-emerald-600 font-medium">Paid: {formatCurrency(paidAmount)}</span>
            <span className="text-surface-500">Remaining: {formatCurrency(Math.max(0, remainingAmount))}</span>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-surface-200 dark:border-surface-800">
        <div className="flex gap-6">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                tab === t.key
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-surface-500 hover:text-surface-900 dark:hover:text-surface-100'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {tab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 p-6 space-y-5">
            <h2 className="font-semibold text-surface-900 dark:text-white">Invoice Details</h2>
            {[
              { icon: User, label: 'Customer', value: invoice.customer?.name ?? '—' },
              { icon: Calendar, label: 'Issue Date', value: new Date(invoice.issueDate).toLocaleDateString() },
              { icon: Clock, label: 'Due Date', value: new Date(invoice.dueDate).toLocaleDateString() },
              { icon: FileText, label: 'Trip', value: invoice.trip?.tripNumber ?? 'N/A' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-3">
                <div className="p-2 bg-surface-50 dark:bg-surface-800 rounded-lg flex-shrink-0">
                  <Icon className="h-4 w-4 text-surface-500" />
                </div>
                <div>
                  <p className="text-xs text-surface-400">{label}</p>
                  <p className="text-sm font-medium mt-0.5">{value}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 p-6">
            <h2 className="font-semibold text-surface-900 dark:text-white mb-5">Financials</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm"><span className="text-surface-500">Subtotal</span><span>{formatCurrency(invoice.subtotal)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-surface-500">Tax</span><span>{formatCurrency(invoice.taxAmount)}</span></div>
              {(invoice.discountAmount ?? 0) > 0 && (
                <div className="flex justify-between text-sm text-emerald-600"><span className="text-surface-500">Discount</span><span>- {formatCurrency(invoice.discountAmount)}</span></div>
              )}
              <div className="flex justify-between text-base font-bold pt-3 border-t border-surface-200 dark:border-surface-700">
                <span>Total</span><span>{formatCurrency(invoice.totalAmount)}</span>
              </div>
              {paidAmount > 0 && (
                <>
                  <div className="flex justify-between text-sm text-emerald-600"><span>Paid</span><span>- {formatCurrency(paidAmount)}</span></div>
                  <div className="flex justify-between text-sm font-semibold"><span>Balance Due</span><span>{formatCurrency(Math.max(0, remainingAmount))}</span></div>
                </>
              )}
            </div>
            {invoice.notes && (
              <div className="mt-5 pt-5 border-t border-surface-200 dark:border-surface-700">
                <p className="text-xs text-surface-400 mb-1">Notes</p>
                <p className="text-sm text-surface-700 dark:text-surface-300">{invoice.notes}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'items' && (
        <div className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface-50 dark:bg-surface-800 text-surface-500 font-medium">
              <tr>
                <th className="px-6 py-4 text-left">Description</th>
                <th className="px-6 py-4 text-right">Qty</th>
                <th className="px-6 py-4 text-right">Unit Price</th>
                <th className="px-6 py-4 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-200 dark:divide-surface-700">
              {(invoice.items ?? []).map((item) => (
                <tr key={item.id} className="hover:bg-surface-50 dark:hover:bg-surface-800/50">
                  <td className="px-6 py-4">{item.description}</td>
                  <td className="px-6 py-4 text-right">{item.quantity}</td>
                  <td className="px-6 py-4 text-right">{formatCurrency(item.unitPrice)}</td>
                  <td className="px-6 py-4 text-right font-semibold">{formatCurrency(item.totalPrice)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="border-t-2 border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800">
              <tr>
                <td colSpan={3} className="px-6 py-4 font-semibold text-right">Total</td>
                <td className="px-6 py-4 font-bold text-right text-base">{formatCurrency(invoice.totalAmount)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      {tab === 'payments' && (
        <div className="space-y-4">
          {(invoice.payments ?? []).length === 0 ? (
            <div className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 p-12 text-center">
              <CreditCard className="h-12 w-12 text-surface-300 mx-auto mb-3" />
              <p className="text-surface-500">No payments recorded yet.</p>
              {['ISSUED', 'PARTIALLY_PAID'].includes(invoice.status) && (
                <Button className="mt-4 flex items-center gap-2 mx-auto" onClick={() => setIsPaymentOpen(true)}>
                  <CreditCard className="h-4 w-4" />
                  Record First Payment
                </Button>
              )}
            </div>
          ) : (
            invoice.payments?.map((payment) => (
              <div key={payment.id} className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 p-6 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${payment.paymentStatus === 'COMPLETED' ? 'bg-emerald-50 dark:bg-emerald-900/30' : 'bg-surface-100 dark:bg-surface-800'}`}>
                    {payment.paymentStatus === 'COMPLETED' ? (
                      <CheckCircle className="h-5 w-5 text-emerald-600" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-surface-500" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold">{payment.paymentNumber}</p>
                    <p className="text-sm text-surface-500 mt-0.5">
                      {methodLabels[payment.paymentMethod]} · {new Date(payment.paymentDate).toLocaleDateString()}
                      {payment.referenceNumber && ` · Ref: ${payment.referenceNumber}`}
                    </p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-lg font-bold">{formatCurrency(payment.amount)}</p>
                  <Badge variant={paymentStatusVariant[payment.paymentStatus]} className="mt-1">
                    {payment.paymentStatus}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Record Payment Modal */}
      <RecordPaymentModal
        isOpen={isPaymentOpen}
        invoice={invoice}
        onClose={() => setIsPaymentOpen(false)}
        onSubmit={async (data) => {
          await recordPayment.mutateAsync(data);
          setIsPaymentOpen(false);
        }}
        isLoading={recordPayment.isPending}
      />
    </div>
  );
}
