import { useFuelDashboardMetrics, useFuelAnalytics } from '../hooks/useFuel';
import { Droplet, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export function FuelDashboard() {
  const { data: metrics, isLoading: isLoadingMetrics } = useFuelDashboardMetrics();
  const { data: analytics, isLoading: isLoadingAnalytics } = useFuelAnalytics();

  if (isLoadingMetrics || isLoadingAnalytics) {
    return <div className="h-32 animate-pulse bg-surface-100 dark:bg-surface-800 rounded-xl" />;
  }

  const kpis = [
    {
      title: 'Today\'s Refuels',
      value: metrics?.todayRefuels || 0,
      icon: Droplet,
      trend: '+2 from yesterday',
      trendUp: true,
      color: 'text-blue-500',
      bg: 'bg-blue-50 dark:bg-blue-500/10',
    },
    {
      title: 'Monthly Fuel Cost',
      value: formatCurrency(metrics?.monthlyCost || 0),
      icon: DollarSign,
      trend: '+5% vs last month',
      trendUp: false,
      color: 'text-red-500',
      bg: 'bg-red-50 dark:bg-red-500/10',
    },
    {
      title: 'Avg Efficiency',
      value: analytics?.averageEfficiency ? `${analytics.averageEfficiency.toFixed(1)} km/L` : 'N/A',
      icon: TrendingUp,
      trend: 'Stable',
      trendUp: true,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50 dark:bg-emerald-500/10',
    },
    {
      title: 'Highest Cost Vehicle',
      value: analytics?.highestConsumptionCost ? formatCurrency(analytics.highestConsumptionCost) : 'N/A',
      icon: TrendingDown,
      trend: analytics?.highestConsumptionVehicleId ? 'Requires check' : 'N/A',
      trendUp: false,
      color: 'text-amber-500',
      bg: 'bg-amber-50 dark:bg-amber-500/10',
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
              <span className={`font-medium ${kpi.trendUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                {kpi.trend}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
