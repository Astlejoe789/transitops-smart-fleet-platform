import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import type { FleetStatusData } from '../../hooks/useDashboard';

interface FleetStatusChartProps {
  data?: FleetStatusData[];
  isLoading?: boolean;
}

export function FleetStatusChart({ data = [], isLoading = false }: FleetStatusChartProps) {
  if (isLoading) {
    return (
      <div className="flex h-72 items-center justify-center rounded-xl border border-surface-200 bg-white p-6 shadow-sm dark:border-surface-800 dark:bg-surface-900">
        <div className="h-48 w-48 animate-pulse rounded-full border-8 border-surface-100 dark:border-surface-800"></div>
      </div>
    );
  }

  return (
    <div className="flex h-80 flex-col rounded-xl border border-surface-200 bg-white p-6 shadow-sm dark:border-surface-800 dark:bg-surface-900">
      <h3 className="mb-4 text-lg font-semibold text-surface-900 dark:text-white">Fleet Status</h3>
      
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
