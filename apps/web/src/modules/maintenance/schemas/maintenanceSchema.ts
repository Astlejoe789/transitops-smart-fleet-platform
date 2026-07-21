import { z } from 'zod';

export const maintenanceSchema = z.object({
  vehicleId: z.string().min(1, 'Vehicle is required'),
  vendorId: z.string().optional(),
  assignedTechnicianId: z.string().optional(),
  maintenanceType: z.enum(['PREVENTIVE', 'CORRECTIVE', 'EMERGENCY', 'INSPECTION', 'WARRANTY', 'SCHEDULED_SERVICE'] as const),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const),
  description: z.string().min(3, 'Description must be at least 3 characters'),
  estimatedCost: z.number().min(0, 'Must be positive').optional(),
  scheduledDate: z.string().min(1, 'Scheduled Date is required'),
  estimatedDuration: z.number().min(1, 'Must be at least 1').optional(),
  odometerReading: z.number().min(0).optional(),
  notes: z.string().optional(),
});

export type MaintenanceFormData = z.infer<typeof maintenanceSchema>;
