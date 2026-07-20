import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { TripsData } from '../../hooks/useDashboard';

interface TripsChartProps {
  data?: TripsData;
  isLoading?: boolean;
}

export function TripsChart({ data, isLoading = false }: TripsChartProps) {
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

  const chartData = data?.monthly || [];

  return (
    <div className="flex h-80 flex-col rounded-xl border border-surface-200 bg-white p-6 shadow-sm dark:border-surface-800 dark:bg-surface-900">
      <h3 className="mb-4 text-lg font-semibold text-surface-900 dark:text-white">Trips Overview</h3>
      
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
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
              tick={{ fontSize: 12, fill: '#64748b' }}
            />
            <Tooltip 
              cursor={{ fill: 'transparent' }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="trips" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
