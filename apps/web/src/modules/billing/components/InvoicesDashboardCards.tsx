import { DollarSign, AlertCircle, TrendingUp, FileText } from 'lucide-react';
import { InvoiceSummary } from '../types';

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);
}

interface InvoicesDashboardCardsProps {
  summary?: InvoiceSummary;
  isLoading?: boolean;
}

const KpiCard = ({
  icon: Icon,
  label,
  amount,
  count,
  colorClass,
  bgClass,
}: {
  icon: any;
  label: string;
  amount: number;
  count: number;
  colorClass: string;
  bgClass: string;
}) => (
  <div className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 p-6 flex items-start gap-4">
    <div className={`p-3 rounded-xl ${bgClass}`}>
      <Icon className={`h-6 w-6 ${colorClass}`} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm text-surface-500 font-medium">{label}</p>
      <p className="text-2xl font-bold text-surface-900 dark:text-white mt-1">{formatCurrency(amount)}</p>
      <p className="text-xs text-surface-400 mt-1">{count} invoice{count !== 1 ? 's' : ''}</p>
    </div>
  </div>
);

export function InvoicesDashboardCards({ summary, isLoading }: InvoicesDashboardCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 p-6 h-28 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <KpiCard
        icon={DollarSign}
        label="Outstanding"
        amount={summary?.outstanding.amount ?? 0}
        count={summary?.outstanding.count ?? 0}
        colorClass="text-blue-600"
        bgClass="bg-blue-50 dark:bg-blue-900/30"
      />
      <KpiCard
        icon={AlertCircle}
        label="Overdue"
        amount={summary?.overdue.amount ?? 0}
        count={summary?.overdue.count ?? 0}
        colorClass="text-red-600"
        bgClass="bg-red-50 dark:bg-red-900/30"
      />
      <KpiCard
        icon={TrendingUp}
        label="Paid This Month"
        amount={summary?.paidMtd.amount ?? 0}
        count={summary?.paidMtd.count ?? 0}
        colorClass="text-emerald-600"
        bgClass="bg-emerald-50 dark:bg-emerald-900/30"
      />
      <div className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 p-6 flex items-start gap-4">
        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/30">
          <FileText className="h-6 w-6 text-amber-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-surface-500 font-medium">Draft Invoices</p>
          <p className="text-2xl font-bold text-surface-900 dark:text-white mt-1">{summary?.drafts ?? 0}</p>
          <p className="text-xs text-surface-400 mt-1">Awaiting issuance</p>
        </div>
      </div>
    </div>
  );
}
