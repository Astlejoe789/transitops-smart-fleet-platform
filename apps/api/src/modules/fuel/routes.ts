import { Router } from 'express';
import { fuelController } from './controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { requireRole } from '../../middlewares/role.middleware.js';

const router = Router();

router.use(authMiddleware);

// Analytics & Dashboard (Place before /:id routes to avoid param collision)
router.get('/analytics', requireRole('FLEET_MANAGER', 'COMPANY_ADMIN'), fuelController.getAnalytics.bind(fuelController));
router.get('/dashboard', requireRole('FLEET_MANAGER', 'COMPANY_ADMIN'), fuelController.getDashboardMetrics.bind(fuelController));

// CRUD
router.get('/', fuelController.getFuelLogs.bind(fuelController));
router.get('/:id', fuelController.getFuelLogById.bind(fuelController));
router.post('/', requireRole('FLEET_MANAGER', 'DISPATCHER', 'COMPANY_ADMIN'), fuelController.createFuelLog.bind(fuelController));
router.put('/:id', requireRole('FLEET_MANAGER', 'COMPANY_ADMIN'), fuelController.updateFuelLog.bind(fuelController));
router.delete('/:id', requireRole('FLEET_MANAGER', 'COMPANY_ADMIN'), fuelController.deleteFuelLog.bind(fuelController));
router.patch('/:id/restore', requireRole('FLEET_MANAGER', 'COMPANY_ADMIN'), fuelController.restoreFuelLog.bind(fuelController));

export { router as fuelRoutes };
