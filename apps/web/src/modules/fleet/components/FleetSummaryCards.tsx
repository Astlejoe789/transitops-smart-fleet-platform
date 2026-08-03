import { Truck, CheckCircle2, Wrench, FileWarning } from 'lucide-react';

interface FleetSummaryCardsProps {
  totalVehicles: number;
  activeVehicles: number;
  inMaintenance: number;
  documentsExpiring: number;
}

interface StatCardProps {
  icon: any;
  label: string;
  value: number;
  subtitle: string;
}

function StatCard({ icon: Icon, label, value, subtitle }: StatCardProps) {
  return (
    <div className="group relative flex flex-col items-center justify-center text-center gap-1 rounded-[16px] bg-[#0B1426]/70 border border-surface-800/40 p-5 transition-all hover:border-surface-700/60 hover:bg-[#0B1426]/90 min-h-[130px]">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-950/60 border border-primary-800/30 text-primary-400 mb-2">
        <Icon className="h-5 w-5" />
      </div>
      <span className="text-[12px] font-medium text-surface-400 tracking-wide uppercase">{label}</span>
      <div className="text-[28px] font-bold tracking-tight text-white leading-tight" style={{ fontFamily: 'Outfit, Inter, sans-serif' }}>
        {value}
      </div>
      <div className="text-[11px] text-surface-500 mt-0.5">{subtitle}</div>
    </div>
  );
}

export function FleetSummaryCards({
  totalVehicles,
  activeVehicles,
  inMaintenance,
  documentsExpiring,
}: FleetSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        icon={Truck}
        label="Total Vehicles"
        value={totalVehicles}
        subtitle={totalVehicles === 0 ? 'No vehicles added' : `${totalVehicles} vehicle${totalVehicles !== 1 ? 's' : ''} in fleet`}
      />
      <StatCard
        icon={CheckCircle2}
        label="Active Vehicles"
        value={activeVehicles}
        subtitle={activeVehicles === 0 ? 'No active vehicles' : `${activeVehicles} currently active`}
      />
      <StatCard
        icon={Wrench}
        label="In Maintenance"
        value={inMaintenance}
        subtitle={inMaintenance === 0 ? 'No vehicles in maintenance' : `${inMaintenance} in maintenance`}
      />
      <StatCard
        icon={FileWarning}
        label="Documents Expiring"
        value={documentsExpiring}
        subtitle={documentsExpiring === 0 ? 'No expiring documents' : `${documentsExpiring} expiring soon`}
      />
    </div>
  );
}
