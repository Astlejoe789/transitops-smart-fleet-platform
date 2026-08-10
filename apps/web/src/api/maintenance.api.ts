import { apiClient } from './client';

export interface MaintenanceLog {
  id: string;
  vehicleId: string;
  description: string;
  cost: number;
  date?: string;
  status?: string;
  type?: string;
  maintenanceType?: string;
  maintenanceId?: string;
  estimatedCost?: number;
  scheduledDate?: string;
  vehicle?: { plateNumber: string; make: string; model: string };
}

export const getMaintenanceLogs = async (): Promise<MaintenanceLog[]> => {
  try {
    const { data } = await apiClient.get('/api/maintenance?limit=100');
    const list = data?.data ?? data;
    return (Array.isArray(list) ? list : []).map((m: any) => ({
      ...m,
      cost: m.actualCost ?? m.estimatedCost ?? m.cost ?? 0,
      date: m.scheduledDate ? new Date(m.scheduledDate).toISOString().split('T')[0] : (m.date ?? ''),
      type: m.maintenanceType ?? m.type,
      vehicleId: m.vehicle?.plateNumber ?? m.vehicleId,
    }));
  } catch (err) {
    console.error('Error fetching maintenance logs:', err);
    return [];
  }
};

export const addMaintenanceLog = async (logData: Partial<MaintenanceLog>): Promise<MaintenanceLog | null> => {
  try {
    const { data } = await apiClient.post('/api/maintenance', logData);
    return data?.data ?? data;
  } catch (err: any) {
    const message = err?.response?.data?.message ?? 'Failed to add maintenance log';
    throw new Error(message);
  }
};

export const updateMaintenanceStatus = async (id: string, status: string, notes?: string): Promise<MaintenanceLog | null> => {
  try {
    const { data } = await apiClient.patch(`/api/maintenance/${id}/status`, { status, notes });
    return data?.data ?? data;
  } catch (err: any) {
    const message = err?.response?.data?.message ?? 'Failed to update maintenance status';
    throw new Error(message);
  }
};
