import { z } from 'zod';
import { FuelType, PaymentMethod } from '@prisma/client';

export const createFuelLogSchema = z.object({
  body: z.object({
    vehicleId: z.string().uuid('Invalid vehicle ID'),
    driverId: z.string().uuid('Invalid driver ID'),
    tripId: z.string().uuid('Invalid trip ID').optional().nullable(),
    fuelType: z.nativeEnum(FuelType),
    fuelGrade: z.string().optional().nullable(),
    paymentMethod: z.nativeEnum(PaymentMethod),
    fuelDate: z.string().datetime(),
    liters: z.number().positive('Liters must be positive'),
    costPerLiter: z.number().min(0, 'Cost per liter cannot be negative'),
    odometerReading: z.number().min(0, 'Odometer reading cannot be negative'),
    stationName: z.string().optional().nullable(),
    location: z.string().optional().nullable(),
    receiptNumber: z.string().optional().nullable(),
    receiptUrl: z.string().url('Invalid receipt URL').optional().nullable(),
    remarks: z.string().optional().nullable(),
  }),
});

export const updateFuelLogSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    vehicleId: z.string().uuid().optional(),
    driverId: z.string().uuid().optional(),
    tripId: z.string().uuid().optional().nullable(),
    fuelType: z.nativeEnum(FuelType).optional(),
    fuelGrade: z.string().optional().nullable(),
    paymentMethod: z.nativeEnum(PaymentMethod).optional(),
    fuelDate: z.string().datetime().optional(),
    liters: z.number().positive().optional(),
    costPerLiter: z.number().min(0).optional(),
    odometerReading: z.number().min(0).optional(),
    stationName: z.string().optional().nullable(),
    location: z.string().optional().nullable(),
    receiptNumber: z.string().optional().nullable(),
    receiptUrl: z.string().url().optional().nullable(),
    remarks: z.string().optional().nullable(),
  }),
});
