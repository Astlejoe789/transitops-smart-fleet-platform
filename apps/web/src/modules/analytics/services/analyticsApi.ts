import { apiClient } from '@/api/client';

export const analyticsApi = {
  getKPIs: async () => {
    const response = await apiClient.get('/analytics/kpis');
    return response.data.data;
  },
  getCharts: async () => {
    const response = await apiClient.get('/analytics/charts');
    return response.data.data;
  }
};
