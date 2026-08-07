import { apiClient } from './client';

export interface FuelLog {
  id: string;
  vehicleId: string;
  driverId: string;
  gallons: number;
  cost: number;
  date: string;
  location?: string;
}

export const getFuelLogs = async (): Promise<FuelLog[]> => {
  try {
    const { data } = await apiClient.get('/api/fuel');
    return data;
  } catch (err) {
    console.error("Error fetching fuel logs:", err);
    return [];
  }
};

export const addFuelLog = async (logData: Partial<FuelLog>): Promise<FuelLog | null> => {
  try {
    const { data } = await apiClient.post('/api/fuel', logData);
    return data;
  } catch (err) {
    console.error("Error adding fuel log:", err);
    return null;
  }
};
