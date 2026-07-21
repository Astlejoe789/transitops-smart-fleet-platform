import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import type {
  Driver,
  DriverFilters,
  DriverStats,
  DriverDocument,
  TimelineEvent,
  PaginatedResponse,
} from '../types';

const DRIVERS_KEY = 'drivers';

// ─── List Drivers ─────────────────────────────────────────────────────────────
export const useDrivers = (filters: DriverFilters) => {
  return useQuery({
    queryKey: [DRIVERS_KEY, filters],
    queryFn: async () => {
      const { data } = await apiClient.get<PaginatedResponse<Driver>>('/drivers', {
        params: filters,
      });
      return data;
    },
  });
};

// ─── Driver Stats ─────────────────────────────────────────────────────────────
export const useDriverStats = () => {
  return useQuery({
    queryKey: [DRIVERS_KEY, 'stats'],
    queryFn: async () => {
      const { data } = await apiClient.get<DriverStats>('/drivers/stats');
      return data;
    },
  });
};

// ─── Single Driver ────────────────────────────────────────────────────────────
export const useDriver = (id: string) => {
  return useQuery({
    queryKey: [DRIVERS_KEY, id],
    queryFn: async () => {
      const { data } = await apiClient.get<Driver>(`/drivers/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

// ─── Create Driver ────────────────────────────────────────────────────────────
export const useCreateDriver = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<Driver> & { firstName: string; lastName: string; email: string }) => {
      const { data } = await apiClient.post<Driver>('/drivers', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DRIVERS_KEY] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

// ─── Update Driver ────────────────────────────────────────────────────────────
export const useUpdateDriver = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<Driver>) => {
      const { data } = await apiClient.put<Driver>(`/drivers/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DRIVERS_KEY] });
      queryClient.invalidateQueries({ queryKey: [DRIVERS_KEY, id] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

// ─── Delete Driver ────────────────────────────────────────────────────────────
export const useDeleteDriver = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.delete(`/drivers/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DRIVERS_KEY] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

// ─── Restore Driver ───────────────────────────────────────────────────────────
export const useRestoreDriver = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.patch(`/drivers/${id}/restore`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DRIVERS_KEY] });
    },
  });
};

// ─── Bulk Delete ──────────────────────────────────────────────────────────────
export const useBulkDeleteDrivers = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: string[]) => {
      await Promise.all(ids.map((id) => apiClient.delete(`/drivers/${id}`)));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DRIVERS_KEY] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

// ─── Driver Documents ─────────────────────────────────────────────────────────
export const useDriverDocuments = (driverId: string) => {
  return useQuery({
    queryKey: [DRIVERS_KEY, driverId, 'documents'],
    queryFn: async () => {
      const { data } = await apiClient.get<DriverDocument[]>(`/drivers/${driverId}/documents`);
      return data;
    },
    enabled: !!driverId,
  });
};

export const useAddDriverDocument = (driverId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<DriverDocument>) => {
      const { data } = await apiClient.post<DriverDocument>(`/drivers/${driverId}/documents`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DRIVERS_KEY, driverId, 'documents'] });
      queryClient.invalidateQueries({ queryKey: [DRIVERS_KEY, driverId] });
    },
  });
};

export const useDeleteDriverDocument = (driverId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (docId: string) => {
      const { data } = await apiClient.delete(`/drivers/documents/${docId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DRIVERS_KEY, driverId, 'documents'] });
      queryClient.invalidateQueries({ queryKey: [DRIVERS_KEY, driverId] });
    },
  });
};

// ─── Vehicle Assignment ───────────────────────────────────────────────────────
export const useAssignVehicle = (driverId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (vehicleId: string) => {
      const { data } = await apiClient.post(`/drivers/${driverId}/assign-vehicle`, { vehicleId });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DRIVERS_KEY, driverId] });
      queryClient.invalidateQueries({ queryKey: [DRIVERS_KEY] });
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });
};

export const useUnassignVehicle = (driverId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await apiClient.delete(`/drivers/${driverId}/unassign-vehicle`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DRIVERS_KEY, driverId] });
      queryClient.invalidateQueries({ queryKey: [DRIVERS_KEY] });
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });
};

// ─── Driver Timeline ──────────────────────────────────────────────────────────
export const useDriverTimeline = (driverId: string) => {
  return useQuery({
    queryKey: [DRIVERS_KEY, driverId, 'timeline'],
    queryFn: async () => {
      const { data } = await apiClient.get<TimelineEvent[]>(`/drivers/${driverId}/timeline`);
      return data;
    },
    enabled: !!driverId,
  });
};

// ─── Available Vehicles (for assignment) ──────────────────────────────────────
export const useAvailableVehicles = () => {
  return useQuery({
    queryKey: ['vehicles', { status: 'AVAILABLE' }],
    queryFn: async () => {
      const { data } = await apiClient.get<{ data: Array<{ id: string; plateNumber: string; make: string; model: string }> }>('/fleet', {
        params: { status: 'AVAILABLE', limit: 100 },
      });
      return data.data;
    },
  });
};

// ─── Branches (for filter) ────────────────────────────────────────────────────
export const useBranches = () => {
  return useQuery({
    queryKey: ['branches'],
    queryFn: async () => {
      try {
        const { data } = await apiClient.get<Array<{ id: string; name: string }>>('/dashboard/branches');
        return data;
      } catch {
        return [] as Array<{ id: string; name: string }>;
      }
    },
  });
};
