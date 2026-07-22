import { Router } from 'express';
import { NotificationController } from './controller.js';
import { authMiddleware } from '../../middlewares/index.js';

const router = Router();
const controller = new NotificationController();

// All notification routes require authentication
router.use(authMiddleware);

// Endpoints
router.get('/', controller.getNotifications as any);
router.post('/', controller.createNotification as any); // Allows triggering a notification for testing/internal
router.patch('/read-all', controller.markAllAsRead as any);
router.get('/preferences', controller.getPreferences as any);
router.put('/preferences', controller.updatePreferences as any);

// ID-based endpoints
router.get('/:id', controller.getNotificationById as any);
router.patch('/:id/read', controller.markAsRead as any);
router.delete('/:id', controller.deleteNotification as any);

export const notificationRoutes = router;
