import { z } from 'zod';

export const invoiceItemSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  quantity: z.number().positive('Quantity must be positive'),
  unitPrice: z.number().nonnegative('Unit price must be non-negative'),
});

export const createInvoiceSchema = z.object({
  customerId: z.string().uuid('Invalid customer ID'),
  tripId: z.string().uuid('Invalid trip ID').optional(),
  branchId: z.string().uuid('Invalid branch ID').optional(),
  dueDate: z.string().datetime({ message: 'Invalid due date' }),
  taxAmount: z.number().nonnegative().optional(),
  discountAmount: z.number().nonnegative().optional(),
  notes: z.string().optional(),
  items: z.array(invoiceItemSchema).min(1, 'At least one line item is required'),
});

export const updateInvoiceSchema = z.object({
  dueDate: z.string().datetime().optional(),
  taxAmount: z.number().nonnegative().optional(),
  discountAmount: z.number().nonnegative().optional(),
  notes: z.string().optional(),
  items: z.array(invoiceItemSchema).min(1).optional(),
});

export const generateFromTripSchema = z.object({
  tripId: z.string().uuid('Invalid trip ID'),
});
