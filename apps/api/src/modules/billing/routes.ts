import { Router } from 'express';
import { BillingController } from './controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { requireRole } from '../../middlewares/role.middleware.js';

const router = Router();
router.use(authMiddleware);

const financeRoles = ['SUPER_ADMIN', 'COMPANY_ADMIN', 'FINANCE_MANAGER'];

router.get('/export/csv', BillingController.exportInvoicesCSV);
router.get('/revenue', BillingController.getRevenueData);
router.get('/summary', BillingController.getInvoiceSummary);
router.get('/customer/:customerId/ledger', BillingController.getCustomerLedger);
router.get('/', BillingController.getInvoices);
router.get('/:id', BillingController.getInvoiceById);
router.post('/generate-from-trip/:tripId', requireRole(...financeRoles), BillingController.generateFromTrip);
router.post('/', requireRole(...financeRoles), BillingController.createInvoice);
router.put('/:id', requireRole(...financeRoles), BillingController.updateInvoice);
router.patch('/:id/submit', requireRole(...financeRoles), BillingController.submitForApproval);
router.patch('/:id/approve', requireRole(...financeRoles), BillingController.approveInvoice);
router.patch('/:id/issue', requireRole(...financeRoles), BillingController.issueInvoice);
router.patch('/:id/send', requireRole(...financeRoles), BillingController.sendInvoice);
router.patch('/:id/void', requireRole(...financeRoles), BillingController.voidInvoice);
router.patch('/:id/cancel', requireRole(...financeRoles), BillingController.cancelInvoice);
router.delete('/:id', requireRole('SUPER_ADMIN', 'COMPANY_ADMIN'), BillingController.deleteInvoice);

export const billingRoutes = router;
