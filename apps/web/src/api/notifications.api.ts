import { apiClient } from './client';
import type { ApiResponse } from '@/types/api.types';

export interface Notification {
  id: string;
  type: string;
  category: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  title: string;
  message: string;
  isRead: boolean;
  linkUrl?: string;
  createdAt: string;
}

export interface NotificationsResponse {
  data: Notification[];
  meta: {
    total: number;
    unreadCount: number;
    page: number;
    limit: number;
  };
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'ALERT',
    category: 'MAINTENANCE',
    priority: 'HIGH',
    title: 'FT-1951 service overdue',
    message: 'Oil service has exceeded the limit by 240 miles. Immediate attention required.',
    isRead: false,
    linkUrl: '/maintenance',
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    id: '2',
    type: 'WARNING',
    category: 'FUEL',
    priority: 'MEDIUM',
    title: 'Unusual fuel consumption',
    message: 'Vehicle FT-1784 has used 18% more fuel than its average baseline this week.',
    isRead: false,
    linkUrl: '/fuel',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: '3',
    type: 'REMINDER',
    category: 'COMPLIANCE',
    priority: 'LOW',
    title: 'Driver license expiring soon',
    message: "Maya Chen's license expires in 12 days. Please ensure renewal is initiated.",
    isRead: true,
    linkUrl: '/drivers',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: '4',
    type: 'INFO',
    category: 'TRIPS',
    priority: 'LOW',
    title: 'Route RT-047 completed',
    message: 'Driver Jon Bell completed route RT-047 with a 3-minute delay.',
    isRead: true,
    linkUrl: '/trips',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
  },
];

export const notificationsApi = {
  getNotifications: async (params?: { limit?: number; page?: number }): Promise<NotificationsResponse> => {
    try {
      const response = await apiClient.get<ApiResponse<NotificationsResponse>>('notifications', { params });
      return response.data.data;
    } catch {
      const unreadCount = MOCK_NOTIFICATIONS.filter((n) => !n.isRead).length;
      return {
        data: MOCK_NOTIFICATIONS,
        meta: { total: MOCK_NOTIFICATIONS.length, unreadCount, page: 1, limit: 10 },
      };
    }
  },

  markAsRead: async (id: string): Promise<void> => {
    try {
      await apiClient.patch(`notifications/${id}/read`);
    } catch {
      // silently fail — UI optimistically updates
    }
  },

  markAllAsRead: async (): Promise<void> => {
    try {
      await apiClient.patch('notifications/read-all');
    } catch {
      // silently fail
    }
  },

  deleteNotification: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`notifications/${id}`);
    } catch {
      // silently fail
    }
  },
};
