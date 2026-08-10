import { apiClient } from './client';

export interface Driver {
  id: string;
  name: string;
  licenseNumber: string;
  status: string;
  phone?: string;
  email?: string;
  expiry?: string;
  empId?: string;
  license?: string;
  category?: string;
  safetyScore?: number;
  licenseCategory?: string;
  licenseExpiry?: string;
  employeeId?: string;
  user?: { firstName: string; lastName: string; email: string };
}

export const getDrivers = async (): Promise<Driver[]> => {
  try {
    const { data } = await apiClient.get('/api/drivers?limit=100');
    const list = data?.data ?? data;
    return (Array.isArray(list) ? list : []).map((d: any) => ({
      ...d,
      name: d.user ? `${d.user.firstName} ${d.user.lastName}` : (d.name ?? ''),
      empId: d.employeeId ?? d.empId,
      license: d.licenseNumber ?? d.license,
      category: d.licenseCategory ?? d.category,
      expiry: d.licenseExpiry ? new Date(d.licenseExpiry).toISOString().split('T')[0] : (d.expiry ?? ''),
      email: d.user?.email ?? d.email,
    }));
  } catch (err) {
    console.error('Error fetching drivers:', err);
    return [];
  }
};

export const addDriver = async (driverData: Partial<Driver>): Promise<Driver | null> => {
  try {
    const { data } = await apiClient.post('/api/drivers', driverData);
    return data?.data ?? data;
  } catch (err: any) {
    const message = err?.response?.data?.message ?? 'Failed to add driver';
    throw new Error(message);
  }
};

export const updateDriverStatus = async (id: string, status: string): Promise<Driver | null> => {
  try {
    const { data } = await apiClient.put(`/api/drivers/${id}`, { status });
    return data?.data ?? data;
  } catch (err: any) {
    const message = err?.response?.data?.message ?? 'Failed to update driver status';
    throw new Error(message);
  }
};
