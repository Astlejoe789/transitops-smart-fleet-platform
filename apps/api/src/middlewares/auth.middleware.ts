import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { HttpException } from '../shared/exceptions/http.exception.js';
import { verifyAccessToken, type UserTokenPayload } from '../shared/utils/jwt.utils.js';

export interface AuthenticatedRequest extends Request {
  user: UserTokenPayload;
}

/**
 * JWT authentication middleware.
 * Verifies Bearer access token and attaches decoded payload to request.
 */
export function authMiddleware(req: Request, _res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new HttpException(StatusCodes.UNAUTHORIZED, 'Access token is missing');
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);

    (req as AuthenticatedRequest).user = decoded;
    next();
  } catch (error) {
    if (error instanceof HttpException) {
      next(error);
    } else {
      next(new HttpException(StatusCodes.UNAUTHORIZED, 'Invalid or expired access token'));
    }
  }
}
