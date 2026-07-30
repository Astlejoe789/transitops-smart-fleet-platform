import { Users, UserCheck, Navigation, AlertTriangle, ShieldAlert } from 'lucide-react';
import type { DriverStats } from '../types';

interface DriverSummaryCardsProps {
  stats?: DriverStats;
  isLoading?: boolean;
}

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: number;
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
        <div className="h-7 w-10 rounded bg-surface-800/50" />
        <div className="mt-1 h-3 w-28 rounded bg-surface-800/50" />
      </div>
    </div>
  );
}

export function DriverSummaryCards({ stats, isLoading }: DriverSummaryCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  const total = stats?.total ?? 0;
  const available = stats?.available ?? 0;
  const onTrip = stats?.onTrip ?? 0;
  const expiringLicense = stats?.expiringLicense ?? 0;
  const expiredLicense = stats?.expiredLicense ?? 0;

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
      <StatCard
        icon={Users}
        label="Total Drivers"
        value={total}
        subtitle={total === 0 ? 'No drivers added' : `${total} driver${total !== 1 ? 's' : ''} registered`}
        iconBg="bg-emerald-500/20"
        iconColor="text-emerald-400"
      />
      <StatCard
        icon={UserCheck}
        label="Available"
        value={available}
        subtitle={available === 0 ? 'No available drivers' : `${available} currently available`}
        iconBg="bg-emerald-500/20"
        iconColor="text-emerald-400"
      />
      <StatCard
        icon={Navigation}
        label="On Trip"
        value={onTrip}
        subtitle={onTrip === 0 ? 'No drivers on trip' : `${onTrip} on active trips`}
        iconBg="bg-blue-500/20"
        iconColor="text-blue-400"
      />
      <StatCard
        icon={AlertTriangle}
        label="License Expiring"
        value={expiringLicense}
        subtitle={expiringLicense === 0 ? 'No expiring licenses' : `${expiringLicense} expiring soon`}
        iconBg="bg-amber-500/20"
        iconColor="text-amber-400"
      />
      <StatCard
        icon={ShieldAlert}
        label="Certificates Expiring"
        value={expiredLicense}
        subtitle={expiredLicense === 0 ? 'No expiring certificates' : `${expiredLicense} expiring soon`}
        iconBg="bg-red-500/20"
        iconColor="text-red-400"
      />
    </div>
  );
}
