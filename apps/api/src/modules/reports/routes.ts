import { Router } from 'express';
import { ReportsController } from './controller.js';
import { authMiddleware, requirePermission } from '../../middlewares/index.js';

/**
 * Reports Routes
 *
 * Define API endpoints for the reports module.
 */
const router = Router();
const controller = new ReportsController();

router.use(authMiddleware);

router.get('/fleet', requirePermission('reports', 'read'), controller.getFleetReport);
router.get('/drivers', requirePermission('reports', 'read'), controller.getDriversReport);
router.get('/trips', requirePermission('reports', 'read'), controller.getTripsReport);
router.get('/fuel', requirePermission('reports', 'read'), controller.getFuelReport);
router.get('/maintenance', requirePermission('reports', 'read'), controller.getMaintenanceReport);
router.get('/expenses', requirePermission('reports', 'read'), controller.getExpenseReport);
router.get('/customers', requirePermission('reports', 'read'), controller.getCustomersReport);
router.get('/vendors', requirePermission('reports', 'read'), controller.getVendorsReport);
router.get('/billing', requirePermission('reports', 'read'), controller.getBillingReport);

export const reportsRoutes = router;

