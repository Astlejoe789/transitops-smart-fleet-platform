import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { Expense, GetExpensesQuery, ExpenseDashboardData, ExpenseAnalyticsData } from '../types';

interface ExpensesResponse {
  data: Expense[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const useExpenses = (query: GetExpensesQuery) => {
  return useQuery({
    queryKey: ['expenses', query],
    queryFn: async () => {
      const { data } = await apiClient.get<ExpensesResponse>('/expenses', { params: query });
      return data;
    },
  });
};

export const useExpense = (id: string) => {
  return useQuery({
    queryKey: ['expenses', id],
    queryFn: async () => {
      const { data } = await apiClient.get<{ data: Expense }>(`/expenses/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
};

export const useExpenseDashboard = () => {
  return useQuery({
    queryKey: ['expenses', 'dashboard'],
    queryFn: async () => {
      const { data } = await apiClient.get<{ data: ExpenseDashboardData }>('/expenses/dashboard');
      return data.data;
    },
  });
};

export const useExpenseAnalytics = (startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: ['expenses', 'analytics', startDate, endDate],
    queryFn: async () => {
      const { data } = await apiClient.get<{ data: ExpenseAnalyticsData }>('/expenses/analytics', {
        params: { startDate, endDate },
      });
      return data.data;
    },
  });
};

export const useCreateExpense = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (expenseData: Partial<Expense>) => {
      const { data } = await apiClient.post<{ data: Expense }>('/expenses', expenseData);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
  });
};

export const useUpdateExpense = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Expense> }) => {
      const response = await apiClient.put<{ data: Expense }>(`/expenses/${id}`, data);
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['expenses', variables.id] });
    },
  });
};

export const useUpdateExpenseStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status, notes }: { id: string; status: string; notes?: string }) => {
      const response = await apiClient.patch<{ data: Expense }>(`/expenses/${id}/status`, { status, notes });
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['expenses', variables.id] });
    },
  });
};

export const useDeleteExpense = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/expenses/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
  });
};
