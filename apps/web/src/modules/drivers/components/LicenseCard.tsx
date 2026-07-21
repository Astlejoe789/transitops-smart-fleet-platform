import { differenceInDays, format } from 'date-fns';
import { Shield, AlertTriangle, CheckCircle, XCircle, Calendar, Award } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import type { Driver } from '../types';

interface LicenseCardProps {
  driver: Driver;
}

function getLicenseStatus(expiryDate: string) {
  const daysLeft = differenceInDays(new Date(expiryDate), new Date());
  if (daysLeft < 0) return { label: 'Expired', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900', badgeVariant: 'destructive' as const, icon: XCircle };
  if (daysLeft <= 30) return { label: 'Expiring Soon', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900', badgeVariant: 'warning' as const, icon: AlertTriangle };
  return { label: 'Valid', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900', badgeVariant: 'success' as const, icon: CheckCircle };
}

const CATEGORY_LABELS: Record<string, string> = {
  CLASS_A: 'Class A',
  CLASS_B: 'Class B',
  CLASS_C: 'Class C',
  CLASS_D: 'Class D',
  HEAVY_RIGID: 'Heavy Rigid',
  COMBINATION: 'Combination',
};

export function LicenseCard({ driver }: LicenseCardProps) {
  const status = getLicenseStatus(driver.licenseExpiry);
  const StatusIcon = status.icon;
  const daysLeft = differenceInDays(new Date(driver.licenseExpiry), new Date());

  return (
    <div className={`rounded-xl border p-5 transition-colors ${status.bg}`}>
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/80 shadow-sm dark:bg-surface-800">
            <Shield className="h-5 w-5 text-primary-600" />
          </div>
          <div>
            <h3 className="font-semibold text-surface-900 dark:text-white">Driver License</h3>
            <p className="text-xs text-surface-500">License Information</p>
          </div>
        </div>
        <Badge variant={status.badgeVariant}>
          <StatusIcon className="mr-1 h-3 w-3" />
          {status.label}
        </Badge>
      </div>

      {/* License Number */}
      <div className="mb-4 rounded-lg bg-white/60 p-3 dark:bg-surface-800/60">
        <p className="mb-0.5 text-xs text-surface-500">License Number</p>
        <p className="font-mono text-lg font-bold tracking-widest text-surface-900 dark:text-white">
          {driver.licenseNumber}
        </p>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="mb-0.5 text-xs text-surface-500">Category</p>
          <div className="flex items-center gap-1.5">
            <Award className="h-3.5 w-3.5 text-primary-500" />
            <span className="text-sm font-medium text-surface-900 dark:text-white">
              {CATEGORY_LABELS[driver.licenseCategory] ?? driver.licenseCategory}
            </span>
          </div>
        </div>

        <div>
          <p className="mb-0.5 text-xs text-surface-500">Issued Date</p>
          <span className="text-sm text-surface-700 dark:text-surface-300">
            {driver.licenseIssuedDate
              ? format(new Date(driver.licenseIssuedDate), 'MMM dd, yyyy')
              : '—'}
          </span>
        </div>

        <div>
          <p className="mb-0.5 text-xs text-surface-500">Expiry Date</p>
          <div className="flex items-center gap-1.5">
            <Calendar className={`h-3.5 w-3.5 ${status.color}`} />
            <span className={`text-sm font-semibold ${status.color}`}>
              {format(new Date(driver.licenseExpiry), 'MMM dd, yyyy')}
            </span>
          </div>
        </div>

        <div>
          <p className="mb-0.5 text-xs text-surface-500">Days Remaining</p>
          <span
            className={`text-sm font-bold ${daysLeft < 0 ? 'text-red-600 dark:text-red-400' : daysLeft <= 30 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}
          >
            {daysLeft < 0 ? `${Math.abs(daysLeft)} days overdue` : `${daysLeft} days`}
          </span>
        </div>

        {driver.licenseIssuingAuthority && (
          <div className="col-span-2">
            <p className="mb-0.5 text-xs text-surface-500">Issuing Authority</p>
            <span className="text-sm text-surface-700 dark:text-surface-300">
              {driver.licenseIssuingAuthority}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
