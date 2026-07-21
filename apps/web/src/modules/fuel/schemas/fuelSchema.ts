import { z } from 'zod';
import { FuelType, PaymentMethod } from '../types';

export const fuelSchema = z.object({
  vehicleId: z.string().min(1, 'Vehicle is required'),
  driverId: z.string().min(1, 'Driver is required'),
  tripId: z.string().optional(),
  fuelType: z.nativeEnum(FuelType, { required_error: 'Fuel type is required' }),
  fuelGrade: z.string().optional(),
  paymentMethod: z.nativeEnum(PaymentMethod, { required_error: 'Payment method is required' }),
  fuelDate: z.string().min(1, 'Date is required'),
  liters: z.number().min(0.1, 'Liters must be greater than 0'),
  costPerLiter: z.number().min(0, 'Cost per liter cannot be negative'),
  odometerReading: z.number().min(0, 'Odometer reading cannot be negative'),
  stationName: z.string().optional(),
  location: z.string().optional(),
  receiptNumber: z.string().optional(),
  receiptUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  remarks: z.string().optional(),
});

export type FuelFormValues = z.infer<typeof fuelSchema>;
