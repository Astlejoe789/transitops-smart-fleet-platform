import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '../services/analyticsApi';
import { KPICard } from '@/components/analytics/KPICard';
import { ChartCard } from '@/components/analytics/ChartCard';
import { 
  DollarSign, Activity, Truck, Users, Map, 
  FileText, Briefcase, ShoppingCart 
} from 'lucide-react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, 
  Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

export default function AnalyticsPage() {
  const { data: kpis, isLoading: isKpisLoading } = useQuery({
    queryKey: ['analytics-kpis'],
    queryFn: analyticsApi.getKPIs,
  });

  const { data: charts, isLoading: isChartsLoading } = useQuery({
    queryKey: ['analytics-charts'],
    queryFn: analyticsApi.getCharts,
  });

  if (isKpisLoading || isChartsLoading) {
    return <div className="p-8 flex justify-center items-center h-full">Loading analytics...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Executive Dashboard</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard title="Total Revenue" value={`$${kpis?.totalRevenue?.toLocaleString() || 0}`} icon={DollarSign} />
        <KPICard title="Monthly Revenue" value={`$${kpis?.monthlyRevenue?.toLocaleString() || 0}`} icon={Activity} />
        <KPICard title="Total Expenses" value={`$${kpis?.totalExpenses?.toLocaleString() || 0}`} icon={ShoppingCart} />
        <KPICard title="Net Profit" value={`$${kpis?.netProfit?.toLocaleString() || 0}`} icon={Briefcase} />
        
        <KPICard title="Active Vehicles" value={kpis?.activeVehicles || 0} icon={Truck} trend={{ value: kpis?.fleetUtilization?.toFixed(1) || 0, label: 'Utilization' }} />
        <KPICard title="Active Drivers" value={kpis?.activeDrivers || 0} icon={Users} />
        <KPICard title="Total Trips" value={kpis?.totalTrips || 0} icon={Map} />
        <KPICard title="Outstanding Invoices" value={kpis?.outstandingInvoices || 0} icon={FileText} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <ChartCard title="Revenue vs Expenses" className="lg:col-span-4" contentClassName="p-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={charts?.revenueVsExpense || []}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
              <Legend />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#10b981" fillOpacity={0.3} fill="#10b981" />
              <Area type="monotone" dataKey="expense" name="Expenses" stroke="#ef4444" fillOpacity={0.3} fill="#ef4444" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Vehicle Utilization" className="lg:col-span-3" contentClassName="p-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={charts?.vehicleUtilization || []}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {(charts?.vehicleUtilization || []).map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Fuel Consumption Trend" className="lg:col-span-4" contentClassName="p-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={charts?.fuelConsumptionTrend || []}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `${Number(value).toLocaleString()} Liters`} />
              <Bar dataKey="liters" name="Fuel (Liters)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Maintenance Cost Trend" className="lg:col-span-3" contentClassName="p-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={charts?.maintenanceTrend || []}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
              <Line type="monotone" dataKey="cost" name="Maintenance Cost" stroke="#f59e0b" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
