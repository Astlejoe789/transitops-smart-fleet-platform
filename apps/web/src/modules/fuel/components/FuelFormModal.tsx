import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { fuelSchema, type FuelFormValues } from '../schemas/fuelSchema';
import type { FuelLog } from '../types';
import { FuelType, PaymentMethod } from '../types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Droplet, X } from 'lucide-react';
import { useVehicles } from '@/modules/fleet/hooks/useFleet';
import { useDrivers } from '@/modules/drivers/hooks/useDrivers';

interface FuelFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<FuelLog>) => void;
  initialData?: FuelLog | null;
}

export function FuelFormModal({ isOpen, onClose, onSubmit, initialData }: FuelFormModalProps) {
  const { data: fleetData } = useVehicles({});
  const { data: driverData } = useDrivers({});

  const vehicles = fleetData?.data || [];
  const drivers = driverData?.data || [];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FuelFormValues>({
    resolver: zodResolver(fuelSchema),
    defaultValues: {
      fuelDate: new Date().toISOString().slice(0, 16),
      fuelType: FuelType.DIESEL,
      paymentMethod: PaymentMethod.CORPORATE_CARD,
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({
          vehicleId: initialData.vehicleId,
          driverId: initialData.driverId,
          tripId: initialData.tripId || undefined,
          fuelType: initialData.fuelType,
          fuelGrade: initialData.fuelGrade || undefined,
          paymentMethod: initialData.paymentMethod,
          fuelDate: new Date(initialData.fuelDate).toISOString().slice(0, 16),
          liters: initialData.liters,
          costPerLiter: initialData.costPerLiter,
          odometerReading: initialData.odometerReading,
          stationName: initialData.stationName || undefined,
          location: initialData.location || undefined,
          receiptNumber: initialData.receiptNumber || undefined,
          receiptUrl: initialData.receiptUrl || undefined,
          remarks: initialData.remarks || undefined,
        });
      } else {
        reset({
          fuelDate: new Date().toISOString().slice(0, 16),
          fuelType: FuelType.DIESEL,
          paymentMethod: PaymentMethod.CORPORATE_CARD,
        });
      }
    }
  }, [isOpen, initialData, reset]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl p-6 overflow-hidden bg-white rounded-xl shadow-xl dark:bg-surface-900 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30">
              <Droplet className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <h2 className="text-xl font-semibold text-surface-900 dark:text-white">
              {initialData ? 'Edit Fuel Entry' : 'Log Fuel Entry'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 transition-colors rounded-lg text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-2">
          <form id="fuel-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium">Vehicle</label>
                <Select
                  {...register('vehicleId')}
                  error={!!errors.vehicleId?.message}
                >
                  <option value="">Select Vehicle</option>
                  {vehicles.map(v => (
                    <option key={v.id} value={v.id}>{v.make} {v.model} ({v.plateNumber})</option>
                  ))}
                </Select>
                {errors.vehicleId && <p className="mt-1 text-xs text-red-500">{errors.vehicleId.message}</p>}
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">Driver</label>
                <Select
                  {...register('driverId')}
                  error={!!errors.driverId?.message}
                >
                  <option value="">Select Driver</option>
                  {drivers.map(d => (
                    <option key={d.id} value={d.id}>{d.user?.firstName} {d.user?.lastName}</option>
                  ))}
                </Select>
                {errors.driverId && <p className="mt-1 text-xs text-red-500">{errors.driverId.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium">Fuel Type</label>
                <Select
                  {...register('fuelType')}
                  error={!!errors.fuelType?.message}
                >
                  {Object.keys(FuelType).map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </Select>
                {errors.fuelType && <p className="mt-1 text-xs text-red-500">{errors.fuelType.message}</p>}
              </div>
              
              <div>
                <label className="block mb-1 text-sm font-medium">Fuel Grade (Optional)</label>
                <Input
                  placeholder="e.g. Premium 95"
                  {...register('fuelGrade')}
                  error={!!errors.fuelGrade?.message}
                />
                {errors.fuelGrade && <p className="mt-1 text-xs text-red-500">{errors.fuelGrade.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium">Liters / kWh</label>
                <Input
                  type="number"
                  step="0.01"
                  {...register('liters', { valueAsNumber: true })}
                  error={!!errors.liters?.message}
                />
                {errors.liters && <p className="mt-1 text-xs text-red-500">{errors.liters.message}</p>}
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">Cost Per Unit</label>
                <Input
                  type="number"
                  step="0.01"
                  {...register('costPerLiter', { valueAsNumber: true })}
                  error={!!errors.costPerLiter?.message}
                />
                {errors.costPerLiter && <p className="mt-1 text-xs text-red-500">{errors.costPerLiter.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium">Date & Time</label>
                <Input
                  type="datetime-local"
                  {...register('fuelDate')}
                  error={!!errors.fuelDate?.message}
                />
                {errors.fuelDate && <p className="mt-1 text-xs text-red-500">{errors.fuelDate.message}</p>}
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">Odometer Reading</label>
                <Input
                  type="number"
                  {...register('odometerReading', { valueAsNumber: true })}
                  error={!!errors.odometerReading?.message}
                />
                {errors.odometerReading && <p className="mt-1 text-xs text-red-500">{errors.odometerReading.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium">Payment Method</label>
                <Select
                  {...register('paymentMethod')}
                  error={!!errors.paymentMethod?.message}
                >
                  {Object.keys(PaymentMethod).map(t => (
                    <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>
                  ))}
                </Select>
                {errors.paymentMethod && <p className="mt-1 text-xs text-red-500">{errors.paymentMethod.message}</p>}
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">Receipt Number</label>
                <Input
                  {...register('receiptNumber')}
                  error={!!errors.receiptNumber?.message}
                />
                {errors.receiptNumber && <p className="mt-1 text-xs text-red-500">{errors.receiptNumber.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium">Station Name</label>
                <Input
                  {...register('stationName')}
                  error={!!errors.stationName?.message}
                />
                {errors.stationName && <p className="mt-1 text-xs text-red-500">{errors.stationName.message}</p>}
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">Location</label>
                <Input
                  {...register('location')}
                  error={!!errors.location?.message}
                />
                {errors.location && <p className="mt-1 text-xs text-red-500">{errors.location.message}</p>}
              </div>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Remarks</label>
              <Input
                {...register('remarks')}
                error={!!errors.remarks?.message}
              />
              {errors.remarks && <p className="mt-1 text-xs text-red-500">{errors.remarks.message}</p>}
            </div>

          </form>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-surface-200 dark:border-surface-800">
          <Button variant="ghost" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button form="fuel-form" type="submit" isLoading={isSubmitting}>
            {initialData ? 'Save Changes' : 'Create Entry'}
          </Button>
        </div>
      </div>
    </div>
  );
}
