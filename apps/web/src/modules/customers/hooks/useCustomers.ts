import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { Customer } from '../types';

interface CustomersResponse {
  data: Customer[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const useCustomers = (query: Record<string, any> = {}) => {
  return useQuery({
    queryKey: ['customers', query],
    queryFn: async () => {
      const { data } = await apiClient.get<CustomersResponse>('/customers', { params: query });
      return data;
    },
  });
};

export const useCustomer = (id: string) => {
  return useQuery({
    queryKey: ['customers', id],
    queryFn: async () => {
      const { data } = await apiClient.get<{ data: Customer }>(`/customers/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
};

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (customerData: Partial<Customer>) => {
      const { data } = await apiClient.post<{ data: Customer }>('/customers', customerData);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Customer> }) => {
      const response = await apiClient.put<{ data: Customer }>(`/customers/${id}`, data);
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['customers', variables.id] });
    },
  });
};

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/customers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
};
