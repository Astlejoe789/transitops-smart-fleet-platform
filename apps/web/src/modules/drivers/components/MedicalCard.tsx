import { differenceInDays, format } from 'date-fns';
import { Heart, CheckCircle, AlertTriangle, XCircle, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import type { Driver } from '../types';

interface MedicalCardProps {
  driver: Driver;
}

function getMedicalStatus(expiryDate?: string | null) {
  if (!expiryDate) return { label: 'No Data', color: 'text-surface-400', bg: 'bg-surface-50 dark:bg-surface-800/30 border-surface-200 dark:border-surface-700', badgeVariant: 'secondary' as const, icon: FileText };
  const daysLeft = differenceInDays(new Date(expiryDate), new Date());
  if (daysLeft < 0) return { label: 'Expired', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900', badgeVariant: 'destructive' as const, icon: XCircle };
  if (daysLeft <= 30) return { label: 'Expiring Soon', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900', badgeVariant: 'warning' as const, icon: AlertTriangle };
  return { label: 'Valid', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900', badgeVariant: 'success' as const, icon: CheckCircle };
}

const FITNESS_LABELS: Record<string, string> = {
  FIT: 'Fit to Drive',
  FIT_WITH_CONDITIONS: 'Fit with Conditions',
  UNFIT: 'Unfit to Drive',
  PENDING: 'Pending Review',
};

export function MedicalCard({ driver }: MedicalCardProps) {
  const status = getMedicalStatus(driver.medicalExpiry);
  const StatusIcon = status.icon;
  const daysLeft = driver.medicalExpiry
    ? differenceInDays(new Date(driver.medicalExpiry), new Date())
    : null;

  return (
    <div className={`rounded-xl border p-5 transition-colors ${status.bg}`}>
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/80 shadow-sm dark:bg-surface-800">
            <Heart className="h-5 w-5 text-rose-500" />
          </div>
          <div>
            <h3 className="font-semibold text-surface-900 dark:text-white">Medical Status</h3>
            <p className="text-xs text-surface-500">Health & Fitness</p>
          </div>
        </div>
        <Badge variant={status.badgeVariant}>
          <StatusIcon className="mr-1 h-3 w-3" />
          {status.label}
        </Badge>
      </div>

      {/* Fitness Status */}
      {driver.fitnessStatus && (
        <div className="mb-4 rounded-lg bg-white/60 p-3 dark:bg-surface-800/60">
          <p className="mb-0.5 text-xs text-surface-500">Fitness Status</p>
          <p className="font-semibold text-surface-900 dark:text-white">
            {FITNESS_LABELS[driver.fitnessStatus] ?? driver.fitnessStatus}
          </p>
        </div>
      )}

      {/* Details */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="mb-0.5 text-xs text-surface-500">Medical Expiry</p>
          <span className={`text-sm font-semibold ${status.color}`}>
            {driver.medicalExpiry
              ? format(new Date(driver.medicalExpiry), 'MMM dd, yyyy')
              : '—'}
          </span>
        </div>

        <div>
          <p className="mb-0.5 text-xs text-surface-500">Days Remaining</p>
          {daysLeft !== null ? (
            <span
              className={`text-sm font-bold ${daysLeft < 0 ? 'text-red-600 dark:text-red-400' : daysLeft <= 30 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}
            >
              {daysLeft < 0 ? `${Math.abs(daysLeft)}d overdue` : `${daysLeft} days`}
            </span>
          ) : (
            <span className="text-sm text-surface-400">—</span>
          )}
        </div>

        {driver.medicalCertificateUrl && (
          <div className="col-span-2">
            <p className="mb-0.5 text-xs text-surface-500">Certificate</p>
            <a
              href={driver.medicalCertificateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-primary-600 hover:underline dark:text-primary-400"
            >
              <FileText className="h-3.5 w-3.5" />
              View Certificate
            </a>
          </div>
        )}

        {driver.healthNotes && (
          <div className="col-span-2">
            <p className="mb-0.5 text-xs text-surface-500">Health Notes</p>
            <p className="text-sm text-surface-600 dark:text-surface-400">{driver.healthNotes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
