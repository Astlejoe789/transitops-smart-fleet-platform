import { format } from 'date-fns';
import {
  UserPlus,
  FileText,
  Shield,
  Activity,
  Truck,
  Pencil,
  Trash2,
  RotateCcw,
  File,
} from 'lucide-react';
import { useDriverTimeline } from '../hooks/useDrivers';

interface DriverTimelineProps {
  driverId: string;
}

// Map audit action + newValues to a meaningful event label
function getEventInfo(action: string, entityType: string, newValues?: Record<string, any> | null) {
  const actionLabel = newValues?.action as string | undefined;

  if (entityType === 'DRIVER') {
    if (action === 'CREATE') return { icon: UserPlus, label: 'Driver Profile Created', color: 'text-emerald-500 bg-emerald-100 dark:bg-emerald-900/30' };
    if (action === 'DELETE') return { icon: Trash2, label: 'Driver Deleted', color: 'text-red-500 bg-red-100 dark:bg-red-900/30' };
    if (actionLabel === 'RESTORED') return { icon: RotateCcw, label: 'Driver Restored', color: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30' };
    if (actionLabel === 'VEHICLE_ASSIGNED') return { icon: Truck, label: `Vehicle Assigned: ${newValues?.plateNumber ?? ''}`, color: 'text-purple-500 bg-purple-100 dark:bg-purple-900/30' };
    if (actionLabel === 'VEHICLE_UNASSIGNED') return { icon: Truck, label: 'Vehicle Unassigned', color: 'text-orange-500 bg-orange-100 dark:bg-orange-900/30' };
    if (newValues?.status) return { icon: Activity, label: `Status Changed to ${newValues.status}`, color: 'text-amber-500 bg-amber-100 dark:bg-amber-900/30' };
    return { icon: Pencil, label: 'Profile Updated', color: 'text-surface-500 bg-surface-100 dark:bg-surface-700' };
  }

  if (entityType === 'DRIVER_DOCUMENT') {
    if (action === 'CREATE') return { icon: File, label: `Document Added: ${newValues?.documentType ?? ''}`, color: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30' };
    if (action === 'DELETE') return { icon: FileText, label: 'Document Removed', color: 'text-red-500 bg-red-100 dark:bg-red-900/30' };
  }

  if (entityType === 'LICENSE') {
    return { icon: Shield, label: 'License Updated', color: 'text-indigo-500 bg-indigo-100 dark:bg-indigo-900/30' };
  }

  return { icon: Activity, label: `${action} on ${entityType}`, color: 'text-surface-500 bg-surface-100 dark:bg-surface-700' };
}

export function DriverTimeline({ driverId }: DriverTimelineProps) {
  const { data: events = [], isLoading } = useDriverTimeline(driverId);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex gap-4">
            <div className="h-8 w-8 animate-pulse rounded-full bg-surface-200 dark:bg-surface-700" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3.5 w-48 animate-pulse rounded bg-surface-200 dark:bg-surface-700" />
              <div className="h-3 w-32 animate-pulse rounded bg-surface-100 dark:bg-surface-800" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-100 dark:bg-surface-800">
          <Activity className="h-6 w-6 text-surface-400" />
        </div>
        <p className="mt-3 font-medium text-surface-700 dark:text-surface-300">No timeline events</p>
        <p className="mt-1 text-sm text-surface-500">
          Actions on this driver will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-4 top-4 bottom-4 w-px bg-surface-200 dark:bg-surface-700" />

      <div className="space-y-4">
        {events.map((event) => {
          const { icon: Icon, label, color } = getEventInfo(
            event.action,
            event.entityType,
            event.newValues,
          );
          const userName = event.user
            ? `${event.user.firstName} ${event.user.lastName}`
            : 'System';

          return (
            <div key={event.id} className="relative flex gap-4 pl-0">
              {/* Icon */}
              <div
                className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${color}`}
              >
                <Icon className="h-4 w-4" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pb-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="font-medium text-surface-900 dark:text-white">{label}</p>
                  <time className="shrink-0 text-xs text-surface-400">
                    {format(new Date(event.createdAt), 'MMM dd, yyyy · h:mm a')}
                  </time>
                </div>
                <p className="mt-0.5 text-sm text-surface-500">By {userName}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
