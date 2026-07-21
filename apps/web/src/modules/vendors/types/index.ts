import type { MaintenanceLog } from '@/modules/maintenance/types';

export enum VendorType {
  FUEL = 'FUEL',
  MAINTENANCE = 'MAINTENANCE',
  PARTS = 'PARTS',
  INSURANCE = 'INSURANCE',
  CLEANING = 'CLEANING',
  ROADSIDE_ASSISTANCE = 'ROADSIDE_ASSISTANCE',
  TYRES = 'TYRES',
  BATTERY = 'BATTERY',
  OTHER = 'OTHER',
}

export enum VendorStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BLACKLISTED = 'BLACKLISTED',
}

export interface VendorContact {
  id: string;
  vendorId: string;
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

export interface VendorDocument {
  id: string;
  vendorId: string;
  title: string;
  documentType: string;
  fileUrl: string;
  expiryDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VendorService {
  id: string;
  vendorId: string;
  serviceType: string;
  cost?: number;
  lastServiceDate?: string;
  contractExpiry?: string;
  frequency?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VendorRating {
  id: string;
  vendorId: string;
  overall: number;
  quality: number;
  cost: number;
  timeliness: number;
  communication: number;
  reliability: number;
  reviewNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Vendor {
  id: string;
  companyId: string;
  vendorNumber: string;
  name: string;
  type: VendorType;
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
  status: VendorStatus;
  paymentTerms?: string;
  bankDetails?: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;

  contacts?: VendorContact[];
  documents?: VendorDocument[];
  services?: VendorService[];
  ratings?: VendorRating[];
  maintenanceLogs?: MaintenanceLog[];

  _count?: {
    services: number;
    maintenanceLogs: number;
    maintenanceParts: number;
    ratings: number;
  };
}
