import { z } from 'zod';
import { TripStatus, TripPriority } from '@prisma/client';

export const createTripSchema = z.object({
  body: z.object({
    tripName: z.string().optional(),
    tripType: z.string().optional(),
    customerId: z.string().uuid().optional(),
    origin: z.string().min(2, 'Origin is required'),
    destination: z.string().min(2, 'Destination is required'),
    intermediateStops: z.array(z.string()).optional(),
    scheduledStart: z.string().datetime(),
    scheduledEnd: z.string().datetime(),
    priority: z.nativeEnum(TripPriority).optional(),
    cargoDescription: z.string().optional(),
    cargoWeight: z.number().min(0).optional(),
    notes: z.string().optional(),
    driverId: z.string().uuid().optional(),
    vehicleId: z.string().uuid().optional(),
  }),
});

export const updateTripSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    tripName: z.string().optional(),
    tripType: z.string().optional(),
    customerId: z.string().uuid().optional(),
    origin: z.string().min(2).optional(),
    destination: z.string().min(2).optional(),
    intermediateStops: z.array(z.string()).optional(),
    scheduledStart: z.string().datetime().optional(),
    scheduledEnd: z.string().datetime().optional(),
    actualStart: z.string().datetime().optional().nullable(),
    actualEnd: z.string().datetime().optional().nullable(),
    status: z.nativeEnum(TripStatus).optional(),
    priority: z.nativeEnum(TripPriority).optional(),
    startOdometer: z.number().optional().nullable(),
    endOdometer: z.number().optional().nullable(),
    estimatedDistance: z.number().optional().nullable(),
    actualDistance: z.number().optional().nullable(),
    estimatedDuration: z.number().optional().nullable(),
    cargoDescription: z.string().optional().nullable(),
    cargoWeight: z.number().optional().nullable(),
    notes: z.string().optional().nullable(),
  }),
});

export const assignDriverSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    driverId: z.string().uuid(),
  }),
});

export const assignVehicleSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    vehicleId: z.string().uuid(),
  }),
});

export const updateTripStatusSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    status: z.nativeEnum(TripStatus),
    notes: z.string().optional(),
  }),
});

export type CreateTripDto = z.infer<typeof createTripSchema>['body'];
export type UpdateTripDto = z.infer<typeof updateTripSchema>['body'];
export type AssignDriverDto = z.infer<typeof assignDriverSchema>['body'];
export type AssignVehicleDto = z.infer<typeof assignVehicleSchema>['body'];
export type UpdateTripStatusDto = z.infer<typeof updateTripStatusSchema>['body'];
