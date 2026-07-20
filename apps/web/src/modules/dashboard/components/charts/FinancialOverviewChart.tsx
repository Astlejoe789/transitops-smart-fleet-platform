import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { ExpensesData } from '../../hooks/useDashboard';

interface FinancialOverviewChartProps {
  data?: ExpensesData[];
  isLoading?: boolean;
}

export function FinancialOverviewChart({ data = [], isLoading = false }: FinancialOverviewChartProps) {
  if (isLoading) {
    return (
      <div className="flex h-80 items-center justify-center rounded-xl border border-surface-200 bg-white p-6 shadow-sm dark:border-surface-800 dark:bg-surface-900">
        <div className="flex h-full w-full items-end gap-2 px-8 pt-8">
          {[40, 70, 45, 90, 65, 85].map((h, i) => (
            <div key={i} className="w-full animate-pulse rounded-t-md bg-surface-100 dark:bg-surface-800" style={{ height: `${h}%` }}></div>
          ))}
        </div>
      </div>
    );
  }

  const formatCurrency = (value: number) => `$${value / 1000}k`;

  return (
    <div className="flex h-80 flex-col rounded-xl border border-surface-200 bg-white p-6 shadow-sm dark:border-surface-800 dark:bg-surface-900">
      <h3 className="mb-4 text-lg font-semibold text-surface-900 dark:text-white">Revenue vs Expenses</h3>
      
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#64748b' }}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tickFormatter={formatCurrency}
              tick={{ fontSize: 12, fill: '#64748b' }}
            />
            <Tooltip 
              formatter={(value: any) => [`$${Number(value).toLocaleString()}`, undefined]}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Legend verticalAlign="top" height={36} iconType="circle" />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              name="Revenue"
              stroke="#10b981" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorRevenue)" 
            />
            <Area 
              type="monotone" 
              dataKey="expenses" 
              name="Expenses"
              stroke="#ef4444" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorExpenses)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
