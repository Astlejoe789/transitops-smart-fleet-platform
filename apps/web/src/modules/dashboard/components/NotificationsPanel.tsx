import { AlertCircle, AlertTriangle, Info, Bell } from 'lucide-react';
import type { DashboardNotification } from '../hooks/useDashboard';

interface NotificationsPanelProps {
  notifications?: DashboardNotification[];
  isLoading?: boolean;
}

export function NotificationsPanel({ notifications = [], isLoading = false }: NotificationsPanelProps) {
  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return {
          icon: <AlertCircle className="h-5 w-5 text-red-500" />,
          bg: 'bg-red-50 dark:bg-red-900/10',
          border: 'border-red-200 dark:border-red-900/30',
        };
      case 'WARNING':
        return {
          icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
          bg: 'bg-amber-50 dark:bg-amber-900/10',
          border: 'border-amber-200 dark:border-amber-900/30',
        };
      default:
        return {
          icon: <Info className="h-5 w-5 text-blue-500" />,
          bg: 'bg-blue-50 dark:bg-blue-900/10',
          border: 'border-blue-200 dark:border-blue-900/30',
        };
    }
  };

  return (
    <div className="flex h-full flex-col rounded-xl border border-surface-200 bg-white p-6 shadow-sm dark:border-surface-800 dark:bg-surface-900">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-surface-500 dark:text-surface-400" />
          <h3 className="text-lg font-semibold text-surface-900 dark:text-white">Alerts & Notifications</h3>
        </div>
        <span className="inline-flex items-center justify-center rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-bold text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
          {notifications.length} New
        </span>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto pr-2">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded-xl bg-surface-100 dark:bg-surface-800"></div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-surface-100 dark:bg-surface-800">
              <CheckCircle2 className="h-6 w-6 text-emerald-500" />
            </div>
            <p className="text-sm font-medium text-surface-900 dark:text-white">All caught up!</p>
            <p className="text-xs text-surface-500 dark:text-surface-400">No new alerts to show.</p>
          </div>
        ) : (
          notifications.map((notification) => {
            const style = getSeverityStyles(notification.severity);
            return (
              <div
                key={notification.id}
                className={`flex gap-4 rounded-xl border p-4 ${style.bg} ${style.border}`}
              >
                <div className="shrink-0 pt-0.5">{style.icon}</div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-semibold text-surface-900 dark:text-white">
                      {notification.title}
                    </h4>
                    <span className="shrink-0 text-xs font-medium text-surface-500">
                      {notification.time}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-surface-600 dark:text-surface-400">
                    {notification.message}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// Ensure CheckCircle2 is imported if used in empty state above
import { CheckCircle2 } from 'lucide-react';
