import { z } from 'zod';
import { VendorType, VendorStatus } from '@prisma/client';

export const createVendorSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  type: z.nativeEnum(VendorType).optional(),
  taxId: z.string().optional(),
  registrationNumber: z.string().optional(),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().optional(),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  postalCode: z.string().optional(),
  status: z.nativeEnum(VendorStatus).optional(),
  paymentTerms: z.string().optional(),
  bankDetails: z.string().optional(),
  notes: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const updateVendorSchema = createVendorSchema.partial();

export const createVendorContactSchema = z.object({
  name: z.string().min(2),
  designation: z.string().optional(),
  department: z.string().optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  mobile: z.string().optional(),
  isPrimary: z.boolean().optional()
});

export const createVendorDocumentSchema = z.object({
  title: z.string().min(2),
  documentType: z.string().min(2),
  fileUrl: z.string().url(),
  expiryDate: z.string().datetime().optional()
});

export const createVendorRatingSchema = z.object({
  overall: z.number().min(1).max(5),
  quality: z.number().min(1).max(5),
  cost: z.number().min(1).max(5),
  timeliness: z.number().min(1).max(5),
  communication: z.number().min(1).max(5),
  reliability: z.number().min(1).max(5),
  reviewNotes: z.string().optional()
});

export const createVendorServiceSchema = z.object({
  serviceType: z.string().min(2),
  cost: z.number().nonnegative().optional(),
  lastServiceDate: z.string().datetime().optional(),
  contractExpiry: z.string().datetime().optional(),
  frequency: z.string().optional()
});
