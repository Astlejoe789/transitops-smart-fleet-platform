import type { User } from '@/types';

export enum ExpenseCategory {
  FUEL = 'FUEL',
  MAINTENANCE = 'MAINTENANCE',
  REPAIRS = 'REPAIRS',
  TOLL = 'TOLL',
  PARKING = 'PARKING',
  DRIVER_ALLOWANCE = 'DRIVER_ALLOWANCE',
  PERMIT = 'PERMIT',
  INSURANCE = 'INSURANCE',
  REGISTRATION = 'REGISTRATION',
  SALARY = 'SALARY',
  CLEANING = 'CLEANING',
  OFFICE = 'OFFICE',
  UTILITIES = 'UTILITIES',
  EQUIPMENT = 'EQUIPMENT',
  TAXES = 'TAXES',
  MISCELLANEOUS = 'MISCELLANEOUS',
  OTHER = 'OTHER'
}

export enum ExpenseStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  PAID = 'PAID'
}

export enum PaymentMethod {
  BANK_TRANSFER = 'BANK_TRANSFER',
  CREDIT_CARD = 'CREDIT_CARD',
  CASH = 'CASH',
  CHECK = 'CHECK',
  DIGITAL_WALLET = 'DIGITAL_WALLET',
  CORPORATE_CARD = 'CORPORATE_CARD',
  FUEL_CARD = 'FUEL_CARD',
  UPI = 'UPI',
  OTHER = 'OTHER'
}

export interface ExpenseDocument {
  id: string;
  expenseId: string;
  title: string;
  documentType: string;
  fileUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface Expense {
  id: string;
  companyId: string;
  branchId?: string;
  expenseNumber: string;
  category: ExpenseCategory;
  status: ExpenseStatus;
  vehicleId?: string;
  driverId?: string;
  tripId?: string;
  maintenanceLogId?: string;
  fuelLogId?: string;
  amount: number;
  currency: string;
  expenseDate: string;
  paymentMethod: PaymentMethod;
  vendorName?: string;
  description?: string;
  referenceNumber?: string;
  receiptNumber?: string;
  notes?: string;
  receiptUrl?: string;
  approvedById?: string;
  createdById?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;

  // Relations
  vehicle?: any;
  driver?: any;
  trip?: any;
  maintenanceLog?: any;
  fuelLog?: any;
  approvedBy?: User;
  createdBy?: User;
  documents?: ExpenseDocument[];
}

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

export interface ExpenseDashboardData {
  todayExpenses: number;
  monthlyExpenses: number;
  pendingApprovals: number;
  approvedExpenses: number;
  paidExpenses: number;
  topCategories: { category: string; amount: number }[];
}

export interface ExpenseAnalyticsData {
  categoryBreakdown: { category: string; amount: number }[];
  trend: { month: string; amount: number }[];
}
