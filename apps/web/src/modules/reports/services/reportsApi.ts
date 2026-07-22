import { apiClient } from '@/api/client';

export const reportsApi = {
  getReport: async (reportType: string, params?: Record<string, any>) => {
    const response = await apiClient.get(`/reports/${reportType}`, { params });
    return response.data.data;
  }
};
