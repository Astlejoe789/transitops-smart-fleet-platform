import { apiClient } from './client';

export interface Vehicle {
  id: string;
  plate?: string;
  plateNumber?: string;
  make: string;
  model: string;
  year: number;
  type: string;
  status: string;
  odometer?: number;
  currentOdometer?: number;
  capacity?: number;
  payloadCapacity?: number;
  fuel?: string;
  fuelType?: string;
  insurance?: string;
  insuranceExpiry?: string;
  vin?: string;
  acquisitionCost?: number;
}

export const getVehicles = async (): Promise<Vehicle[]> => {
  try {
    const { data } = await apiClient.get('/api/fleet/vehicles?limit=100');
    const list = data?.data ?? data;
    // Normalize API fields → frontend fields
    return (Array.isArray(list) ? list : []).map((v: any) => ({
      ...v,
      plate: v.plateNumber ?? v.plate,
      odometer: v.currentOdometer ?? v.odometer ?? 0,
      capacity: v.payloadCapacity ?? v.capacity ?? 0,
      fuel: v.fuelType ?? v.fuel,
      insurance: v.insuranceExpiry ? new Date(v.insuranceExpiry).toISOString().split('T')[0] : v.insurance ?? '—',
    }));
  } catch (err) {
    console.error('Error fetching vehicles:', err);
    return [];
  }
};

export const addVehicle = async (vehicleData: Partial<Vehicle>): Promise<Vehicle | null> => {
  try {
    const { data } = await apiClient.post('/api/fleet/vehicles', vehicleData);
    return data?.data ?? data;
  } catch (err: any) {
    const message = err?.response?.data?.message ?? 'Failed to add vehicle';
    throw new Error(message);
  }
};

export const updateVehicle = async (id: string, vehicleData: Partial<Vehicle>): Promise<Vehicle | null> => {
  try {
    const { data } = await apiClient.put(`/api/fleet/vehicles/${id}`, vehicleData);
    return data?.data ?? data;
  } catch (err: any) {
    const message = err?.response?.data?.message ?? 'Failed to update vehicle';
    throw new Error(message);
  }
};
