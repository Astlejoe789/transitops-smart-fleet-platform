import { Router } from 'express';
import { settingsController } from './controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { requirePermission } from '../../middlewares/permission.middleware.js';

const router = Router();
router.use(authMiddleware);

router.get(
  '/',
  requirePermission('settings', 'read'),
  settingsController.getSettings
);

router.put(
  '/:category',
  requirePermission('settings', 'update'),
  settingsController.updateSettings
);

export const settingsRoutes = router;
