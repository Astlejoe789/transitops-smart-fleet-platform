import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Activity,
  File,
  Shield,
  Heart,
  Truck,
  Clock,
  Receipt,
  Navigation,
  Edit,
  Trash2,
  RotateCcw,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Droplet,
  Globe,
  User,
  Building,
  CreditCard,
} from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useDriver, useDeleteDriver, useRestoreDriver } from '../hooks/useDrivers';
import { DriverDocuments } from '../components/DriverDocuments';
import { DriverAssignment } from '../components/DriverAssignment';
import { DriverTimeline } from '../components/DriverTimeline';
import { LicenseCard } from '../components/LicenseCard';
import { MedicalCard } from '../components/MedicalCard';
import { DriverFormModal } from '../components/DriverFormModal';
import type { Driver } from '../types';

type Tab =
  | 'overview'
  | 'documents'
  | 'license'
  | 'medical'
  | 'assignments'
  | 'trips'
  | 'expenses'
  | 'timeline';

const TABS: { id: Tab; label: string; icon: typeof Activity }[] = [
  { id: 'overview', label: 'Overview', icon: Activity },
  { id: 'documents', label: 'Documents', icon: File },
  { id: 'license', label: 'License', icon: Shield },
  { id: 'medical', label: 'Medical', icon: Heart },
  { id: 'assignments', label: 'Assignment', icon: Truck },
  { id: 'trips', label: 'Trip History', icon: Navigation },
  { id: 'expenses', label: 'Expenses', icon: Receipt },
  { id: 'timeline', label: 'Timeline', icon: Clock },
];

const STATUS_CONFIG: Record<string, { variant: any; label: string }> = {
  AVAILABLE: { variant: 'success', label: 'Available' },
  ON_TRIP: { variant: 'default', label: 'On Trip' },
  ON_LEAVE: { variant: 'warning', label: 'On Leave' },
  SUSPENDED: { variant: 'destructive', label: 'Suspended' },
  TERMINATED: { variant: 'outline', label: 'Terminated' },
};

