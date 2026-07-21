import { z } from 'zod';
import { ExpenseCategory, ExpenseStatus, PaymentMethod } from '@prisma/client';

export const createExpenseSchema = z.object({
  category: z.nativeEnum(ExpenseCategory),
  amount: z.number().positive(),
  currency: z.string().optional(),
  expenseDate: z.coerce.date().optional(),
  paymentMethod: z.nativeEnum(PaymentMethod),
  vendorName: z.string().optional(),
  description: z.string().optional(),
  referenceNumber: z.string().optional(),
  receiptNumber: z.string().optional(),
  notes: z.string().optional(),
  receiptUrl: z.string().optional(),
  vehicleId: z.string().uuid().optional(),
  driverId: z.string().uuid().optional(),
  tripId: z.string().uuid().optional(),
  maintenanceLogId: z.string().uuid().optional(),
  fuelLogId: z.string().uuid().optional(),
});

export const updateExpenseSchema = createExpenseSchema.partial().extend({
  status: z.nativeEnum(ExpenseStatus).optional(),
});

export const updateExpenseStatusSchema = z.object({
  status: z.nativeEnum(ExpenseStatus),
  notes: z.string().optional(),
});
