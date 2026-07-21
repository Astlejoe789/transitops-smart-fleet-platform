import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { Vendor } from '../types';

interface VendorsResponse {
  data: Vendor[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const useVendors = (query: Record<string, any> = {}) => {
  return useQuery({
    queryKey: ['vendors', query],
    queryFn: async () => {
      const { data } = await apiClient.get<VendorsResponse>('/vendors', { params: query });
      return data;
    },
  });
};

export const useVendor = (id: string) => {
  return useQuery({
    queryKey: ['vendors', id],
    queryFn: async () => {
      const { data } = await apiClient.get<{ data: Vendor }>(`/vendors/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
};

export const useCreateVendor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (vendorData: Partial<Vendor>) => {
      const { data } = await apiClient.post<{ data: Vendor }>('/vendors', vendorData);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
    },
  });
};

export const useUpdateVendor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Vendor> }) => {
      const response = await apiClient.put<{ data: Vendor }>(`/vendors/${id}`, data);
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
      queryClient.invalidateQueries({ queryKey: ['vendors', variables.id] });
    },
  });
};

export const useDeleteVendor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/vendors/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
    },
  });
};
