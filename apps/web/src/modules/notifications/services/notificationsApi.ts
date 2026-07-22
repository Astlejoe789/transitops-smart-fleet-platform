import { apiClient } from '@/api/client';

export interface Notification {
  id: string;
  type: string;
  category: string;
  priority: string;
  title: string;
  message: string;
  isRead: boolean;
  readAt: string | null;
  linkUrl: string | null;
  createdAt: string;
}

export interface NotificationPreferences {
  enableNotifications: boolean;
  enableEmail: boolean;
  enableSMS: boolean;
  enablePush: boolean;
  enableAiAlerts: boolean;
  enableBillingAlerts: boolean;
  enableFleetAlerts: boolean;
  enableMaintenanceAlerts: boolean;
  enableExpenseAlerts: boolean;
}

export const notificationsApi = {
  getNotifications: async (filters: any = {}) => {
    const params = new URLSearchParams(filters);
    const response = await apiClient.get(`/notifications?${params.toString()}`);
    return response.data.data;
  },

  getPreferences: async () => {
    const response = await apiClient.get('/notifications/preferences');
    return response.data.data as NotificationPreferences;
  },

  updatePreferences: async (data: Partial<NotificationPreferences>) => {
    const response = await apiClient.put('/notifications/preferences', data);
    return response.data.data;
  },

  markAsRead: async (id: string) => {
    const response = await apiClient.patch(`/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await apiClient.patch('/notifications/read-all');
    return response.data;
  },

  deleteNotification: async (id: string) => {
    const response = await apiClient.delete(`/notifications/${id}`);
    return response.data;
  },
};
