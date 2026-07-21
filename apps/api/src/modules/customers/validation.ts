import { z } from 'zod';
import { CustomerType, CustomerStatus } from '@prisma/client';

export const createCustomerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  type: z.nativeEnum(CustomerType).optional(),
  industry: z.string().optional(),
  taxId: z.string().optional(),
  registrationNumber: z.string().optional(),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  mobile: z.string().optional(),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  billingAddress: z.string().optional(),
  shippingAddress: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  postalCode: z.string().optional(),
  creditLimit: z.number().nonnegative('Credit limit must be positive').optional(),
  paymentTerms: z.string().optional(),
  status: z.nativeEnum(CustomerStatus).optional(),
  notes: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const updateCustomerSchema = createCustomerSchema.partial();

export const createCustomerContactSchema = z.object({
  name: z.string().min(2),
  designation: z.string().optional(),
  department: z.string().optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  mobile: z.string().optional(),
  isPrimary: z.boolean().optional()
});

export const updateCustomerContactSchema = createCustomerContactSchema.partial();

export const createCustomerDocumentSchema = z.object({
  title: z.string().min(2),
  documentType: z.string().min(2),
  fileUrl: z.string().url(),
  expiryDate: z.string().datetime().optional()
});
