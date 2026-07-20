import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useCreateVehicle, useUpdateVehicle, type Vehicle } from '../hooks/useFleet';

const vehicleSchema = z.object({
  make: z.string().min(2, 'Make is required'),
  model: z.string().min(2, 'Model is required'),
  year: z.coerce.number().int().min(1980).max(new Date().getFullYear() + 1),
  vin: z.string().min(5, 'VIN is required'),
  plateNumber: z.string().min(2, 'Plate number is required'),
  type: z.string(),
  fuelType: z.string(),
  status: z.string(),
  currentOdometer: z.coerce.number().min(0).optional(),
  color: z.string().optional(),
});

type VehicleFormData = z.infer<typeof vehicleSchema>;

interface VehicleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle?: Vehicle | null;
}

export function VehicleFormModal({ isOpen, onClose, vehicle }: VehicleFormModalProps) {
  const isEditing = !!vehicle;
  
  const createMutation = useCreateVehicle();
  const updateMutation = useUpdateVehicle(vehicle?.id || '');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      make: '',
      model: '',
      year: new Date().getFullYear(),
      vin: '',
      plateNumber: '',
      type: 'TRUCK',
      fuelType: 'DIESEL',
      status: 'AVAILABLE',
      currentOdometer: 0,
      color: '',
    },
  });

  useEffect(() => {
    if (isOpen && vehicle) {
      reset({
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        vin: vehicle.vin,
        plateNumber: vehicle.plateNumber,
        type: vehicle.type,
        fuelType: vehicle.fuelType,
        status: vehicle.status,
        currentOdometer: vehicle.currentOdometer,
        color: vehicle.color || '',
      });
    } else if (isOpen && !vehicle) {
      reset({
        make: '',
        model: '',
        year: new Date().getFullYear(),
        vin: '',
        plateNumber: '',
        type: 'TRUCK',
        fuelType: 'DIESEL',
        status: 'AVAILABLE',
        currentOdometer: 0,
        color: '',
      });
    }
  }, [isOpen, vehicle, reset]);

  const onSubmit = async (data: VehicleFormData) => {
    try {
      if (isEditing) {
        await updateMutation.mutateAsync(data);
      } else {
        await createMutation.mutateAsync(data);
      }
      onClose();
    } catch (error) {
      console.error('Failed to save vehicle:', error);
      // We could add toast notification here
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Vehicle' : 'Add New Vehicle'}
      description={isEditing ? 'Update vehicle details.' : 'Enter details to register a new vehicle in your fleet.'}
    >
      <form id="vehicle-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-surface-700 dark:text-surface-300">Make</label>
            <Input {...register('make')} placeholder="e.g. Ford" error={!!errors.make} />
            {errors.make && <p className="text-xs text-red-500">{errors.make.message}</p>}
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-medium text-surface-700 dark:text-surface-300">Model</label>
            <Input {...register('model')} placeholder="e.g. Transit" error={!!errors.model} />
            {errors.model && <p className="text-xs text-red-500">{errors.model.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-surface-700 dark:text-surface-300">Year</label>
            <Input type="number" {...register('year')} error={!!errors.year} />
            {errors.year && <p className="text-xs text-red-500">{errors.year.message}</p>}
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-medium text-surface-700 dark:text-surface-300">Color</label>
            <Input {...register('color')} placeholder="e.g. White" error={!!errors.color} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-surface-700 dark:text-surface-300">VIN</label>
            <Input {...register('vin')} placeholder="17-character VIN" error={!!errors.vin} />
            {errors.vin && <p className="text-xs text-red-500">{errors.vin.message}</p>}
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-medium text-surface-700 dark:text-surface-300">Plate Number</label>
            <Input {...register('plateNumber')} placeholder="License Plate" error={!!errors.plateNumber} />
            {errors.plateNumber && <p className="text-xs text-red-500">{errors.plateNumber.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-surface-700 dark:text-surface-300">Type</label>
            <Select {...register('type')} error={!!errors.type}>
              <option value="TRUCK">Truck</option>
              <option value="VAN">Van</option>
              <option value="CAR">Car</option>
              <option value="BUS">Bus</option>
              <option value="MOTORCYCLE">Motorcycle</option>
              <option value="TRAILER">Trailer</option>
            </Select>
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-medium text-surface-700 dark:text-surface-300">Fuel Type</label>
            <Select {...register('fuelType')} error={!!errors.fuelType}>
              <option value="DIESEL">Diesel</option>
              <option value="GASOLINE">Gasoline</option>
              <option value="ELECTRIC">Electric</option>
              <option value="HYBRID">Hybrid</option>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-surface-700 dark:text-surface-300">Status</label>
            <Select {...register('status')} error={!!errors.status}>
              <option value="AVAILABLE">Available</option>
              <option value="IN_TRANSIT">In Transit</option>
              <option value="MAINTENANCE">Maintenance</option>
              <option value="OUT_OF_SERVICE">Out of Service</option>
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-surface-700 dark:text-surface-300">Current Odometer (km)</label>
            <Input type="number" {...register('currentOdometer')} error={!!errors.currentOdometer} />
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-2 pt-4">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            isLoading={isSubmitting || createMutation.isPending || updateMutation.isPending}
          >
            {isEditing ? 'Save Changes' : 'Create Vehicle'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
