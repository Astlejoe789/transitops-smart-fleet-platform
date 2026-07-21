import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient as api } from '@/api/client';
import type { MaintenanceLog, MaintenanceStatus, MaintenancePart, MaintenanceDocument } from '../types';

interface GetMaintenanceParams {
  page?: number;
  limit?: number;
  status?: string;
  type?: string;
  priority?: string;
  search?: string;
  vehicleId?: string;
}

export const useMaintenance = (params?: GetMaintenanceParams) => {
  return useQuery({
    queryKey: ['maintenance', params],
    queryFn: async () => {
      const { data } = await api.get('/maintenance', { params });
      return data;
    },
  });
};

export const useMaintenanceDetails = (id: string | null) => {
  return useQuery({
    queryKey: ['maintenance', id],
    queryFn: async () => {
      if (!id) return null;
      const { data } = await api.get(`/maintenance/${id}`);
      return data.data as MaintenanceLog;
    },
    enabled: !!id,
  });
};

export const useCreateMaintenance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post('/maintenance', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance'] });
    },
  });
};

export const useUpdateMaintenance = (id: string | null) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      if (!id) throw new Error('Maintenance ID required');
      const response = await api.put(`/maintenance/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance'] });
    },
  });
};

export const useUpdateMaintenanceStatus = (id: string | null) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { status: MaintenanceStatus; notes?: string }) => {
      if (!id) throw new Error('Maintenance ID required');
      const response = await api.patch(`/maintenance/${id}/status`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance'] });
    },
  });
};

export const useDeleteMaintenance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/maintenance/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance'] });
    },
  });
};

// Parts
export const useAddPart = (id: string | null) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<MaintenancePart>) => {
      if (!id) throw new Error('Maintenance ID required');
      const response = await api.post(`/maintenance/${id}/parts`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance', id] });
    },
  });
};

export const useDeletePart = (id: string | null) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (partId: string) => {
      if (!id) throw new Error('Maintenance ID required');
      const response = await api.delete(`/maintenance/${id}/parts/${partId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance', id] });
    },
  });
};

// Documents
export const useAddDocument = (id: string | null) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<MaintenanceDocument>) => {
      if (!id) throw new Error('Maintenance ID required');
      const response = await api.post(`/maintenance/${id}/documents`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance', id] });
    },
  });
};

export const useDeleteDocument = (id: string | null) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (docId: string) => {
      if (!id) throw new Error('Maintenance ID required');
      const response = await api.delete(`/maintenance/${id}/documents/${docId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance', id] });
    },
  });
};
