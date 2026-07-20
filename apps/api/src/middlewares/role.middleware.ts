import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { HttpException } from '../shared/exceptions/http.exception.js';
import type { AuthenticatedRequest } from './auth.middleware.js';

/**
 * Role-based authorization middleware.
 * Enforces that the logged-in user possesses one of the allowed roles.
 *
 * @param allowedRoles - Array of allowed role names (e.g. ['SUPER_ADMIN', 'COMPANY_ADMIN'])
 */
export function requireRole(...allowedRoles: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const user = (req as AuthenticatedRequest).user;

    if (!user) {
      throw new HttpException(StatusCodes.UNAUTHORIZED, 'Authentication required');
    }

    if (!allowedRoles.includes(user.role)) {
      throw new HttpException(
        StatusCodes.FORBIDDEN,
        `Access denied. Required role: ${allowedRoles.join(' or ')}`,
      );
    }

    next();
  };
}
