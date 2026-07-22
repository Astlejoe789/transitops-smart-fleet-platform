import { prisma } from '../../database/index.js';

export class NotificationService {
  /**
   * Get all notifications for a user, with optional filters
   */
  async getNotifications(companyId: string, userId: string, filters: any = {}) {
    const where: any = { companyId, userId };

    if (filters.isRead !== undefined) {
      where.isRead = filters.isRead === 'true';
    }
    if (filters.priority) {
      where.priority = filters.priority;
    }
    if (filters.type) {
      where.type = filters.type;
    }

    const notifications = await prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: filters.limit ? parseInt(filters.limit, 10) : 50,
      skip: filters.offset ? parseInt(filters.offset, 10) : 0,
    });

    const total = await prisma.notification.count({ where });
    const unread = await prisma.notification.count({ where: { companyId, userId, isRead: false } });

    return { notifications, total, unread };
  }

  /**
   * Get a specific notification
   */
  async getNotificationById(companyId: string, userId: string, notificationId: string) {
    return prisma.notification.findFirst({
      where: { id: notificationId, companyId, userId },
    });
  }

  /**
   * Mark a notification as read
   */
  async markAsRead(companyId: string, userId: string, notificationId: string) {
    return prisma.notification.updateMany({
      where: { id: notificationId, companyId, userId },
      data: { isRead: true, readAt: new Date() },
    });
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(companyId: string, userId: string) {
    return prisma.notification.updateMany({
      where: { companyId, userId, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });
  }

  /**
   * Delete a notification
   */
  async deleteNotification(companyId: string, userId: string, notificationId: string) {
    return prisma.notification.deleteMany({
      where: { id: notificationId, companyId, userId },
    });
  }

  /**
   * Create a new notification (used by other modules internally, or triggered for demo)
   */
  async createNotification(data: {
    companyId: string;
    userId: string;
    type: string;
    category?: string;
    priority?: string;
    title: string;
    message: string;
    linkUrl?: string;
  }) {
    return prisma.notification.create({
      data: {
        companyId: data.companyId,
        userId: data.userId,
        type: data.type as any,
        category: (data.category || 'INFORMATION') as any,
        priority: (data.priority || 'MEDIUM') as any,
        title: data.title,
        message: data.message,
        linkUrl: data.linkUrl,
      },
    });
  }

  /**
   * Get user preferences
   */
  async getPreferences(companyId: string, userId: string) {
    let prefs = await prisma.notificationPreference.findFirst({
      where: { companyId, userId },
    });

    // Lazy initialization if not exists
    if (!prefs) {
      prefs = await prisma.notificationPreference.create({
        data: { companyId, userId },
      });
    }

    return prefs;
  }

  /**
   * Update user preferences
   */
  async updatePreferences(companyId: string, userId: string, data: any) {
    const prefs = await this.getPreferences(companyId, userId);
    return prisma.notificationPreference.update({
      where: { id: prefs.id },
      data,
    });
  }
}
