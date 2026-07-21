import { CustomerType, CustomerStatus } from '@prisma/client';

export interface CreateCustomerDTO {
  name: string;
  type?: CustomerType;
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
  status?: CustomerStatus;
  notes?: string;
  isActive?: boolean;
}

export interface UpdateCustomerDTO extends Partial<CreateCustomerDTO> {}

export interface CreateCustomerContactDTO {
  name: string;
  designation?: string;
  department?: string;
  email: string;
  phone?: string;
  mobile?: string;
  isPrimary?: boolean;
}

export interface CreateCustomerDocumentDTO {
  title: string;
  documentType: string;
  fileUrl: string;
  expiryDate?: Date | string;
}

export interface GetCustomersQuery {
  page?: string;
  limit?: string;
  search?: string;
  status?: string;
  type?: string;
  industry?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
