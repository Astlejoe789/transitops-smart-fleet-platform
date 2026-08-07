import { apiClient } from './client';

export interface Driver {
  id: string;
  name: string;
  licenseNumber: string;
  status: string;
  phone?: string;
  email?: string;
}

export const getDrivers = async (): Promise<Driver[]> => {
  try {
    const { data } = await apiClient.get('/api/drivers');
    return data;
  } catch (err) {
    console.error("Error fetching drivers:", err);
    return [];
  }
};

export const addDriver = async (driverData: Partial<Driver>): Promise<Driver | null> => {
  try {
    const { data } = await apiClient.post('/api/drivers', driverData);
    return data;
  } catch (err) {
    console.error("Error adding driver:", err);
    return null;
  }
};
