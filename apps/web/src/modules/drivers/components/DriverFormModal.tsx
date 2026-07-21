import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  User,
  Shield,
  Heart,
  Phone,
  ChevronLeft,
  ChevronRight,
  Check,
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useCreateDriver, useUpdateDriver } from '../hooks/useDrivers';
import { driverFormSchema, type DriverFormData } from '../schemas/driverSchema';
import type { Driver } from '../types';

interface DriverFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  driver?: Driver | null;
}

type FormStep = 'personal' | 'license' | 'medical' | 'emergency';

const STEPS: { id: FormStep; label: string; icon: typeof User }[] = [
  { id: 'personal', label: 'Personal', icon: User },
  { id: 'license', label: 'License', icon: Shield },
  { id: 'medical', label: 'Medical', icon: Heart },
  { id: 'emergency', label: 'Emergency', icon: Phone },
];

const DEFAULT_VALUES: DriverFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  employeeId: '',
  photoUrl: '',
  dateOfBirth: null,
  gender: null,
  bloodGroup: null,
  nationality: null,
  address: null,
  branchId: null,
  joinedDate: null,
  status: 'AVAILABLE',
  emergencyContactName: null,
  emergencyContactPhone: null,
  emergencyContactRelation: null,
  licenseNumber: '',
  licenseCategory: 'CLASS_B',
  licenseIssuedDate: null,
  licenseExpiry: '',
  licenseIssuingAuthority: null,
  medicalCertificateUrl: null,
  medicalExpiry: null,
  fitnessStatus: null,
  healthNotes: null,
};

// Helper to convert date to 'yyyy-MM-dd' for input[type=date]
function toDateInput(dt?: string | null) {
  if (!dt) return '';
  return dt.split('T')[0];
}

// Helper to convert date input to ISO string
function toISOString(dt?: string | null) {
  if (!dt) return null;
  return new Date(dt).toISOString();
}

