import { useExpenseDashboard } from '../hooks/useExpenses';
import { DollarSign, Clock, CheckCircle, CreditCard } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export function ExpensesDashboard() {
  const { data: metrics, isLoading } = useExpenseDashboard();

  if (isLoading) {
    return <div className="h-32 animate-pulse bg-surface-100 dark:bg-surface-800 rounded-xl" />;
  }

  const kpis = [
    {
      title: 'Monthly Expenses',
      value: formatCurrency(metrics?.monthlyExpenses || 0),
      icon: DollarSign,
      trend: 'Total spent this month',
      trendUp: false,
      color: 'text-red-500',
      bg: 'bg-red-50 dark:bg-red-500/10',
    },
    {
      title: 'Pending Approvals',
      value: metrics?.pendingApprovals || 0,
      icon: Clock,
      trend: 'Require attention',
      trendUp: true,
      color: 'text-amber-500',
      bg: 'bg-amber-50 dark:bg-amber-500/10',
    },
    {
      title: 'Approved (Unpaid)',
      value: metrics?.approvedExpenses || 0,
      icon: CheckCircle,
      trend: 'Ready for payment',
      trendUp: true,
      color: 'text-blue-500',
      bg: 'bg-blue-50 dark:bg-blue-500/10',
    },
    {
      title: 'Paid Expenses',
      value: metrics?.paidExpenses || 0,
      icon: CreditCard,
      trend: 'Completed transactions',
      trendUp: true,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50 dark:bg-emerald-500/10',
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <div key={kpi.title} className="p-6 transition-all bg-white shadow-sm border border-surface-200 dark:border-surface-800 dark:bg-surface-900 rounded-xl hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-surface-500">{kpi.title}</p>
                <h3 className="mt-2 text-2xl font-bold text-surface-900 dark:text-white">
                  {kpi.value}
                </h3>
              </div>
              <div className={`p-3 rounded-xl ${kpi.bg}`}>
                <Icon className={`w-6 h-6 ${kpi.color}`} />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <span className="font-medium text-surface-500 dark:text-surface-400">
                {kpi.trend}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
