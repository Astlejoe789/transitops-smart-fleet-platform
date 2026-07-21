import { z } from 'zod';

export const tripSchema = z.object({
  tripName: z.string().optional(),
  tripType: z.string().optional(),
  origin: z.string().min(2, 'Origin is required'),
  destination: z.string().min(2, 'Destination is required'),
  scheduledStart: z.string().min(1, 'Start date is required'),
  scheduledEnd: z.string().min(1, 'End date is required'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT'] as const).default('MEDIUM'),
  cargoDescription: z.string().optional(),
  cargoWeight: z.coerce.number().min(0, 'Weight must be positive').optional().or(z.literal('')),
  notes: z.string().optional(),
});

export type TripFormData = z.infer<typeof tripSchema>;
