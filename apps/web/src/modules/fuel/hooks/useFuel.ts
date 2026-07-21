import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import type { FuelLog, FuelAnalytics, FuelDashboardMetrics } from '../types';

interface GetFuelLogsParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  vehicleId?: string;
  driverId?: string;
  fuelType?: string;
  paymentMethod?: string;
  startDate?: string;
  endDate?: string;
}

interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const useFuelLogs = (params: GetFuelLogsParams) => {
  return useQuery({
    queryKey: ['fuel', params],
    queryFn: async () => {
      const { data } = await apiClient.get<PaginatedResponse<FuelLog>>('/fuel', { params });
      return data;
    },
  });
};

export const useFuelLog = (id: string) => {
  return useQuery({
    queryKey: ['fuel', id],
    queryFn: async () => {
      const { data } = await apiClient.get<{ data: FuelLog }>(`/fuel/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
};

export const useFuelAnalytics = (params: { startDate?: string; endDate?: string } = {}) => {
  return useQuery({
    queryKey: ['fuel-analytics', params],
    queryFn: async () => {
      const { data } = await apiClient.get<{ data: FuelAnalytics }>('/fuel/analytics', { params });
      return data.data;
    },
  });
};

export const useFuelDashboardMetrics = () => {
  return useQuery({
    queryKey: ['fuel-dashboard-metrics'],
    queryFn: async () => {
      const { data } = await apiClient.get<{ data: FuelDashboardMetrics }>('/fuel/dashboard');
      return data.data;
    },
  });
};

export const useCreateFuelLog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<FuelLog>) => {
      const res = await apiClient.post<{ data: FuelLog }>('/fuel', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fuel'] });
      queryClient.invalidateQueries({ queryKey: ['fuel-analytics'] });
      queryClient.invalidateQueries({ queryKey: ['fuel-dashboard-metrics'] });
    },
  });
};

export const useUpdateFuelLog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<FuelLog> }) => {
      const res = await apiClient.put<{ data: FuelLog }>(`/fuel/${id}`, data);
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['fuel'] });
      queryClient.invalidateQueries({ queryKey: ['fuel', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['fuel-analytics'] });
      queryClient.invalidateQueries({ queryKey: ['fuel-dashboard-metrics'] });
    },
  });
};

export const useDeleteFuelLog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/fuel/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fuel'] });
      queryClient.invalidateQueries({ queryKey: ['fuel-analytics'] });
      queryClient.invalidateQueries({ queryKey: ['fuel-dashboard-metrics'] });
    },
  });
};
