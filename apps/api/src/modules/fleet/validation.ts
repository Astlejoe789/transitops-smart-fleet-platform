import { z } from 'zod';
import { VehicleType, FuelType, VehicleStatus } from '@prisma/client';

export const createVehicleSchema = z.object({
  body: z.object({
    branchId: z.string().uuid().optional().nullable(),
    make: z.string().min(2, 'Make is required'),
    model: z.string().min(2, 'Model is required'),
    year: z.number().int().min(1980).max(new Date().getFullYear() + 1),
    vin: z.string().min(5, 'VIN must be at least 5 characters'),
    plateNumber: z.string().min(2, 'Plate number is required'),
    type: z.nativeEnum(VehicleType),
    fuelType: z.nativeEnum(FuelType),
    status: z.nativeEnum(VehicleStatus).optional(),
    currentOdometer: z.number().min(0).optional(),
    fuelCapacity: z.number().min(0).optional().nullable(),
    payloadCapacity: z.number().min(0).optional().nullable(),
    color: z.string().optional().nullable(),
    purchaseDate: z.string().datetime().optional().nullable(),
    insuranceExpiry: z.string().datetime().optional().nullable(),
  }),
});

export const updateVehicleSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid vehicle ID'),
  }),
  body: z.object({
    branchId: z.string().uuid().optional().nullable(),
    make: z.string().min(2).optional(),
    model: z.string().min(2).optional(),
    year: z.number().int().min(1980).max(new Date().getFullYear() + 1).optional(),
    vin: z.string().min(5).optional(),
    plateNumber: z.string().min(2).optional(),
    type: z.nativeEnum(VehicleType).optional(),
    fuelType: z.nativeEnum(FuelType).optional(),
    status: z.nativeEnum(VehicleStatus).optional(),
    currentOdometer: z.number().min(0).optional(),
    fuelCapacity: z.number().min(0).optional().nullable(),
    payloadCapacity: z.number().min(0).optional().nullable(),
    color: z.string().optional().nullable(),
    purchaseDate: z.string().datetime().optional().nullable(),
    insuranceExpiry: z.string().datetime().optional().nullable(),
  }),
});

export const createDocumentSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid vehicle ID'),
  }),
  body: z.object({
    title: z.string().min(3),
    documentType: z.string(),
    fileUrl: z.string().url(),
    issuedDate: z.string().datetime().optional().nullable(),
    expiryDate: z.string().datetime().optional().nullable(),
  }),
});

export type CreateVehicleDto = z.infer<typeof createVehicleSchema>['body'];
export type UpdateVehicleDto = z.infer<typeof updateVehicleSchema>['body'];
export type CreateDocumentDto = z.infer<typeof createDocumentSchema>['body'];
