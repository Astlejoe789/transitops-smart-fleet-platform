import { ExpenseCategory, ExpenseStatus, PaymentMethod } from '@prisma/client';

export interface GetExpensesQuery {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  category?: ExpenseCategory;
  status?: ExpenseStatus;
  paymentMethod?: PaymentMethod;
  vehicleId?: string;
  driverId?: string;
  tripId?: string;
  startDate?: string;
  endDate?: string;
}

export interface CreateExpenseDTO {
  category: ExpenseCategory;
  amount: number;
  currency?: string;
  expenseDate?: Date;
  paymentMethod: PaymentMethod;
  vendorName?: string;
  description?: string;
  referenceNumber?: string;
  receiptNumber?: string;
  notes?: string;
  receiptUrl?: string;
  vehicleId?: string;
  driverId?: string;
  tripId?: string;
  maintenanceLogId?: string;
  fuelLogId?: string;
}

export interface UpdateExpenseDTO extends Partial<CreateExpenseDTO> {
  status?: ExpenseStatus;
}
