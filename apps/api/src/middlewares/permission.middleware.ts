import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { HttpException } from '../shared/exceptions/http.exception.js';
import { prisma } from '../database/prisma.js';
import type { AuthenticatedRequest } from './auth.middleware.js';

/**
 * Granular permission middleware.
 * Verifies that the user's role has the required module:action permission.
 *
 * @param module - Module identifier (e.g. 'fleet', 'trips', 'users')
 * @param action - Action identifier (e.g. 'read', 'write', 'delete')
 */
export function requirePermission(module: string, action: string) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = (req as AuthenticatedRequest).user;

      if (!user) {
        throw new HttpException(StatusCodes.UNAUTHORIZED, 'Authentication required');
      }

      // SUPER_ADMIN and COMPANY_ADMIN bypass permission checks
      if (user.role === 'SUPER_ADMIN' || user.role === 'COMPANY_ADMIN') {
        return next();
      }

      // Query if user's role has this permission
      const hasPermission = await prisma.rolePermission.findFirst({
        where: {
          roleId: user.roleId,
          permission: {
            module,
            action,
          },
        },
      });

      if (!hasPermission) {
        throw new HttpException(
          StatusCodes.FORBIDDEN,
          `Permission denied: Requires ${module}:${action}`,
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
