import { apiClient } from './client';

export interface Trip {
  id: string;
  tripNumber?: string;
  tripId?: string;
  origin: string;
  destination: string;
  driverId?: string;
  vehicleId?: string;
  status: string;
  priority?: string;
  cargoWeight?: number;
  estimatedDistance?: number;
  scheduledStart?: string;
  scheduledEnd?: string;
  startDate?: string;
  estimatedArrival?: string;
  driverName?: string;
  vehiclePlate?: string;
  driver?: { id: string; user: { firstName: string; lastName: string; avatarUrl?: string } };
  vehicle?: { id: string; plateNumber: string; make: string; model: string; payloadCapacity?: number };
}

export interface AvailableVehicle {
  id: string;
  plateNumber: string;
  make: string;
  model: string;
  year: number;
  type: string;
  payloadCapacity?: number;
  fuelType: string;
}

export interface AvailableDriver {
  id: string;
  licenseNumber: string;
  licenseCategory: string;
  status: string;
  user: { firstName: string; lastName: string; avatarUrl?: string };
}

export const getTrips = async (): Promise<Trip[]> => {
  try {
    const { data } = await apiClient.get('/api/trips?limit=100');
    return data?.data ?? data ?? [];
  } catch (err) {
    console.error('Error fetching trips:', err);
    return [];
  }
};

export const addTrip = async (tripData: Partial<Trip>): Promise<Trip | null> => {
  try {
    const { data } = await apiClient.post('/api/trips', tripData);
    return data?.data ?? data;
  } catch (err) {
    console.error('Error adding trip:', err);
    return null;
  }
};

export const updateTripStatus = async (id: string, status: string, notes?: string): Promise<Trip | null> => {
  try {
    const { data } = await apiClient.patch(`/api/trips/${id}/status`, { status, notes });
    return data?.data ?? data;
  } catch (err: any) {
    const message = err?.response?.data?.message ?? 'Failed to update trip status';
    throw new Error(message);
  }
};

export const getAvailableVehicles = async (): Promise<AvailableVehicle[]> => {
  try {
    const { data } = await apiClient.get('/api/trips/available-vehicles');
    return data?.data ?? [];
  } catch (err) {
    console.error('Error fetching available vehicles:', err);
    return [];
  }
};

export const getAvailableDrivers = async (): Promise<AvailableDriver[]> => {
  try {
    const { data } = await apiClient.get('/api/trips/available-drivers');
    return data?.data ?? [];
  } catch (err) {
    console.error('Error fetching available drivers:', err);
    return [];
  }
};
