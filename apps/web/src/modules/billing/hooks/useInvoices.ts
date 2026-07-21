import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { Invoice, InvoiceSummary, LedgerEntry, RevenueData } from '../types';

interface InvoicesResponse {
  data: Invoice[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export const useInvoiceSummary = () =>
  useQuery({
    queryKey: ['invoices', 'summary'],
    queryFn: async () => {
      const { data } = await apiClient.get<{ data: InvoiceSummary }>('/invoices/summary');
      return data.data;
    },
  });

export const useInvoices = (query: Record<string, any> = {}) =>
  useQuery({
    queryKey: ['invoices', query],
    queryFn: async () => {
      const { data } = await apiClient.get<InvoicesResponse>('/invoices', { params: query });
      return data;
    },
  });

export const useInvoice = (id: string) =>
  useQuery({
    queryKey: ['invoices', id],
    queryFn: async () => {
      const { data } = await apiClient.get<{ data: Invoice }>(`/invoices/${id}`);
      return data.data;
    },
    enabled: !!id,
  });

export const useCreateInvoice = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await apiClient.post<{ data: Invoice }>('/invoices', payload);
      return data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['invoices'] }),
  });
};

export const useUpdateInvoice = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await apiClient.put<{ data: Invoice }>(`/invoices/${id}`, data);
      return res.data.data;
    },
    onSuccess: (_, v) => {
      qc.invalidateQueries({ queryKey: ['invoices'] });
      qc.invalidateQueries({ queryKey: ['invoices', v.id] });
    },
  });
};

export const useIssueInvoice = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.patch<{ data: Invoice }>(`/invoices/${id}/issue`);
      return data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['invoices'] }),
  });
};

export const useVoidInvoice = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.patch<{ data: Invoice }>(`/invoices/${id}/void`);
      return data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['invoices'] }),
  });
};

export const useCancelInvoice = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.patch<{ data: Invoice }>(`/invoices/${id}/cancel`);
      return data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['invoices'] }),
  });
};

export const useDeleteInvoice = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => apiClient.delete(`/invoices/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['invoices'] }),
  });
};

export const useSubmitForApproval = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.patch<{ data: Invoice }>(`/invoices/${id}/submit`);
      return data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['invoices'] }),
  });
};

export const useApproveInvoice = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.patch<{ data: Invoice }>(`/invoices/${id}/approve`);
      return data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['invoices'] }),
  });
};

export const useSendInvoice = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.patch<{ data: Invoice }>(`/invoices/${id}/send`);
      return data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['invoices'] }),
  });
};

export const useGenerateFromTrip = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (tripId: string) => {
      const { data } = await apiClient.post<{ data: Invoice }>(`/invoices/generate-from-trip/${tripId}`);
      return data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['invoices'] }),
  });
};

export const useCustomerLedger = (customerId: string, query: Record<string, any> = {}) =>
  useQuery({
    queryKey: ['customer-ledger', customerId, query],
    queryFn: async () => {
      const { data } = await apiClient.get<{ data: LedgerEntry[]; meta: any }>(`/invoices/customer/${customerId}/ledger`, { params: query });
      return data;
    },
    enabled: !!customerId,
  });

export const useRevenueData = (year?: string) =>
  useQuery({
    queryKey: ['revenue-data', year],
    queryFn: async () => {
      const { data } = await apiClient.get<{ data: RevenueData }>('/invoices/revenue', { params: { year } });
      return data.data;
    },
  });
