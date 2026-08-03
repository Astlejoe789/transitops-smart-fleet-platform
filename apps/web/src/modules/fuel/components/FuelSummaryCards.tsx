import { Droplet, DollarSign, TrendingUp, Truck } from 'lucide-react';

interface FuelSummaryCardsProps {
  todayRefuels: number;
  monthlyCost: number;
  avgEfficiency: string;
  highestCostVehicle: string;
  todayTrend?: string;
  costTrend?: string;
  efficiencyTrend?: string;
  highestCostTrend?: string;
  isLoading?: boolean;
}

interface StatCardProps {
  icon: any;
  label: string;
  value: string | number;
  trend: string;
  trendColor: string;
  iconBg: string;
  iconColor: string;
}

function StatCard({ icon: Icon, label, value, trend, trendColor, iconBg, iconColor }: StatCardProps) {
  return (
    <div className="group relative flex flex-col items-center justify-center text-center gap-1 rounded-[16px] bg-[#0B1426]/70 border border-surface-800/40 p-5 transition-all hover:border-surface-700/60 hover:bg-[#0B1426]/90 min-h-[130px]">
      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${iconBg} mb-2`}>
        <Icon className={`h-5 w-5 ${iconColor}`} />
      </div>
      <span className="text-[12px] font-medium text-surface-400 tracking-wide uppercase">{label}</span>
      <div className="text-[28px] font-bold tracking-tight text-white leading-tight" style={{ fontFamily: 'Outfit, Inter, sans-serif' }}>
        {value}
      </div>
      <div className={`text-[11px] mt-0.5 font-medium ${trendColor}`}>{trend}</div>
    </div>
  );
}

function StatCardSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-[16px] bg-[#0B1426]/70 border border-surface-800/40 p-5 min-h-[130px] animate-pulse">
      <div className="h-10 w-10 rounded-full bg-surface-800/50 mb-1" />
      <div className="h-3 w-20 rounded bg-surface-800/50" />
      <div className="h-7 w-16 rounded bg-surface-800/50" />
      <div className="h-3 w-24 rounded bg-surface-800/50" />
    </div>
  );
}

export function FuelSummaryCards({
  todayRefuels,
  monthlyCost,
  avgEfficiency,
  highestCostVehicle,
  todayTrend = '↑ 2 from yesterday',
  costTrend = '↑ 5% vs last month',
  efficiencyTrend = 'Stable',
  highestCostTrend = 'N/A',
  isLoading,
}: FuelSummaryCardsProps) {
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
        icon={Droplet}
        label="Today's Refuels"
        value={todayRefuels}
        trend={todayTrend}
        trendColor="text-blue-400"
        iconBg="bg-blue-500/20"
        iconColor="text-blue-400"
      />
      <StatCard
        icon={DollarSign}
        label="Monthly Fuel Cost"
        value={`$${monthlyCost.toFixed(2)}`}
        trend={costTrend}
        trendColor="text-amber-400"
        iconBg="bg-amber-500/20"
        iconColor="text-amber-400"
      />
      <StatCard
        icon={TrendingUp}
        label="Avg Efficiency"
        value={avgEfficiency}
        trend={efficiencyTrend}
        trendColor="text-emerald-400"
        iconBg="bg-emerald-500/20"
        iconColor="text-emerald-400"
      />
      <StatCard
        icon={Truck}
        label="Highest Cost Vehicle"
        value={highestCostVehicle}
        trend={highestCostTrend}
        trendColor="text-surface-500"
        iconBg="bg-amber-500/20"
        iconColor="text-amber-400"
      />
    </div>
  );
}
