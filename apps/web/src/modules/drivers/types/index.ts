// ─── Driver Types ─────────────────────────────────────────────────────────────

export type DriverStatus = 'AVAILABLE' | 'ON_TRIP' | 'ON_LEAVE' | 'SUSPENDED' | 'TERMINATED';

export type LicenseCategory =
  | 'CLASS_A'
  | 'CLASS_B'
  | 'CLASS_C'
  | 'CLASS_D'
  | 'HEAVY_RIGID'
  | 'COMBINATION';

export interface DriverUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string | null;
  status: string;
}

export interface DriverBranch {
  id: string;
  name: string;
  code?: string;
}

export interface AssignedVehicle {
  id: string;
  plateNumber: string;
  make: string;
  model: string;
  year?: number;
  type?: string;
  status?: string;
}

export interface DriverDocument {
  id: string;
  driverId: string;
  title: string;
  documentType: string;
  fileUrl: string;
  issuedDate?: string | null;
  expiryDate?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Driver {
  id: string;
  companyId: string;
  branchId?: string | null;
  userId: string;
  employeeId: string;
  photoUrl?: string | null;
  phone?: string | null;
  dateOfBirth?: string | null;
  gender?: string | null;
  bloodGroup?: string | null;
  nationality?: string | null;
  address?: string | null;
  emergencyContactName?: string | null;
  emergencyContactPhone?: string | null;
  emergencyContactRelation?: string | null;
  licenseNumber: string;
  licenseCategory: LicenseCategory;
  licenseIssuedDate?: string | null;
  licenseExpiry: string;
  licenseIssuingAuthority?: string | null;
  medicalCertificateUrl?: string | null;
  medicalExpiry?: string | null;
  fitnessStatus?: string | null;
  healthNotes?: string | null;
  assignedVehicleId?: string | null;
  status: DriverStatus;
  joinedDate: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  // Relations
  user: DriverUser;
  branch?: DriverBranch | null;
  assignedVehicle?: AssignedVehicle | null;
  documents?: DriverDocument[];
  _count?: { documents: number; trips: number };
}

export interface DriverStats {
  total: number;
  available: number;
  onTrip: number;
  suspended: number;
  expiringLicense: number;
  expiredLicense: number;
}

export interface DriverFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  branchId?: string;
  licenseCategory?: string;
  licenseExpiryDays?: number;
  medicalExpiryDays?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface TimelineEvent {
  id: string;
  action: string;
  entityType: string;
  entityId?: string | null;
  oldValues?: Record<string, any> | null;
  newValues?: Record<string, any> | null;
  createdAt: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string | null;
  } | null;
}

export type DocumentType =
  | 'DRIVER_LICENSE'
  | 'GOVERNMENT_ID'
  | 'MEDICAL_CERTIFICATE'
  | 'POLICE_VERIFICATION'
  | 'EXPERIENCE_CERTIFICATE'
  | 'TRAINING_CERTIFICATE'
  | 'INSURANCE'
  | 'OTHER';
