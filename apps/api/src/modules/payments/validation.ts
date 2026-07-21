import { z } from 'zod';
import { PaymentMethod } from '@prisma/client';

export const recordPaymentSchema = z.object({
  invoiceId: z.string().uuid('Invalid invoice ID'),
  amount: z.number().positive('Payment amount must be positive'),
  paymentDate: z.string().datetime().optional(),
  paymentMethod: z.nativeEnum(PaymentMethod),
  referenceNumber: z.string().optional(),
  receiptUrl: z.string().url('Invalid URL').optional(),
  notes: z.string().optional(),
});