export function DriverFormModal({ isOpen, onClose, driver }: DriverFormModalProps) {
  const isEditing = !!driver;
  const [step, setStep] = useState<FormStep>('personal');
  const [saveError, setSaveError] = useState('');

  const createMutation = useCreateDriver();
  const updateMutation = useUpdateDriver(driver?.id || '');

  const {
    register,
    handleSubmit,
    reset,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<DriverFormData>({
    resolver: zodResolver(driverFormSchema),
    defaultValues: DEFAULT_VALUES,
  });

  // Reset form when opening
  useEffect(() => {
    if (!isOpen) return;
    setSaveError('');
    setStep('personal');

    if (driver) {
      reset({
        firstName: driver.user?.firstName ?? '',
        lastName: driver.user?.lastName ?? '',
        email: driver.user?.email ?? '',
        phone: driver.phone ?? '',
        employeeId: driver.employeeId ?? '',
        photoUrl: driver.photoUrl ?? '',
        dateOfBirth: toDateInput(driver.dateOfBirth),
        gender: (driver.gender as any) ?? null,
        bloodGroup: driver.bloodGroup ?? null,
        nationality: driver.nationality ?? null,
        address: driver.address ?? null,
        branchId: driver.branchId ?? null,
        joinedDate: toDateInput(driver.joinedDate),
        status: driver.status ?? 'AVAILABLE',
        emergencyContactName: driver.emergencyContactName ?? null,
        emergencyContactPhone: driver.emergencyContactPhone ?? null,
        emergencyContactRelation: driver.emergencyContactRelation ?? null,
        licenseNumber: driver.licenseNumber ?? '',
        licenseCategory: driver.licenseCategory ?? 'CLASS_B',
        licenseIssuedDate: toDateInput(driver.licenseIssuedDate),
        licenseExpiry: toDateInput(driver.licenseExpiry),
        licenseIssuingAuthority: driver.licenseIssuingAuthority ?? null,
        medicalCertificateUrl: driver.medicalCertificateUrl ?? null,
        medicalExpiry: toDateInput(driver.medicalExpiry),
        fitnessStatus: driver.fitnessStatus ?? null,
        healthNotes: driver.healthNotes ?? null,
      });
    } else {
      reset(DEFAULT_VALUES);
    }
  }, [isOpen, driver, reset]);

  const stepIndex = STEPS.findIndex((s) => s.id === step);

  const goNext = async () => {
    // Validate current step fields before proceeding
    const stepFields: Record<FormStep, (keyof DriverFormData)[]> = {
      personal: ['firstName', 'lastName', 'email', 'phone', 'employeeId', 'status'],
      license: ['licenseNumber', 'licenseCategory', 'licenseExpiry'],
      medical: [],
      emergency: [],
    };
    const valid = await trigger(stepFields[step]);
    if (valid && stepIndex < STEPS.length - 1) {
      setStep(STEPS[stepIndex + 1].id);
    }
  };

  const goBack = () => {
    if (stepIndex > 0) setStep(STEPS[stepIndex - 1].id);
  };

  const onSubmit = async (data: DriverFormData) => {
    setSaveError('');
    try {
      const payload = {
        ...data,
        dateOfBirth: toISOString(data.dateOfBirth as string | null),
        licenseIssuedDate: toISOString(data.licenseIssuedDate as string | null),
        licenseExpiry: new Date(data.licenseExpiry).toISOString(),
        medicalExpiry: toISOString(data.medicalExpiry as string | null),
        joinedDate: data.joinedDate ? new Date(data.joinedDate).toISOString() : undefined,
        photoUrl: data.photoUrl || null,
        medicalCertificateUrl: data.medicalCertificateUrl || null,
      };

      if (isEditing) {
        await updateMutation.mutateAsync(payload as any);
      } else {
        await createMutation.mutateAsync(payload as any);
      }
      onClose();
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ?? err?.message ?? 'Failed to save driver. Please try again.';
      setSaveError(msg);
    }
  };

  const FieldError = ({ msg }: { msg?: string }) =>
    msg ? <p className="mt-0.5 text-xs text-red-500">{msg}</p> : null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Driver' : 'Add New Driver'}
      description={isEditing ? 'Update driver information.' : 'Register a new driver in the system.'}
    >
      {/* Step Indicator */}
      <div className="mb-6 flex items-center justify-between">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const isActive = s.id === step;
          const isCompleted = i < stepIndex;
          return (
            <div key={s.id} className="flex flex-1 items-center">
              <button
                type="button"
                onClick={() => setStep(s.id)}
                className={`flex flex-col items-center gap-1 transition-colors ${
                  isActive
                    ? 'text-primary-600 dark:text-primary-400'
                    : isCompleted
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-surface-400 dark:text-surface-600'
                }`}
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors ${
                    isActive
                      ? 'border-primary-600 bg-primary-600 text-white'
                      : isCompleted
                        ? 'border-emerald-500 bg-emerald-500 text-white'
                        : 'border-surface-300 dark:border-surface-600'
                  }`}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                </div>
                <span className="hidden text-xs font-medium sm:block">{s.label}</span>
              </button>
              {i < STEPS.length - 1 && (
                <div
                  className={`mx-1 h-px flex-1 transition-colors ${
                    isCompleted ? 'bg-emerald-400' : 'bg-surface-200 dark:bg-surface-700'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      <form id="driver-form" onSubmit={handleSubmit(onSubmit)}>
        {/* ─── Step 1: Personal ─────────────────────────────────────────────── */}
        {step === 'personal' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-surface-700 dark:text-surface-300">
                  First Name *
                </label>
                <Input {...register('firstName')} placeholder="John" error={!!errors.firstName} />
                <FieldError msg={errors.firstName?.message} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-surface-700 dark:text-surface-300">
                  Last Name *
                </label>
                <Input {...register('lastName')} placeholder="Smith" error={!!errors.lastName} />
                <FieldError msg={errors.lastName?.message} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-surface-700 dark:text-surface-300">
                  Employee ID *
                </label>
                <Input {...register('employeeId')} placeholder="EMP-001" error={!!errors.employeeId} />
                <FieldError msg={errors.employeeId?.message} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-surface-700 dark:text-surface-300">
                  Status
                </label>
                <Select {...register('status')}>
                  <option value="AVAILABLE">Available</option>
                  <option value="ON_TRIP">On Trip</option>
                  <option value="ON_LEAVE">On Leave</option>
                  <option value="SUSPENDED">Suspended</option>
                  <option value="TERMINATED">Terminated</option>
                </Select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-surface-700 dark:text-surface-300">
                Email Address *
              </label>
              <Input
                {...register('email')}
                type="email"
                placeholder="john.smith@company.com"
                error={!!errors.email}
              />
              <FieldError msg={errors.email?.message} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-surface-700 dark:text-surface-300">
                  Phone *
                </label>
                <Input {...register('phone')} placeholder="+1 555 000 0000" error={!!errors.phone} />
                <FieldError msg={errors.phone?.message} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-surface-700 dark:text-surface-300">
                  Date of Birth
                </label>
                <Input type="date" {...register('dateOfBirth')} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-surface-700 dark:text-surface-300">
                  Gender
                </label>
                <Select {...register('gender')}>
                  <option value="">Select...</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </Select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-surface-700 dark:text-surface-300">
                  Blood Group
                </label>
                <Select {...register('bloodGroup')}>
                  <option value="">Select...</option>
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </Select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-surface-700 dark:text-surface-300">
                  Nationality
                </label>
                <Input {...register('nationality')} placeholder="e.g. American" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-surface-700 dark:text-surface-300">
                Address
              </label>
              <Input {...register('address')} placeholder="123 Main St, City, Country" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-surface-700 dark:text-surface-300">
                  Joining Date
                </label>
                <Input type="date" {...register('joinedDate')} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-surface-700 dark:text-surface-300">
                  Photo URL
                </label>
                <Input {...register('photoUrl')} placeholder="https://..." />
              </div>
            </div>
          </div>
        )}

        {/* ─── Step 2: License ──────────────────────────────────────────────── */}
        {step === 'license' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-surface-700 dark:text-surface-300">
                  License Number *
                </label>
                <Input
                  {...register('licenseNumber')}
                  placeholder="DL-123456789"
                  error={!!errors.licenseNumber}
                  className="font-mono uppercase"
                />
                <FieldError msg={errors.licenseNumber?.message} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-surface-700 dark:text-surface-300">
                  License Category *
                </label>
                <Select {...register('licenseCategory')} error={!!errors.licenseCategory}>
                  <option value="CLASS_A">Class A</option>
                  <option value="CLASS_B">Class B</option>
                  <option value="CLASS_C">Class C</option>
                  <option value="CLASS_D">Class D</option>
                  <option value="HEAVY_RIGID">Heavy Rigid</option>
                  <option value="COMBINATION">Combination</option>
                </Select>
                <FieldError msg={errors.licenseCategory?.message} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-surface-700 dark:text-surface-300">
                  Issue Date
                </label>
                <Input type="date" {...register('licenseIssuedDate')} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-surface-700 dark:text-surface-300">
                  Expiry Date *
                </label>
                <Input
                  type="date"
                  {...register('licenseExpiry')}
                  error={!!errors.licenseExpiry}
                />
                <FieldError msg={errors.licenseExpiry?.message} />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-surface-700 dark:text-surface-300">
                Issuing Authority
              </label>
              <Input
                {...register('licenseIssuingAuthority')}
                placeholder="e.g. Department of Motor Vehicles"
              />
            </div>

            {!isEditing && (
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-900 dark:bg-blue-950/20">
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  <strong>Note:</strong> A user account will be created for this driver with the email above. The default password will be <code className="rounded bg-blue-100 px-1 dark:bg-blue-900">Driver@123</code> — the driver should change it on first login.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ─── Step 3: Medical ──────────────────────────────────────────────── */}
        {step === 'medical' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-surface-700 dark:text-surface-300">
                  Fitness Status
                </label>
                <Select {...register('fitnessStatus')}>
                  <option value="">Select...</option>
                  <option value="FIT">Fit to Drive</option>
                  <option value="FIT_WITH_CONDITIONS">Fit with Conditions</option>
                  <option value="UNFIT">Unfit to Drive</option>
                  <option value="PENDING">Pending Review</option>
                </Select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-surface-700 dark:text-surface-300">
                  Medical Expiry
                </label>
                <Input type="date" {...register('medicalExpiry')} />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-surface-700 dark:text-surface-300">
                Medical Certificate URL
              </label>
              <Input
                {...register('medicalCertificateUrl')}
                placeholder="https://example.com/medical-cert.pdf"
                error={!!errors.medicalCertificateUrl}
              />
              <FieldError msg={errors.medicalCertificateUrl?.message} />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-surface-700 dark:text-surface-300">
                Health Notes
              </label>
              <textarea
                {...register('healthNotes')}
                rows={4}
                placeholder="Any relevant health conditions or notes..."
                className="w-full rounded-md border border-surface-200 bg-white px-3 py-2 text-sm text-surface-900 placeholder-surface-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-surface-700 dark:bg-surface-800 dark:text-surface-100 dark:placeholder-surface-500 dark:focus:border-primary-500"
              />
            </div>
          </div>
        )}

        {/* ─── Step 4: Emergency Contact ────────────────────────────────────── */}
        {step === 'emergency' && (
          <div className="space-y-4">
            <p className="text-sm text-surface-500 dark:text-surface-400">
              Provide emergency contact details for this driver.
            </p>

            <div className="space-y-1">
              <label className="text-sm font-medium text-surface-700 dark:text-surface-300">
                Contact Name
              </label>
              <Input {...register('emergencyContactName')} placeholder="Jane Smith" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-surface-700 dark:text-surface-300">
                  Contact Phone
                </label>
                <Input
                  {...register('emergencyContactPhone')}
                  placeholder="+1 555 000 0000"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-surface-700 dark:text-surface-300">
                  Relationship
                </label>
                <Select {...register('emergencyContactRelation')}>
                  <option value="">Select...</option>
                  <option value="SPOUSE">Spouse</option>
                  <option value="PARENT">Parent</option>
                  <option value="SIBLING">Sibling</option>
                  <option value="CHILD">Child</option>
                  <option value="FRIEND">Friend</option>
                  <option value="OTHER">Other</option>
                </Select>
              </div>
            </div>

            {saveError && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-900 dark:bg-red-950/20">
                <p className="text-sm text-red-600 dark:text-red-400">{saveError}</p>
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="mt-6 flex justify-between border-t border-surface-200 pt-4 dark:border-surface-700">
          <Button
            type="button"
            variant="outline"
            onClick={stepIndex === 0 ? onClose : goBack}
          >
            {stepIndex === 0 ? (
              'Cancel'
            ) : (
              <>
                <ChevronLeft className="mr-1.5 h-4 w-4" />
                Back
              </>
            )}
          </Button>

          {stepIndex < STEPS.length - 1 ? (
            <Button type="button" onClick={goNext}>
              Next
              <ChevronRight className="ml-1.5 h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="submit"
              isLoading={isSubmitting || createMutation.isPending || updateMutation.isPending}
            >
              <Check className="mr-1.5 h-4 w-4" />
              {isEditing ? 'Save Changes' : 'Create Driver'}
            </Button>
          )}
        </div>
      </form>
    </Modal>
  );
}
