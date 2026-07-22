import { apiClient } from '@/api/client';

export interface DashboardMetrics {
  scores: {
    fleetHealth: number;
    driverPerformance: number;
    vehicleRisk: number;
  };
  forecasts: {
    revenue: any[];
    expense: any[];
    fuel: any[];
    maintenance: any[];
  };
}

export interface AiInsight {
  title: string;
  description: string;
  type: 'WARNING' | 'INFO' | 'SUCCESS';
}

export const aiApi = {
  getDashboardMetrics: async (): Promise<DashboardMetrics> => {
    const response = await apiClient.get('/ai/dashboard');
    return response.data;
  },

  getInsights: async (): Promise<AiInsight[]> => {
    const response = await apiClient.get('/ai/insights');
    return response.data;
  },

  askQuestion: async (question: string): Promise<{ answer: string; timestamp: string }> => {
    const response = await apiClient.post('/ai/chat', { question });
    return response.data;
  }
};
