import { z } from 'zod';
import { ExpenseCategory, ExpenseStatus, PaymentMethod } from '../types';

export const expenseSchema = z.object({
  category: z.nativeEnum(ExpenseCategory),
  amount: z.coerce.number().positive('Amount must be greater than 0'),
  currency: z.string().default('USD'),
  expenseDate: z.string(),
  paymentMethod: z.nativeEnum(PaymentMethod),
  vendorName: z.string().optional(),
  description: z.string().optional(),
  referenceNumber: z.string().optional(),
  receiptNumber: z.string().optional(),
  notes: z.string().optional(),
  receiptUrl: z.string().optional(),
  vehicleId: z.string().uuid().optional().or(z.literal('')),
  driverId: z.string().uuid().optional().or(z.literal('')),
  tripId: z.string().uuid().optional().or(z.literal('')),
  status: z.nativeEnum(ExpenseStatus).optional(),
});

export type ExpenseFormValues = z.infer<typeof expenseSchema>;
