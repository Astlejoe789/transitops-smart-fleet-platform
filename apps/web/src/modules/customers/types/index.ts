import type { Trip } from '@/modules/trips/types';

export enum CustomerType {
  CORPORATE = 'CORPORATE',
  INDIVIDUAL = 'INDIVIDUAL',
  GOVERNMENT = 'GOVERNMENT',
  OTHER = 'OTHER',
}

export enum CustomerStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  LEAD = 'LEAD',
  CHURNED = 'CHURNED',
}

export interface CustomerContact {
  id: string;
  customerId: string;
  name: string;
  designation?: string;
  department?: string;
  email: string;
  phone?: string;
  mobile?: string;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerDocument {
  id: string;
  customerId: string;
  title: string;
  documentType: string;
  fileUrl: string;
  expiryDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  companyId: string;
  customerNumber: string;
  name: string;
  type: CustomerType;
  industry?: string;
  taxId?: string;
  registrationNumber?: string;
  email: string;
  phone?: string;
  mobile?: string;
  website?: string;
  billingAddress?: string;
  shippingAddress?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  creditLimit?: number;
  paymentTerms?: string;
  status: CustomerStatus;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;

  contacts?: CustomerContact[];
  documents?: CustomerDocument[];
  trips?: Trip[];
  _count?: {
    trips: number;
    invoices: number;
    contacts: number;
  };
}
