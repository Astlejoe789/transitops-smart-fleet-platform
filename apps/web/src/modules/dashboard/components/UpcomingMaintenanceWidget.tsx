import { Wrench, CheckCircle } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';

interface UpcomingMaintenanceWidgetProps {
  maintenanceDue: number;
  maintenanceInProgress: number;
  isLoading?: boolean;
}

export function UpcomingMaintenanceWidget({ 
  maintenanceDue, 
  maintenanceInProgress, 
  isLoading = false 
}: UpcomingMaintenanceWidgetProps) {
  
  if (isLoading) {
    return (
      <div className="rounded-[var(--radius-xl)] bg-white p-6 shadow-sm dark:bg-surface-900">
        <div className="mb-6 h-6 w-1/3 animate-pulse rounded bg-surface-200 dark:bg-surface-800"></div>
        <div className="space-y-4">
          <div className="h-16 animate-pulse rounded-lg bg-surface-100 dark:bg-surface-800/50"></div>
          <div className="h-16 animate-pulse rounded-lg bg-surface-100 dark:bg-surface-800/50"></div>
        </div>
      </div>
    );
  }

  const hasData = maintenanceDue > 0 || maintenanceInProgress > 0;

  return (
    <div className="flex h-full flex-col rounded-[var(--radius-xl)] bg-white p-6 shadow-sm dark:bg-surface-900">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-[length:var(--text-h3)] font-semibold text-surface-900 dark:text-white">
          Service & Maintenance
        </h3>
        <button className="text-[length:var(--text-body-sm)] font-medium text-primary-600 hover:text-primary-500">
          View Fleet
        </button>
      </div>

      {!hasData ? (
        <EmptyState
          icon={CheckCircle}
          title="All clear"
          description="Your fleet is fully serviced. No upcoming maintenance scheduled."
          compact
          className="flex-1 border-0 bg-transparent p-4"
        />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-warning-200 bg-warning-50 p-4 dark:border-warning-900/30 dark:bg-warning-900/10">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warning-100 dark:bg-warning-900/30">
                <Wrench className="h-5 w-5 text-warning-600 dark:text-warning-400" />
              </div>
              <div>
                <p className="font-semibold text-warning-900 dark:text-warning-500">Maintenance Due</p>
                <p className="text-[length:var(--text-caption)] text-warning-700 dark:text-warning-600">
                  Vehicles requiring immediate service
                </p>
              </div>
            </div>
            <span className="text-2xl font-bold text-warning-700 dark:text-warning-500">
              {maintenanceDue}
            </span>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-surface-200 bg-surface-50 p-4 dark:border-surface-800 dark:bg-surface-800/50">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-200 dark:bg-surface-700">
                <Wrench className="h-5 w-5 text-surface-600 dark:text-surface-400" />
              </div>
              <div>
                <p className="font-semibold text-surface-900 dark:text-white">In Progress</p>
                <p className="text-[length:var(--text-caption)] text-surface-500 dark:text-surface-400">
                  Currently at the shop
                </p>
              </div>
            </div>
            <span className="text-2xl font-bold text-surface-900 dark:text-white">
              {maintenanceInProgress}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
