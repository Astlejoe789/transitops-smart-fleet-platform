import { apiClient } from './client';

export interface Vehicle {
  id: string;
  plate: string;
  make: string;
  model: string;
  year: number;
  type: string;
  status: string;
  odometer: number;
  capacity: number;
  fuel: string;
  insurance: string;
}

export const getVehicles = async (): Promise<Vehicle[]> => {
  try {
    const { data } = await apiClient.get('/api/fleet/vehicles');
    return data;
  } catch (err) {
    console.error("Error fetching vehicles:", err);
    return [];
  }
};

export const addVehicle = async (vehicleData: Partial<Vehicle>): Promise<Vehicle | null> => {
  try {
    const { data } = await apiClient.post('/api/fleet/vehicles', vehicleData);
    return data;
  } catch (err) {
    console.error("Error adding vehicle:", err);
    return null;
  }
};
