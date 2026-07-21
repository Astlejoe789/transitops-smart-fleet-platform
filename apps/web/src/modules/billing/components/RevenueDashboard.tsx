import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useRevenueData } from '../hooks/useInvoices';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);
}

export function RevenueDashboard() {
  const { data, isLoading } = useRevenueData();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
        <div className="lg:col-span-2 bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 h-96" />
        <div className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 h-96" />
      </div>
    );
  }

  const chartData = data?.monthlyRevenue.map((d) => ({
    name: MONTHS[d.month],
    amount: d.amount,
  })) || [];

  const topCustomers = data?.topCustomers || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Monthly Revenue Chart */}
      <div className="lg:col-span-2 bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 p-6">
        <h3 className="text-lg font-bold text-surface-900 dark:text-white mb-6">Monthly Revenue</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6B7280', fontSize: 12 }}
                dy={10}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6B7280', fontSize: 12 }}
                tickFormatter={(value) => `$${value >= 1000 ? (value / 1000).toFixed(0) + 'k' : value}`}
              />
              <Tooltip 
                cursor={{ fill: '#F3F4F6', opacity: 0.4 }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value: any) => [formatCurrency(value as number), 'Revenue']}
              />
              <Bar dataKey="amount" fill="#3B82F6" radius={[4, 4, 0, 0]} maxBarSize={50} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Customers */}
      <div className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 p-6">
        <h3 className="text-lg font-bold text-surface-900 dark:text-white mb-6">Top Customers</h3>
        {topCustomers.length === 0 ? (
          <div className="flex h-[300px] items-center justify-center text-sm text-surface-500">
            No revenue data available
          </div>
        ) : (
          <div className="space-y-4 h-[300px] overflow-y-auto pr-2">
            {topCustomers.map((customer, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-surface-50 dark:bg-surface-800/50 rounded-lg">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-bold text-xs">
                    {index + 1}
                  </div>
                  <span className="truncate text-sm font-medium text-surface-900 dark:text-white">
                    {customer.name}
                  </span>
                </div>
                <span className="font-bold text-sm text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(customer.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
