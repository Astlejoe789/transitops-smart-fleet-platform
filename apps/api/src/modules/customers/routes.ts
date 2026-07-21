import { Router } from 'express';
import { CustomerController } from './controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { requireRole } from '../../middlewares/role.middleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/', CustomerController.getCustomers);
router.get('/:id', CustomerController.getCustomerById);
router.post('/', requireRole('SUPER_ADMIN', 'COMPANY_ADMIN', 'FINANCE_MANAGER'), CustomerController.createCustomer);
router.put('/:id', requireRole('SUPER_ADMIN', 'COMPANY_ADMIN', 'FINANCE_MANAGER'), CustomerController.updateCustomer);
router.delete('/:id', requireRole('SUPER_ADMIN', 'COMPANY_ADMIN'), CustomerController.deleteCustomer);
router.patch('/:id/restore', requireRole('SUPER_ADMIN', 'COMPANY_ADMIN'), CustomerController.restoreCustomer);

export const customerRoutes = router;
