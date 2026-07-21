import { z } from 'zod';
import { DriverStatus, LicenseCategory } from '@prisma/client';

// ─── Create Driver Schema ────────────────────────────────────────────────────
export const createDriverSchema = z.object({
  body: z.object({
    // Personal
    firstName: z.string().min(2, 'First name is required'),
    lastName: z.string().min(2, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(7, 'Phone number is required'),
    employeeId: z.string().min(2, 'Employee ID is required'),
    photoUrl: z.string().url().optional().nullable(),
    dateOfBirth: z.string().datetime().optional().nullable(),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional().nullable(),
    bloodGroup: z.string().optional().nullable(),
    nationality: z.string().optional().nullable(),
    address: z.string().optional().nullable(),
    branchId: z.string().uuid().optional().nullable(),
    joinedDate: z.string().datetime().optional().nullable(),
    status: z.nativeEnum(DriverStatus).optional(),

    // Emergency Contact
    emergencyContactName: z.string().optional().nullable(),
    emergencyContactPhone: z.string().optional().nullable(),
    emergencyContactRelation: z.string().optional().nullable(),

    // License
    licenseNumber: z.string().min(4, 'License number is required'),
    licenseCategory: z.nativeEnum(LicenseCategory),
    licenseIssuedDate: z.string().datetime().optional().nullable(),
    licenseExpiry: z.string().datetime({ message: 'License expiry is required' }),
    licenseIssuingAuthority: z.string().optional().nullable(),

    // Medical
    medicalCertificateUrl: z.string().url().optional().nullable(),
    medicalExpiry: z.string().datetime().optional().nullable(),
    fitnessStatus: z.string().optional().nullable(),
    healthNotes: z.string().optional().nullable(),
  }),
});

// ─── Update Driver Schema ────────────────────────────────────────────────────
export const updateDriverSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid driver ID'),
  }),
  body: z.object({
    // Personal
    firstName: z.string().min(2).optional(),
    lastName: z.string().min(2).optional(),
    email: z.string().email().optional(),
    phone: z.string().min(7).optional(),
    employeeId: z.string().min(2).optional(),
    photoUrl: z.string().url().optional().nullable(),
    dateOfBirth: z.string().datetime().optional().nullable(),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional().nullable(),
    bloodGroup: z.string().optional().nullable(),
    nationality: z.string().optional().nullable(),
    address: z.string().optional().nullable(),
    branchId: z.string().uuid().optional().nullable(),
    joinedDate: z.string().datetime().optional().nullable(),
    status: z.nativeEnum(DriverStatus).optional(),

    // Emergency Contact
    emergencyContactName: z.string().optional().nullable(),
    emergencyContactPhone: z.string().optional().nullable(),
    emergencyContactRelation: z.string().optional().nullable(),

    // License
    licenseNumber: z.string().min(4).optional(),
    licenseCategory: z.nativeEnum(LicenseCategory).optional(),
    licenseIssuedDate: z.string().datetime().optional().nullable(),
    licenseExpiry: z.string().datetime().optional(),
    licenseIssuingAuthority: z.string().optional().nullable(),

    // Medical
    medicalCertificateUrl: z.string().url().optional().nullable(),
    medicalExpiry: z.string().datetime().optional().nullable(),
    fitnessStatus: z.string().optional().nullable(),
    healthNotes: z.string().optional().nullable(),
  }),
});

// ─── Create Document Schema ──────────────────────────────────────────────────
export const createDocumentSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid driver ID'),
  }),
  body: z.object({
    title: z.string().min(3, 'Document title is required'),
    documentType: z.string().min(2, 'Document type is required'),
    fileUrl: z.string().url('File URL must be a valid URL'),
    issuedDate: z.string().datetime().optional().nullable(),
    expiryDate: z.string().datetime().optional().nullable(),
  }),
});

// ─── Assign Vehicle Schema ───────────────────────────────────────────────────
export const assignVehicleSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid driver ID'),
  }),
  body: z.object({
    vehicleId: z.string().uuid('Invalid vehicle ID'),
  }),
});

// ─── Exported Types ──────────────────────────────────────────────────────────
export type CreateDriverDto = z.infer<typeof createDriverSchema>['body'];
export type UpdateDriverDto = z.infer<typeof updateDriverSchema>['body'];
export type CreateDriverDocumentDto = z.infer<typeof createDocumentSchema>['body'];
export type AssignVehicleDto = z.infer<typeof assignVehicleSchema>['body'];
