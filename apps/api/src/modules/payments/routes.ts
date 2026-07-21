import { Router } from 'express';
import { PaymentController } from './controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { requireRole } from '../../middlewares/role.middleware.js';

const router = Router();
router.use(authMiddleware);

const financeRoles = ['SUPER_ADMIN', 'COMPANY_ADMIN', 'FINANCE_MANAGER'];

router.get('/summary', PaymentController.getPaymentSummary);
router.get('/', PaymentController.getPayments);
router.get('/:id', PaymentController.getPaymentById);
router.post('/', requireRole(...financeRoles), PaymentController.recordPayment);
router.patch('/:id/refund', requireRole(...financeRoles), PaymentController.refundPayment);

export const paymentRoutes = router;
