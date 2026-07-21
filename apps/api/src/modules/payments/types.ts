import { PaymentMethod } from '@prisma/client';

export interface RecordPaymentDTO {
  invoiceId: string;
  amount: number;
  paymentDate?: string | Date;
  paymentMethod: PaymentMethod;
  referenceNumber?: string;
  notes?: string;
}

export interface GetPaymentsQuery {
  page?: string;
  limit?: string;
  search?: string;
  invoiceId?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
