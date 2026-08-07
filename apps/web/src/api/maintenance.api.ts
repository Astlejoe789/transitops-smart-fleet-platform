import { apiClient } from './client';

export interface MaintenanceLog {
  id: string;
  vehicleId: string;
  type: string;
  description: string;
  cost: number;
  date: string;
  vendorId?: string;
}

export const getMaintenanceLogs = async (): Promise<MaintenanceLog[]> => {
  try {
    const { data } = await apiClient.get('/api/maintenance');
    return data;
  } catch (err) {
    console.error("Error fetching maintenance logs:", err);
    return [];
  }
};

export const addMaintenanceLog = async (logData: Partial<MaintenanceLog>): Promise<MaintenanceLog | null> => {
  try {
    const { data } = await apiClient.post('/api/maintenance', logData);
    return data;
  } catch (err) {
    console.error("Error adding maintenance log:", err);
    return null;
  }
};
