import { Router } from 'express';
import { dashboardController } from './controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';

const router = Router();

// Protect all dashboard routes
router.use(authMiddleware);

router.get('/summary', dashboardController.getSummary);
router.get('/fleet', dashboardController.getFleetStatus);
router.get('/trips', dashboardController.getTripsData);
router.get('/expenses', dashboardController.getExpensesData);
router.get('/maintenance', dashboardController.getMaintenanceData);
router.get('/recent-activities', dashboardController.getRecentActivities);
router.get('/notifications', dashboardController.getNotifications);

export const dashboardRoutes = router;
