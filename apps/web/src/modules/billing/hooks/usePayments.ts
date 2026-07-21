import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { Payment, PaymentSummary } from '../types';

interface PaymentsResponse {
  data: Payment[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export const usePaymentSummary = () =>
  useQuery({
    queryKey: ['payments', 'summary'],
    queryFn: async () => {
      const { data } = await apiClient.get<{ data: PaymentSummary }>('/payments/summary');
      return data.data;
    },
  });

export const usePayments = (query: Record<string, any> = {}) =>
  useQuery({
    queryKey: ['payments', query],
    queryFn: async () => {
      const { data } = await apiClient.get<PaymentsResponse>('/payments', { params: query });
      return data;
    },
  });

export const usePayment = (id: string) =>
  useQuery({
    queryKey: ['payments', id],
    queryFn: async () => {
      const { data } = await apiClient.get<{ data: Payment }>(`/payments/${id}`);
      return data.data;
    },
    enabled: !!id,
  });

export const useRecordPayment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await apiClient.post<{ data: Payment }>('/payments', payload);
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['payments'] });
      qc.invalidateQueries({ queryKey: ['invoices'] });
    },
  });
};

export const useRefundPayment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.patch<{ data: Payment }>(`/payments/${id}/refund`);
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['payments'] });
      qc.invalidateQueries({ queryKey: ['invoices'] });
    },
  });
};
