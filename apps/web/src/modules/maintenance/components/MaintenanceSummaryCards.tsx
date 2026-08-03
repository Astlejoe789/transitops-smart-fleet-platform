import { Wrench, CalendarClock, AlertTriangle, CheckCircle2, AlertOctagon } from 'lucide-react';

interface MaintenanceSummaryCardsProps {
  totalServices: number;
  upcoming: number;
  overdue: number;
  completed: number;
  openIssues: number;
  isLoading?: boolean;
}

interface StatCardProps {
  icon: any;
  label: string;
  value: number;
  subtitle: string;
  iconBg: string;
  iconColor: string;
}

function StatCard({ icon: Icon, label, value, subtitle, iconBg, iconColor }: StatCardProps) {
  return (
    <div className="group relative flex flex-col items-center justify-center text-center gap-1 rounded-[16px] bg-[#0B1426]/70 border border-surface-800/40 p-5 transition-all hover:border-surface-700/60 hover:bg-[#0B1426]/90 min-h-[130px]">
      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${iconBg} mb-2`}>
        <Icon className={`h-5 w-5 ${iconColor}`} />
      </div>
      <span className="text-[12px] font-medium text-surface-400 tracking-wide uppercase">{label}</span>
      <div className="text-[28px] font-bold tracking-tight text-white leading-tight" style={{ fontFamily: 'Outfit, Inter, sans-serif' }}>
        {value}
      </div>
      <div className="text-[11px] text-surface-500 mt-0.5">{subtitle}</div>
    </div>
  );
}

function StatCardSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-[16px] bg-[#0B1426]/70 border border-surface-800/40 p-5 min-h-[130px] animate-pulse">
      <div className="h-10 w-10 rounded-full bg-surface-800/50 mb-1" />
      <div className="h-3 w-20 rounded bg-surface-800/50" />
      <div className="h-7 w-12 rounded bg-surface-800/50" />
      <div className="h-3 w-24 rounded bg-surface-800/50" />
    </div>
  );
}

export function MaintenanceSummaryCards({
  totalServices,
  upcoming,
  overdue,
  completed,
  openIssues,
  isLoading,
}: MaintenanceSummaryCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
      <StatCard
        icon={Wrench}
        label="Total Services"
        value={totalServices}
        subtitle={totalServices === 0 ? 'No services recorded' : `${totalServices} service${totalServices !== 1 ? 's' : ''} logged`}
        iconBg="bg-purple-500/20"
        iconColor="text-purple-400"
      />
      <StatCard
        icon={CalendarClock}
        label="Upcoming"
        value={upcoming}
        subtitle={upcoming === 0 ? 'No upcoming services' : `${upcoming} upcoming`}
        iconBg="bg-emerald-500/20"
        iconColor="text-emerald-400"
      />
      <StatCard
        icon={AlertTriangle}
        label="Overdue"
        value={overdue}
        subtitle={overdue === 0 ? 'No overdue services' : `${overdue} overdue`}
        iconBg="bg-amber-500/20"
        iconColor="text-amber-400"
      />
      <StatCard
        icon={CheckCircle2}
        label="Completed"
        value={completed}
        subtitle={completed === 0 ? 'No completed services' : `${completed} completed`}
        iconBg="bg-emerald-500/20"
        iconColor="text-emerald-400"
      />
      <StatCard
        icon={AlertOctagon}
        label="Open Issues"
        value={openIssues}
        subtitle={openIssues === 0 ? 'No open issues' : `${openIssues} open`}
        iconBg="bg-red-500/20"
        iconColor="text-red-400"
      />
    </div>
  );
}
