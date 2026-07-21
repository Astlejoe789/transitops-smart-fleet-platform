import { 
  Truck, 
  Users, 
  Route, 
  DollarSign, 
  Receipt, 
  FileText, 
  Wrench, 
  Fuel,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { 
  useDashboardSummary,
  useFleetStatus,
  useTripsData,
  useExpensesData,
  useRecentActivities,
  useDashboardNotifications
} from '../hooks/useDashboard';

import { SummaryCard } from '../components/SummaryCard';
import { QuickActions } from '../components/QuickActions';
import { FleetStatusChart } from '../components/charts/FleetStatusChart';
import { TripsChart } from '../components/charts/TripsChart';
import { FinancialOverviewChart } from '../components/charts/FinancialOverviewChart';
import { RecentActivityFeed } from '../components/RecentActivityFeed';
import { NotificationsPanel } from '../components/NotificationsPanel';

export default function DashboardPage() {
  const { data: summary, isLoading: isLoadingSummary } = useDashboardSummary();
  const { data: fleetData, isLoading: isLoadingFleet } = useFleetStatus();
  const { data: tripsData, isLoading: isLoadingTrips } = useTripsData();
  const { data: expensesData, isLoading: isLoadingExpenses } = useExpensesData();
  const { data: activities, isLoading: isLoadingActivities } = useRecentActivities();
  const { data: notifications, isLoading: isLoadingNotifications } = useDashboardNotifications();

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-surface-900 dark:text-white sm:text-3xl">
            Operations Dashboard
          </h1>
          <p className="mt-1 text-sm text-surface-500 dark:text-surface-400">
            Real-time overview of your fleet, trips, and financial metrics.
          </p>
        </div>
      </div>

      {/* Summary KPI Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard 
          title="Total Vehicles" 
          value={summary?.totalVehicles ?? 0}
          icon={Truck} 
          color="primary"
          isLoading={isLoadingSummary}
          trend={{ value: 4.5, isPositive: true }}
        />
        <SummaryCard 
          title="Active Trips Today" 
          value={summary?.todayTrips ?? 0}
          icon={Route} 
          color="info"
          isLoading={isLoadingSummary}
          trend={{ value: 12.0, isPositive: true }}
          subtitle="vs yesterday"
        />
        <SummaryCard 
          title="Monthly Revenue" 
          value={`$${((summary?.monthlyRevenue ?? 0) / 1000).toFixed(1)}k`}
          icon={DollarSign} 
          color="success"
          isLoading={isLoadingSummary}
          trend={{ value: 8.2, isPositive: true }}
        />
        <SummaryCard 
          title="Maintenance Due" 
          value={summary?.maintenanceDue ?? 0}
          icon={Wrench} 
          color="warning"
          isLoading={isLoadingSummary}
          trend={{ value: 2.1, isPositive: false }}
        />
      </div>

      {/* Secondary KPI Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard 
          title="Total Drivers" 
          value={summary?.totalDrivers ?? 0}
          icon={Users} 
          color="primary"
          isLoading={isLoadingSummary}
        />
        <SummaryCard 
          title="Fuel Costs (MTD)" 
          value={`$${((summary?.fuelCost ?? 0) / 1000).toFixed(1)}k`}
          icon={Fuel} 
          color="danger"
          isLoading={isLoadingSummary}
          trend={{ value: 5.4, isPositive: false }}
        />
        <SummaryCard 
          title="Monthly Expenses" 
          value={`$${((summary?.monthlyExpenses ?? 0) / 1000).toFixed(1)}k`}
          icon={Receipt} 
          color="danger"
          isLoading={isLoadingSummary}
          trend={{ value: 1.2, isPositive: false }}
        />
        <SummaryCard 
          title="Pending Invoices" 
          value={summary?.pendingInvoices ?? 0}
          icon={FileText} 
          color="info"
          isLoading={isLoadingSummary}
        />
      </div>

      {/* Maintenance KPI Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard 
          title="Maintenance In Progress" 
          value={summary?.maintenanceInProgress ?? 0}
          icon={Wrench} 
          color="warning"
          isLoading={isLoadingSummary}
        />
        <SummaryCard 
          title="Completed Services" 
          value={summary?.completedServices ?? 0}
          icon={CheckCircle} 
          color="success"
          isLoading={isLoadingSummary}
        />
        <SummaryCard 
          title="Maintenance Cost (Total)" 
          value={`$${((summary?.maintenanceCost ?? 0) / 1000).toFixed(1)}k`}
          icon={DollarSign} 
          color="danger"
          isLoading={isLoadingSummary}
        />
        <SummaryCard 
          title="Maintenance Due" 
          value={summary?.maintenanceDue ?? 0}
          icon={AlertCircle} 
          color="danger"
          isLoading={isLoadingSummary}
        />
      </div>

      {/* Quick Actions Panel */}
      <QuickActions />

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <FleetStatusChart data={fleetData} isLoading={isLoadingFleet} />
        </div>
        <div className="lg:col-span-2">
          <FinancialOverviewChart data={expensesData} isLoading={isLoadingExpenses} />
        </div>
      </div>

      {/* Secondary Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TripsChart data={tripsData} isLoading={isLoadingTrips} />
        </div>
      </div>

      {/* Feeds and Notifications Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RecentActivityFeed activities={activities} isLoading={isLoadingActivities} />
        <NotificationsPanel notifications={notifications} isLoading={isLoadingNotifications} />
      </div>
    </div>
  );
}
