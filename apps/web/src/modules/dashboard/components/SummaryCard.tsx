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
      <div className="flex flex-col items-center justify-center rounded-[20px] bg-[#0B1426]/70 border border-surface-800/40 p-6 min-h-[160px] animate-pulse">
        <div className="h-10 w-10 rounded-xl bg-surface-800/50 mb-3"></div>
        <div className="h-3 w-20 rounded bg-surface-800/50 mb-2"></div>
        <div className="h-8 w-16 rounded bg-surface-800/50 mb-2"></div>
        <div className="h-3 w-24 rounded bg-surface-800/50"></div>
      </div>
    );
  }

  return (
    <div className="group relative flex flex-col items-center justify-center text-center rounded-[20px] bg-[#0B1426]/70 border border-surface-800/40 p-6 transition-all hover:border-surface-700/60 hover:bg-[#0B1426]/90 min-h-[160px]">
      <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-primary-950/60 border border-primary-800/30 text-primary-400 mb-3">
        <Icon className="h-[18px] w-[18px]" />
      </div>
      <div className="text-[12px] font-medium text-surface-400 mb-1 tracking-wide uppercase">{title}</div>
      <div className="text-[28px] font-bold tracking-tight text-white leading-tight" style={{ fontFamily: 'Outfit, Inter, sans-serif' }}>
        {value}
      </div>

      <div className="flex items-center justify-center gap-1 text-[12px] font-medium text-success mt-3">
        <TrendingUp className="h-3.5 w-3.5" />
        <span>{trend}</span>
      </div>
    </div>
  );
}
