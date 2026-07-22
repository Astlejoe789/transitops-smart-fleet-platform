import { Router } from 'express';
import { AnalyticsController } from './controller.js';
import { authMiddleware, requirePermission } from '../../middlewares/index.js';


/**
 * Analytics Routes
 *
 * Define API endpoints for the analytics module.
 */
const router = Router();
const controller = new AnalyticsController();

router.use(authMiddleware);

router.get('/kpis', requirePermission('analytics', 'read'), controller.getDashboardKPIs);
router.get('/charts', requirePermission('analytics', 'read'), controller.getDashboardCharts);

export const analyticsRoutes = router;
