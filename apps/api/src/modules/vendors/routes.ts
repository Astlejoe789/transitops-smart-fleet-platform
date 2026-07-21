import { Router } from 'express';
import { VendorController } from './controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { requireRole } from '../../middlewares/role.middleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/', VendorController.getVendors);
router.get('/:id', VendorController.getVendorById);
router.post('/', requireRole('SUPER_ADMIN', 'COMPANY_ADMIN', 'FINANCE_MANAGER', 'FLEET_MANAGER'), VendorController.createVendor);
router.put('/:id', requireRole('SUPER_ADMIN', 'COMPANY_ADMIN', 'FINANCE_MANAGER', 'FLEET_MANAGER'), VendorController.updateVendor);
router.delete('/:id', requireRole('SUPER_ADMIN', 'COMPANY_ADMIN'), VendorController.deleteVendor);
router.patch('/:id/restore', requireRole('SUPER_ADMIN', 'COMPANY_ADMIN'), VendorController.restoreVendor);

export const vendorRoutes = router;
