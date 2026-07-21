import { z } from 'zod';

const DRIVER_STATUSES = ['AVAILABLE', 'ON_TRIP', 'ON_LEAVE', 'SUSPENDED', 'TERMINATED'] as const;
const LICENSE_CATEGORIES = ['CLASS_A', 'CLASS_B', 'CLASS_C', 'CLASS_D', 'HEAVY_RIGID', 'COMBINATION'] as const;

export const driverFormSchema = z.object({
  // Personal Information
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(7, 'Phone number is required'),
  employeeId: z.string().min(2, 'Employee ID is required'),
  photoUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')).nullable(),
  dateOfBirth: z.string().optional().nullable(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional().nullable(),
  bloodGroup: z.string().optional().nullable(),
  nationality: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  branchId: z.string().uuid('Invalid branch').optional().nullable(),
  joinedDate: z.string().optional().nullable(),
  status: z.enum(DRIVER_STATUSES).default('AVAILABLE'),

  // Emergency Contact
  emergencyContactName: z.string().optional().nullable(),
  emergencyContactPhone: z.string().optional().nullable(),
  emergencyContactRelation: z.string().optional().nullable(),

  // License Information
  licenseNumber: z.string().min(4, 'License number is required'),
  licenseCategory: z.enum(LICENSE_CATEGORIES, { required_error: 'License category is required' }),
  licenseIssuedDate: z.string().optional().nullable(),
  licenseExpiry: z.string().min(1, 'License expiry date is required'),
  licenseIssuingAuthority: z.string().optional().nullable(),

  // Medical Information
  medicalCertificateUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')).nullable(),
  medicalExpiry: z.string().optional().nullable(),
  fitnessStatus: z.string().optional().nullable(),
  healthNotes: z.string().optional().nullable(),
});

export type DriverFormData = z.infer<typeof driverFormSchema>;

export const documentFormSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  documentType: z.string().min(1, 'Document type is required'),
  fileUrl: z.string().url('Must be a valid URL'),
  issuedDate: z.string().optional().nullable(),
  expiryDate: z.string().optional().nullable(),
});

export type DocumentFormData = z.infer<typeof documentFormSchema>;
