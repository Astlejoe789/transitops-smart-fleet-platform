import { type Response } from 'express';
import { type AuthenticatedRequest } from '../../middlewares/index.js';
import { NotificationService } from './service.js';
import { prisma } from '../../database/index.js';

export class NotificationController {
  private notificationService: NotificationService;

  constructor() {
    this.notificationService = new NotificationService();
  }

  getNotifications = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const companyId = req.user?.companyId;
      const userId = req.user?.userId;
      if (!companyId || !userId) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      const result = await this.notificationService.getNotifications(companyId, userId, req.query);
      return res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  };

  getNotificationById = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const companyId = req.user?.companyId;
      const userId = req.user?.userId;
      const { id } = req.params;
      if (!companyId || !userId) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      const notification = await this.notificationService.getNotificationById(companyId, userId, id);
      if (!notification) {
        return res.status(404).json({ success: false, error: 'Not found' });
      }
      return res.status(200).json({ success: true, data: notification });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  };

  markAsRead = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const companyId = req.user?.companyId;
      const userId = req.user?.userId;
      const { id } = req.params;
      if (!companyId || !userId) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      await this.notificationService.markAsRead(companyId, userId, id);
      
      // Audit log
      await prisma.auditLog.create({
        data: {
          companyId,
          userId,
          action: 'UPDATE',
          entityType: 'NOTIFICATION',
          entityId: id,
          newValues: { isRead: true },
        }
      });

      return res.status(200).json({ success: true, message: 'Notification marked as read' });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  };

  markAllAsRead = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const companyId = req.user?.companyId;
      const userId = req.user?.userId;
      if (!companyId || !userId) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      await this.notificationService.markAllAsRead(companyId, userId);
      return res.status(200).json({ success: true, message: 'All notifications marked as read' });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  };

  deleteNotification = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const companyId = req.user?.companyId;
      const userId = req.user?.userId;
      const { id } = req.params;
      if (!companyId || !userId) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      await this.notificationService.deleteNotification(companyId, userId, id);

      await prisma.auditLog.create({
        data: {
          companyId,
          userId,
          action: 'DELETE',
          entityType: 'NOTIFICATION',
          entityId: id,
        }
      });

      return res.status(200).json({ success: true, message: 'Notification deleted' });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  };

  createNotification = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const companyId = req.user?.companyId;
      const userId = req.user?.userId;
      if (!companyId || !userId) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      const { type, category, priority, title, message, linkUrl, overrideUserId } = req.body;
      const targetUserId = overrideUserId || userId;

      const notification = await this.notificationService.createNotification({
        companyId,
        userId: targetUserId,
        type,
        category,
        priority,
        title,
        message,
        linkUrl,
      });

      return res.status(201).json({ success: true, data: notification });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  };

  getPreferences = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const companyId = req.user?.companyId;
      const userId = req.user?.userId;
      if (!companyId || !userId) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      const prefs = await this.notificationService.getPreferences(companyId, userId);
      return res.status(200).json({ success: true, data: prefs });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  };

  updatePreferences = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const companyId = req.user?.companyId;
      const userId = req.user?.userId;
      if (!companyId || !userId) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      const updated = await this.notificationService.updatePreferences(companyId, userId, req.body);
      return res.status(200).json({ success: true, data: updated });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  };
}
