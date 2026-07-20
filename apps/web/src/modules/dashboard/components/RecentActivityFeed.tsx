import { Activity, CheckCircle2, Truck, Wrench, FileText, CreditCard } from 'lucide-react';
import type { Activity as ActivityType } from '../hooks/useDashboard';
import { formatDistanceToNow } from 'date-fns';

interface RecentActivityFeedProps {
  activities?: ActivityType[];
  isLoading?: boolean;
}

export function RecentActivityFeed({ activities = [], isLoading = false }: RecentActivityFeedProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'TRIP': return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case 'VEHICLE': return <Truck className="h-4 w-4 text-blue-500" />;
      case 'MAINTENANCE': return <Wrench className="h-4 w-4 text-amber-500" />;
      case 'INVOICE': return <FileText className="h-4 w-4 text-indigo-500" />;
      case 'PAYMENT': return <CreditCard className="h-4 w-4 text-emerald-600" />;
      default: return <Activity className="h-4 w-4 text-surface-500" />;
    }
  };

  return (
    <div className="rounded-xl border border-surface-200 bg-white p-6 shadow-sm dark:border-surface-800 dark:bg-surface-900">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-surface-900 dark:text-white">Recent Activity</h3>
        <button className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400">
          View All
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex gap-4">
              <div className="mt-1 h-8 w-8 shrink-0 animate-pulse rounded-full bg-surface-200 dark:bg-surface-700"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 animate-pulse rounded bg-surface-200 dark:bg-surface-700"></div>
                <div className="h-3 w-1/2 animate-pulse rounded bg-surface-100 dark:bg-surface-800"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="relative space-y-6 before:absolute before:inset-y-0 before:left-4 before:h-full before:w-[2px] before:bg-surface-200 dark:before:bg-surface-800">
          {activities.length === 0 ? (
            <div className="py-6 text-center text-sm text-surface-500">No recent activities found.</div>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="relative flex gap-4">
                <div className="absolute left-4 top-5 -ml-[5px] h-[10px] w-[10px] rounded-full border-2 border-white bg-surface-300 dark:border-surface-900 dark:bg-surface-600"></div>
                
                <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-surface-200 bg-white shadow-sm dark:border-surface-700 dark:bg-surface-800">
                  {getIcon(activity.type)}
                </div>
                
                <div className="flex-1 pt-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm font-semibold text-surface-900 dark:text-white">
                      {activity.title}
                    </p>
                    <span className="text-xs font-medium text-surface-500 dark:text-surface-400">
                      {/* Attempt to format if valid date string, else fallback */}
                      {isNaN(Date.parse(activity.time)) ? activity.time : formatDistanceToNow(new Date(activity.time), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-surface-600 dark:text-surface-400">
                    {activity.description}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
