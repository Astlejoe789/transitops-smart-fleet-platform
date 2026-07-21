export enum InvoiceStatus {
  DRAFT = 'DRAFT',
  ISSUED = 'ISSUED',
  PARTIALLY_PAID = 'PARTIALLY_PAID',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  VOID = 'VOID',
  CANCELLED = 'CANCELLED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
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
  OTHER = 'OTHER',
}

export interface InvoiceItem {
  id: string;
  invoiceId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  companyId: string;
  invoiceId: string;
  paymentNumber: string;
  amount: number;
  paymentDate: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  referenceNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  invoice?: {
    id: string;
    invoiceNumber: string;
    totalAmount: number;
    customer?: { id: string; name: string };
  };
}

export interface Invoice {
  id: string;
  companyId: string;
  branchId?: string;
  customerId: string;
  tripId?: string;
  invoiceNumber: string;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  customer?: { id: string; name: string; email: string };
  trip?: { id: string; tripNumber: string; origin: string; destination: string };
  items?: InvoiceItem[];
  payments?: Payment[];
  _count?: { items: number; payments: number };
}

export interface InvoiceSummary {
  outstanding: { amount: number; count: number };
  overdue: { amount: number; count: number };
  paidMtd: { amount: number; count: number };
  drafts: number;
}

export interface PaymentSummary {
  collectedMtd: { amount: number; count: number };
  pending: { amount: number; count: number };
  refunded: { amount: number; count: number };
}
