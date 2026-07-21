import { Router } from 'express';
import { ExpenseController } from './controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { requireRole } from '../../middlewares/role.middleware.js';
import { UserRole } from '@prisma/client';

const router = Router();

// Apply authentication to all expense routes
router.use(authMiddleware);

// Analytics and Dashboard (must be defined before /:id routes)
router.get('/dashboard', ExpenseController.getDashboard);
router.get('/analytics', ExpenseController.getAnalytics);

// CRUD routes
router.get('/', ExpenseController.getExpenses);
router.get('/:id', ExpenseController.getExpenseById);

// Create expense (Allowed by anyone with operational role, typically Driver, Fleet Manager, Admin)
router.post('/', requireRole(
  UserRole.SUPER_ADMIN, 
  UserRole.COMPANY_ADMIN, 
  UserRole.BRANCH_MANAGER, 
  UserRole.FLEET_MANAGER,
  UserRole.FINANCE_MANAGER,
  UserRole.DISPATCHER,
  UserRole.DRIVER
), ExpenseController.createExpense);

// Update expense
router.put('/:id', requireRole(
  UserRole.SUPER_ADMIN, 
  UserRole.COMPANY_ADMIN, 
  UserRole.BRANCH_MANAGER, 
  UserRole.FLEET_MANAGER,
  UserRole.FINANCE_MANAGER
), ExpenseController.updateExpense);

// Status and approval workflow (Finance/Manager restricted)
router.patch('/:id/status', requireRole(
  UserRole.SUPER_ADMIN, 
  UserRole.COMPANY_ADMIN, 
  UserRole.BRANCH_MANAGER, 
  UserRole.FINANCE_MANAGER
), ExpenseController.updateExpenseStatus);

// Delete/Restore
router.delete('/:id', requireRole(
  UserRole.SUPER_ADMIN, 
  UserRole.COMPANY_ADMIN,
  UserRole.FINANCE_MANAGER
), ExpenseController.deleteExpense);

router.patch('/:id/restore', requireRole(
  UserRole.SUPER_ADMIN, 
  UserRole.COMPANY_ADMIN,
  UserRole.FINANCE_MANAGER
), ExpenseController.restoreExpense);

export default router;
