import { 
  Truck, 
  Users, 
  Route, 
  DollarSign,
  UserCheck
} from 'lucide-react';
import { 
  useDashboardSummary,
  useRecentActivities
} from '../hooks/useDashboard';

import { SummaryCard } from '../components/SummaryCard';
import { RecentActivityFeed } from '../components/RecentActivityFeed';
import { RolloutWidget } from '../components/RolloutWidget';
import { RouteMapCard } from '../components/RouteMapCard';
import { FleetUtilizationCard } from '../components/FleetUtilizationCard';
import { FuelConsumptionCard } from '../components/FuelConsumptionCard';
import { AIFleetCard } from '../components/AIFleetCard';
import { OptimizeBannerCard } from '../components/OptimizeBannerCard';
import { SystemHealthCard } from '../components/SystemHealthCard';
import { PageContainer } from "@/components/layout";

export default function DashboardPage() {
  const { data: summary, isLoading: isLoadingSummary } = useDashboardSummary();

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        
        {/* Top Status & Welcome Header */}
        <div>
          {/* Dispatcher status pill */}
          <div className="flex items-center gap-3 mb-3">
            <span className="rounded-full bg-surface-800/60 px-3 py-0.5 text-[11px] font-semibold text-surface-200 border border-surface-700/40 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-primary-400" />
              Dispatcher
            </span>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-success">
              <div className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
              All systems operational
            </div>
          </div>

          {/* Welcome title & Workspace info */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-[28px] md:text-[32px] font-bold tracking-tight text-white leading-tight" style={{ fontFamily: 'Outfit, Inter, sans-serif' }}>
                Welcome back, Astle Joe 👋
              </h1>
              <p className="mt-1 text-[13px] md:text-[14px] text-surface-400">
                Here's what's happening with your fleet today.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-xl bg-[#0B1426]/70 border border-surface-800/50 px-4 py-2 self-start md:self-auto shrink-0">
              <span className="text-[12px] font-medium text-surface-400">Workspace members</span>
              <div className="flex items-center gap-1 text-[13px] font-bold text-white pl-2 border-l border-surface-700/40">
                <UserCheck className="h-3.5 w-3.5 text-primary-400" />
                <span>1</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left 2 Columns */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* 4 Summary KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <SummaryCard 
                title="Total Vehicles" 
                value={summary?.totalVehicles ? summary.totalVehicles : 842}
                trend="↗ 12 this month"
                icon={Truck} 
                color="primary"
                isLoading={isLoadingSummary}
              />
              <SummaryCard 
                title="Active Drivers" 
                value={summary?.totalDrivers ? summary.totalDrivers : "1,053"}
                trend="↗ 40 this month"
                icon={Users} 
                color="info"
                isLoading={isLoadingSummary}
              />
              <SummaryCard 
                title="Active Trips" 
                value={summary?.todayTrips ? summary.todayTrips : "12,987"}
                trend="↗ 30 this month"
                icon={Route} 
                color="success"
                isLoading={isLoadingSummary}
              />
              <SummaryCard 
                title="Total Revenue" 
                value="$4.58M"
                trend="↗ 55 this month"
                icon={DollarSign} 
                color="warning"
                isLoading={isLoadingSummary}
              />
            </div>

            {/* Middle Row: Route Map + (Fleet Utilization & Fuel Consumption) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <RouteMapCard />
              <div className="flex flex-col gap-6">
                <FleetUtilizationCard />
                <FuelConsumptionCard />
              </div>
            </div>

            {/* Bottom Row: Recent Activity + Optimize Banner */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <RecentActivityFeed />
              <OptimizeBannerCard />
            </div>
          </div>

          {/* Right 1 Column */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <AIFleetCard />
            <RolloutWidget />
            <SystemHealthCard />
          </div>

        </div>
      </div>
    </PageContainer>
  );
}
