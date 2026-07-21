import { Router, type Request, type Response } from 'express';
import { authRoutes } from '../modules/auth/index.js';
import { dashboardRoutes } from '../modules/dashboard/index.js';
import { fleetRoutes } from '../modules/fleet/index.js';
import { driverRoutes } from '../modules/drivers/index.js';
import { tripRoutes } from '../modules/trips/index.js';
import { maintenanceRoutes } from '../modules/maintenance/routes.js';
import { fuelRoutes } from '../modules/fuel/index.js';
import { expenseRoutes } from '../modules/expenses/index.js';
import { customerRoutes } from '../modules/customers/index.js';
import { vendorRoutes } from '../modules/vendors/index.js';
import { billingRoutes } from '../modules/billing/index.js';
import { paymentRoutes } from '../modules/payments/index.js';

export const apiRouter = Router();

// ---- Module Routes ----
apiRouter.use('/auth', authRoutes);
apiRouter.use('/dashboard', dashboardRoutes);
apiRouter.use('/fleet', fleetRoutes);
apiRouter.use('/drivers', driverRoutes);
apiRouter.use('/trips', tripRoutes);
apiRouter.use('/maintenance', maintenanceRoutes);
apiRouter.use('/fuel', fuelRoutes);
apiRouter.use('/expenses', expenseRoutes);
apiRouter.use('/customers', customerRoutes);
apiRouter.use('/vendors', vendorRoutes);
apiRouter.use('/invoices', billingRoutes);
apiRouter.use('/payments', paymentRoutes);
// apiRouter.use('/reports', reportRoutes);
// apiRouter.use('/analytics', analyticsRoutes);
// apiRouter.use('/ai', aiRoutes);
// apiRouter.use('/notifications', notificationRoutes);
// apiRouter.use('/admin', administrationRoutes);
// apiRouter.use('/settings', settingsRoutes);

// Default API info endpoint
apiRouter.get('/', (_req: Request, res: Response) => {
  res.json({
    name: 'TransitOps API',
    version: '0.1.0',
    docs: '/api/docs',
  });
});
