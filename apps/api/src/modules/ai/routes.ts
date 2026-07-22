import { Router } from 'express';
import { AiController } from './controller.js';
import { authMiddleware, requirePermission } from '../../middlewares/index.js';

/**
 * Ai Routes
 *
 * Define API endpoints for the AI module.
 */
const router = Router();
const controller = new AiController();

router.use(authMiddleware);

// Analytics endpoints require generic 'read' permission on AI module or specific analytics modules
router.get('/dashboard', requirePermission('dashboard', 'read') as any, controller.getDashboardMetrics as any);
router.get('/insights', requirePermission('dashboard', 'read') as any, controller.getInsights as any);
router.post('/chat', requirePermission('dashboard', 'read') as any, controller.askQuestion as any);

export const aiRoutes = router;
