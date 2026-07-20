import { Router } from 'express';
import { AuthController } from './controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { asyncHandler } from '../../shared/utils/index.js';
import {
  loginSchema,
  registerCompanyAdminSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
} from './validation.js';

const router = Router();
const controller = new AuthController();

// Public routes
router.post('/login', validate(loginSchema), asyncHandler(controller.login));
router.post(
  '/register',
  validate(registerCompanyAdminSchema),
  asyncHandler(controller.registerCompanyAdmin),
);
router.post('/refresh-token', validate(refreshTokenSchema), asyncHandler(controller.refreshToken));
router.post(
  '/forgot-password',
  validate(forgotPasswordSchema),
  asyncHandler(controller.forgotPasswordPlaceholder),
);
router.post(
  '/reset-password',
  validate(resetPasswordSchema),
  asyncHandler(controller.resetPasswordPlaceholder),
);

// Protected routes (Authentication Required)
router.use(authMiddleware);

router.get('/me', asyncHandler(controller.me));
router.post('/logout', asyncHandler(controller.logout));
router.post('/change-password', validate(changePasswordSchema), asyncHandler(controller.changePassword));

export const authRoutes = router;
