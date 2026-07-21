import { z } from 'zod';
import { MaintenanceStatus, MaintenanceType, MaintenancePriority } from '@prisma/client';

export const createMaintenanceSchema = z.object({
  body: z.object({
    vehicleId: z.string().uuid('Invalid vehicle ID'),
    vendorId: z.string().uuid().optional().nullable(),
    assignedTechnicianId: z.string().uuid().optional().nullable(),
    maintenanceType: z.nativeEnum(MaintenanceType),
    priority: z.nativeEnum(MaintenancePriority).optional().default(MaintenancePriority.MEDIUM),
    description: z.string().min(3, 'Description must be at least 3 characters'),
    estimatedCost: z.number().min(0).optional(),
    scheduledDate: z.string().datetime(),
    estimatedDuration: z.number().min(1).optional(),
    odometerReading: z.number().min(0).optional(),
    notes: z.string().optional(),
    checklist: z.any().optional(),
  }),
});

export const updateMaintenanceSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    vendorId: z.string().uuid().optional().nullable(),
    assignedTechnicianId: z.string().uuid().optional().nullable(),
    maintenanceType: z.nativeEnum(MaintenanceType).optional(),
    priority: z.nativeEnum(MaintenancePriority).optional(),
    description: z.string().min(3).optional(),
    estimatedCost: z.number().min(0).optional(),
    actualCost: z.number().min(0).optional(),
    scheduledDate: z.string().datetime().optional(),
    startDate: z.string().datetime().optional().nullable(),
    completedDate: z.string().datetime().optional().nullable(),
    estimatedDuration: z.number().min(1).optional(),
    actualDuration: z.number().min(1).optional(),
    odometerReading: z.number().min(0).optional(),
    warrantyStatus: z.string().optional(),
    invoiceReference: z.string().optional(),
    notes: z.string().optional(),
    checklist: z.any().optional(),
  }),
});

export const updateMaintenanceStatusSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    status: z.nativeEnum(MaintenanceStatus),
    notes: z.string().optional(),
  }),
});

export const assignTechnicianSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    technicianId: z.string().uuid('Invalid technician ID'),
  }),
});

// Parts Validation
export const createPartSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    name: z.string().min(1, 'Part name is required'),
    quantity: z.number().min(1, 'Quantity must be at least 1').default(1),
    unitCost: z.number().min(0, 'Unit cost must be positive'),
    supplierId: z.string().uuid().optional().nullable(),
    warranty: z.string().optional(),
    stockReference: z.string().optional(),
  }),
});

// Documents Validation
export const createDocumentSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    documentType: z.string().min(1, 'Document type is required'),
    fileUrl: z.string().url('Valid URL is required'),
  }),
});
