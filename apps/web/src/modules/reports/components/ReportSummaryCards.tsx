import { FileText, CalendarClock, DownloadCloud, LineChart } from 'lucide-react';

interface ReportSummaryCardsProps {
  totalReports: number;
  scheduledReports: number;
  exportedData: number;
  activeInsights: number;
  isLoading?: boolean;
}

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  subtitle: string;
  iconBg: string;
  iconColor: string;
}

function StatCard({ icon: Icon, label, value, subtitle, iconBg, iconColor }: StatCardProps) {
  return (
    <div className="group relative flex flex-col gap-2 rounded-[16px] bg-[#0B1426]/70 border border-surface-800/40 p-5 transition-all hover:border-surface-700/60 hover:bg-[#0B1426]/90 min-h-[110px]">
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${iconBg}`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
        <span className="text-[13px] font-medium text-surface-400">{label}</span>
      </div>
      <div className="pl-[52px]">
        <div className="text-[28px] font-bold tracking-tight text-white leading-tight" style={{ fontFamily: 'Outfit, Inter, sans-serif' }}>
          {value}
        </div>
        <div className="text-[12px] text-surface-500 mt-0.5">{subtitle}</div>
      </div>
    </div>
  );
}

function StatCardSkeleton() {
  return (
    <div className="flex flex-col gap-2 rounded-[16px] bg-[#0B1426]/70 border border-surface-800/40 p-5 min-h-[110px] animate-pulse">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-surface-800/50" />
        <div className="h-4 w-24 rounded bg-surface-800/50" />
      </div>
      <div className="pl-[52px]">
        <div className="h-7 w-16 rounded bg-surface-800/50" />
        <div className="mt-1 h-3 w-28 rounded bg-surface-800/50" />
      </div>
    </div>
  );
}

export function ReportSummaryCards({
  totalReports,
  scheduledReports,
  exportedData,
  activeInsights,
  isLoading,
}: ReportSummaryCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        icon={FileText}
        label="Total Reports"
        value={totalReports}
        subtitle={totalReports === 0 ? 'No reports generated' : `${totalReports} total reports`}
        iconBg="bg-blue-500/20"
        iconColor="text-blue-400"
      />
      <StatCard
        icon={CalendarClock}
        label="Scheduled"
        value={scheduledReports}
        subtitle={scheduledReports === 0 ? 'No scheduled reports' : `${scheduledReports} upcoming`}
        iconBg="bg-amber-500/20"
        iconColor="text-amber-400"
      />
      <StatCard
        icon={DownloadCloud}
        label="Exported Data"
        value={exportedData}
        subtitle={exportedData === 0 ? 'No data exported' : `${exportedData} exports`}
        iconBg="bg-purple-500/20"
        iconColor="text-purple-400"
      />
      <StatCard
        icon={LineChart}
        label="Active Insights"
        value={activeInsights}
        subtitle={activeInsights === 0 ? 'No active insights' : `${activeInsights} insights found`}
        iconBg="bg-emerald-500/20"
        iconColor="text-emerald-400"
      />
    </div>
  );
}