// ─── Info Field ───────────────────────────────────────────────────────────────
function InfoField({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value?: string | null;
  icon?: typeof User;
}) {
  return (
    <div className="space-y-0.5">
      <p className="flex items-center gap-1 text-xs font-medium text-surface-400 dark:text-surface-500">
        {Icon && <Icon className="h-3 w-3" />}
        {label}
      </p>
      <p className="text-sm font-medium text-surface-900 dark:text-white">{value ?? '—'}</p>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function DriverDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { data: driver, isLoading } = useDriver(id ?? '');
  const deleteMutation = useDeleteDriver();
  const restoreMutation = useRestoreDriver();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl">
        {/* Header Skeleton */}
        <div className="mb-6 flex items-center gap-4">
          <div className="h-9 w-9 animate-pulse rounded-full bg-surface-200 dark:bg-surface-700" />
          <div className="space-y-2">
            <div className="h-5 w-40 animate-pulse rounded bg-surface-200 dark:bg-surface-700" />
            <div className="h-3.5 w-24 animate-pulse rounded bg-surface-100 dark:bg-surface-800" />
          </div>
        </div>
        <div className="h-64 animate-pulse rounded-xl bg-surface-200 dark:bg-surface-800" />
      </div>
    );
  }

  if (!driver) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <p className="text-lg font-semibold text-surface-700 dark:text-surface-300">Driver not found</p>
        <Button variant="outline" onClick={() => navigate('/drivers')}>
          Back to Drivers
        </Button>
      </div>
    );
  }

  const statusConfig = STATUS_CONFIG[driver.status] ?? { variant: 'secondary', label: driver.status };
  const fullName = `${driver.user?.firstName} ${driver.user?.lastName}`;
  const initials = `${driver.user?.firstName?.[0] ?? ''}${driver.user?.lastName?.[0] ?? ''}`.toUpperCase();

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(driver.id);
      navigate('/drivers');
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  const handleRestore = async () => {
    try {
      await restoreMutation.mutateAsync(driver.id);
    } catch (err) {
      console.error('Restore failed', err);
    }
  };

  return (
    <div className="mx-auto max-w-7xl pb-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/drivers')} className="-ml-2 mt-1">
            <ArrowLeft className="h-5 w-5" />
          </Button>

          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="relative">
              {driver.photoUrl ? (
                <img
                  src={driver.photoUrl}
                  alt={fullName}
                  className="h-16 w-16 rounded-2xl object-cover ring-4 ring-surface-200 dark:ring-surface-700"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-xl font-bold text-white ring-4 ring-surface-200 dark:ring-surface-700">
                  {initials || '?'}
                </div>
              )}
              <span
                className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white dark:border-surface-900 ${
                  driver.status === 'AVAILABLE'
                    ? 'bg-emerald-500'
                    : driver.status === 'ON_TRIP'
                      ? 'bg-blue-500'
                      : driver.status === 'SUSPENDED'
                        ? 'bg-red-500'
                        : 'bg-surface-400'
                }`}
              />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-surface-900 dark:text-white">
                  {fullName}
                </h1>
                <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
                {driver.deletedAt && <Badge variant="outline">Deleted</Badge>}
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-surface-500">
                <span className="flex items-center gap-1">
                  <CreditCard className="h-3.5 w-3.5" />
                  {driver.employeeId}
                </span>
                {driver.user?.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5" />
                    {driver.user.email}
                  </span>
                )}
                {driver.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5" />
                    {driver.phone}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex shrink-0 gap-2 sm:mt-1">
          {driver.deletedAt ? (
            <Button
              variant="outline"
              onClick={handleRestore}
              isLoading={restoreMutation.isPending}
            >
              <RotateCcw className="mr-1.5 h-4 w-4" />
              Restore
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={() => setIsEditing(true)} id="edit-driver-btn">
                <Edit className="mr-1.5 h-4 w-4" />
                Edit
              </Button>
              <Button
                variant="destructive"
                onClick={() => setShowDeleteConfirm(true)}
                id="delete-driver-btn"
              >
                <Trash2 className="mr-1.5 h-4 w-4" />
                Delete
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 overflow-x-auto border-b border-surface-200 dark:border-surface-800">
        <div className="flex w-max gap-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 border-b-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-surface-500 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-100'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="rounded-xl border border-surface-200 bg-white p-6 shadow-sm dark:border-surface-800 dark:bg-surface-900">
        {/* ── Overview ── */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-surface-500">
                Personal Information
              </h3>
              <div className="grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-3 lg:grid-cols-4">
                <InfoField label="Full Name" value={fullName} icon={User} />
                <InfoField label="Employee ID" value={driver.employeeId} icon={CreditCard} />
                <InfoField label="Email" value={driver.user?.email} icon={Mail} />
                <InfoField label="Phone" value={driver.phone} icon={Phone} />
                <InfoField
                  label="Date of Birth"
                  value={driver.dateOfBirth ? format(new Date(driver.dateOfBirth), 'MMM dd, yyyy') : null}
                  icon={Calendar}
                />
                <InfoField label="Gender" value={driver.gender} icon={User} />
                <InfoField label="Blood Group" value={driver.bloodGroup} icon={Droplet} />
                <InfoField label="Nationality" value={driver.nationality} icon={Globe} />
                <InfoField label="Address" value={driver.address} icon={MapPin} />
                <InfoField
                  label="Branch"
                  value={driver.branch?.name}
                  icon={Building}
                />
                <InfoField
                  label="Joined Date"
                  value={driver.joinedDate ? format(new Date(driver.joinedDate), 'MMM dd, yyyy') : null}
                  icon={Calendar}
                />
              </div>
            </div>

            {(driver.emergencyContactName || driver.emergencyContactPhone) && (
              <div>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-surface-500">
                  Emergency Contact
                </h3>
                <div className="grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-3">
                  <InfoField label="Contact Name" value={driver.emergencyContactName} icon={User} />
                  <InfoField label="Contact Phone" value={driver.emergencyContactPhone} icon={Phone} />
                  <InfoField label="Relationship" value={driver.emergencyContactRelation} />
                </div>
              </div>
            )}

            {/* Quick License & Medical Summary */}
            <div className="grid gap-4 sm:grid-cols-2">
              <LicenseCard driver={driver} />
              <MedicalCard driver={driver} />
            </div>
          </div>
        )}

        {/* ── Documents ── */}
        {activeTab === 'documents' && <DriverDocuments driverId={driver.id} />}

        {/* ── License ── */}
        {activeTab === 'license' && (
          <div className="max-w-lg">
            <LicenseCard driver={driver} />
          </div>
        )}

        {/* ── Medical ── */}
        {activeTab === 'medical' && (
          <div className="max-w-lg">
            <MedicalCard driver={driver} />
          </div>
        )}

        {/* ── Assignment ── */}
        {activeTab === 'assignments' && <DriverAssignment driver={driver} />}

        {/* ── Timeline ── */}
        {activeTab === 'timeline' && <DriverTimeline driverId={driver.id} />}

        {/* ── Placeholder tabs ── */}
        {(activeTab === 'trips' || activeTab === 'expenses') && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-100 dark:bg-surface-800">
              {activeTab === 'trips' ? (
                <Navigation className="h-8 w-8 text-surface-400" />
              ) : (
                <Receipt className="h-8 w-8 text-surface-400" />
              )}
            </div>
            <h4 className="mt-4 text-lg font-semibold text-surface-800 dark:text-surface-200">
              {activeTab === 'trips' ? 'Trip History' : 'Expenses'} — Coming Soon
            </h4>
            <p className="mt-2 max-w-xs text-sm text-surface-500">
              {activeTab === 'trips'
                ? 'Trip history will be available when the Trips module is implemented.'
                : 'Driver expense tracking will be available when the Expenses module is implemented.'}
            </p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <DriverFormModal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        driver={driver as Driver}
      />

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-md rounded-2xl border border-surface-200 bg-white p-6 shadow-2xl dark:border-surface-800 dark:bg-surface-900">
            <h2 className="mb-2 text-lg font-semibold text-surface-900 dark:text-white">
              Delete Driver
            </h2>
            <p className="mb-6 text-sm text-surface-500">
              Delete <strong>{fullName}</strong>? This is a soft delete — they can be restored later.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                isLoading={deleteMutation.isPending}
                onClick={handleDelete}
              >
                Delete Driver
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
