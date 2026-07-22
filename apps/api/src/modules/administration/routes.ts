import { Router } from 'express';
import { AdministrationController } from './controller.js';
import { authMiddleware, requirePermission } from '../../middlewares/index.js';

const router = Router();
const controller = new AdministrationController();

router.use(authMiddleware);

// Restrict all to 'administration' module 'manage' or 'read' action
// To keep it simple, we use a global requirePermission check for the whole router
// In a highly granular app, you might map 'users:read', 'roles:write', etc.
router.use(requirePermission('administration', 'manage') as any);

// Users
router.get('/users', controller.getUsers as any);
router.patch('/users/:id/status', controller.updateUserStatus as any);

// Roles
router.get('/roles', controller.getRoles as any);
router.get('/permissions', controller.getPermissions as any);
router.put('/roles/:id/permissions', controller.assignRolePermissions as any);

// Settings (category = AI, SECURITY, GENERAL, NOTIFICATION, etc)
router.get('/settings/:category', controller.getSettings as any);
router.put('/settings/:category', controller.updateSettings as any);

// Audit
router.get('/audit-logs', controller.getAuditLogs as any);

// Health
router.get('/health', controller.getSystemHealth as any);

export const administrationRoutes = router;
