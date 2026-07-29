import { type LucideIcon, TrendingUp } from 'lucide-react';

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  isLoading?: boolean;
}

export function SummaryCard({
  title,
  value,
  icon: Icon,
  trend = '↗ 12 this month',
  isLoading = false,
}: SummaryCardProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col justify-between rounded-[20px] bg-[#0B1426]/70 border border-surface-800/40 p-5 min-h-[145px] animate-pulse">
        <div className="h-9 w-9 rounded-xl bg-surface-800/50"></div>
        <div className="mt-4 h-8 w-20 rounded bg-surface-800/50"></div>
        <div className="mt-2 h-4 w-28 rounded bg-surface-800/50"></div>
      </div>
    );
  }

  return (
    <div className="group relative flex flex-col justify-between rounded-[20px] bg-[#0B1426]/70 border border-surface-800/40 p-5 transition-all hover:border-surface-700/60 hover:bg-[#0B1426]/90 min-h-[145px]">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-primary-950/60 border border-primary-800/30 text-primary-400">
            <Icon className="h-4 w-4" />
          </div>
        </div>
        <div className="text-[12px] font-medium text-surface-400 mb-1">{title}</div>
        <div className="text-[26px] font-bold tracking-tight text-white leading-tight" style={{ fontFamily: 'Outfit, Inter, sans-serif' }}>
          {value}
        </div>
      </div>

      <div className="flex items-center gap-1 text-[12px] font-medium text-success mt-3">
        <TrendingUp className="h-3.5 w-3.5" />
        <span>{trend}</span>
      </div>
    </div>
  );
}
