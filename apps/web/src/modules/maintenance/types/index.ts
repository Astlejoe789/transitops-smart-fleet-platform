export type MaintenanceStatus =
  | 'SCHEDULED'
  | 'TECHNICIAN_ASSIGNED'
  | 'IN_PROGRESS'
  | 'WAITING_FOR_PARTS'
  | 'COMPLETED'
  | 'VERIFIED'
  | 'CLOSED'
  | 'CANCELLED';

export type MaintenanceType =
  | 'PREVENTIVE'
  | 'CORRECTIVE'
  | 'EMERGENCY'
  | 'INSPECTION'
  | 'WARRANTY'
  | 'SCHEDULED_SERVICE';

export type MaintenancePriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface MaintenancePart {
  id: string;
  maintenanceLogId: string;
  name: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  supplierId: string | null;
  warranty: string | null;
  stockReference: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MaintenanceDocument {
  id: string;
  maintenanceLogId: string;
  title: string;
  documentType: string;
  fileUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface MaintenanceLog {
  id: string;
  companyId: string;
  vehicleId: string;
  vendorId: string | null;
  assignedTechnicianId: string | null;
  maintenanceId: string;
  maintenanceType: MaintenanceType;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  description: string;
  estimatedCost: number;
  actualCost: number;
  scheduledDate: string;
  startDate: string | null;
  completedDate: string | null;
  estimatedDuration: number | null;
  actualDuration: number | null;
  odometerReading: number | null;
  warrantyStatus: string | null;
  invoiceReference: string | null;
  notes: string | null;
  checklist: any;
  createdAt: string;
  updatedAt: string;

  // Includes
  vehicle?: {
    plateNumber: string;
    make: string;
    model: string;
  };
  vendor?: {
    name: string;
  };
  assignedTechnician?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  parts?: MaintenancePart[];
  documents?: MaintenanceDocument[];
}
