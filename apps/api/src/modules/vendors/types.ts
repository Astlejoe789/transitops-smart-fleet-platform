import { VendorType, VendorStatus } from '@prisma/client';

export interface CreateVendorDTO {
  name: string;
  type?: VendorType;
  taxId?: string;
  registrationNumber?: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  status?: VendorStatus;
  paymentTerms?: string;
  bankDetails?: string;
  notes?: string;
  isActive?: boolean;
}

export interface UpdateVendorDTO extends Partial<CreateVendorDTO> {}

export interface CreateVendorContactDTO {
  name: string;
  designation?: string;
  department?: string;
  email: string;
  phone?: string;
  mobile?: string;
  isPrimary?: boolean;
}

export interface CreateVendorDocumentDTO {
  title: string;
  documentType: string;
  fileUrl: string;
  expiryDate?: Date | string;
}

export interface CreateVendorRatingDTO {
  overall: number;
  quality: number;
  cost: number;
  timeliness: number;
  communication: number;
  reliability: number;
  reviewNotes?: string;
}

export interface CreateVendorServiceDTO {
  serviceType: string;
  cost?: number;
  lastServiceDate?: Date | string;
  contractExpiry?: Date | string;
  frequency?: string;
}

export interface GetVendorsQuery {
  page?: string;
  limit?: string;
  search?: string;
  status?: string;
  type?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
