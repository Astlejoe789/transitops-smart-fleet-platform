import { type LucideIcon } from 'lucide-react';

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  subtitle?: string;
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  isLoading?: boolean;
}

export function SummaryCard({
  title,
  value,
  icon: Icon,
  trend,
  subtitle,
  color = 'primary',
  isLoading = false,
}: SummaryCardProps) {
  const colorStyles = {
    primary: 'text-primary-600 bg-primary-50 dark:bg-primary-900/20 dark:text-primary-400',
    success: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400',
    warning: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400',
    danger: 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400',
    info: 'text-sky-600 bg-sky-50 dark:bg-sky-900/20 dark:text-sky-400',
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border border-surface-200 bg-white p-6 shadow-sm dark:border-surface-800 dark:bg-surface-900">
        <div className="flex items-center justify-between">
          <div className="h-4 w-24 animate-pulse rounded bg-surface-200 dark:bg-surface-700"></div>
          <div className="h-10 w-10 animate-pulse rounded-lg bg-surface-100 dark:bg-surface-800"></div>
        </div>
        <div className="mt-4 h-8 w-32 animate-pulse rounded bg-surface-200 dark:bg-surface-700"></div>
        <div className="mt-2 h-3 w-40 animate-pulse rounded bg-surface-100 dark:bg-surface-800"></div>
      </div>
    );
  }

  return (
    <div className="group relative overflow-hidden rounded-xl border border-surface-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-surface-800 dark:bg-surface-900">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-surface-500 dark:text-surface-400">{title}</p>
          <h3 className="mt-2 text-3xl font-bold tracking-tight text-surface-900 dark:text-white">
            {value}
          </h3>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110 ${colorStyles[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      
      <div className="mt-4 flex items-center text-sm">
        {trend && (
          <span
            className={`font-medium ${
              trend.isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
            }`}
          >
            {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
          </span>
        )}
        <span className="ml-2 text-surface-500 dark:text-surface-400">
          {subtitle || 'from last month'}
        </span>
      </div>
    </div>
  );
}
