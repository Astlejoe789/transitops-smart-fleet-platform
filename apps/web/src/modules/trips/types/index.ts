export type TripStatus = 
  | 'DRAFT'
  | 'SCHEDULED'
  | 'DRIVER_ASSIGNED'
  | 'VEHICLE_ASSIGNED'
  | 'READY_FOR_DISPATCH'
  | 'DISPATCHED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CLOSED'
  | 'CANCELLED'
  | 'DELAYED';

export type TripPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface Trip {
  id: string;
  tripNumber: string;
  tripName?: string | null;
  tripType?: string | null;
  companyId: string;
  branchId?: string | null;
  vehicleId?: string | null;
  driverId?: string | null;
  customerId?: string | null;
  origin: string;
  destination: string;
  intermediateStops?: string[] | null;
  status: TripStatus;
  priority: TripPriority;
  scheduledStart: string;
  scheduledEnd: string;
  actualStart?: string | null;
  actualEnd?: string | null;
  startOdometer?: number | null;
  endOdometer?: number | null;
  estimatedDistance?: number | null;
  actualDistance?: number | null;
  estimatedDuration?: number | null;
  cargoDescription?: string | null;
  cargoWeight?: number | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  
  // Relations
  driver?: {
    id: string;
    user: {
      firstName: string;
      lastName: string;
      avatarUrl?: string | null;
      email?: string;
      phone?: string;
    };
  } | null;
  vehicle?: {
    id: string;
    make: string;
    model: string;
    plateNumber: string;
  } | null;
  customer?: {
    id: string;
    name: string;
  } | null;
}

export interface DispatchBoardData {
  pending: Trip[];
  assigned: Trip[];
  active: Trip[];
  completed: Trip[];
}
