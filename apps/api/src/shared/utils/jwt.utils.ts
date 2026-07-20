import jwt from 'jsonwebtoken';
import { jwtConfig } from '../../config/jwt.config.js';
import type { JwtPayload } from '../types/index.js';

export interface UserTokenPayload extends JwtPayload {
  userId: string;
  email: string;
  companyId: string;
  branchId?: string | null;
  roleId: string;
  role: string;
}

/**
 * Generate JWT Access Token (short-lived)
 */
export function generateAccessToken(payload: UserTokenPayload): string {
  return jwt.sign(payload, jwtConfig.secret, {
    expiresIn: jwtConfig.accessExpiration as jwt.Secret | any,
  });
}

/**
 * Generate JWT Refresh Token (long-lived)
 */
export function generateRefreshToken(payload: UserTokenPayload): string {
  return jwt.sign({ userId: payload.userId, email: payload.email }, jwtConfig.refreshSecret, {
    expiresIn: jwtConfig.refreshExpiration as jwt.Secret | any,
  });
}

/**
 * Verify JWT Access Token
 */
export function verifyAccessToken(token: string): UserTokenPayload {
  return jwt.verify(token, jwtConfig.secret) as UserTokenPayload;
}

/**
 * Verify JWT Refresh Token
 */
export function verifyRefreshToken(token: string): { userId: string; email: string } {
  return jwt.verify(token, jwtConfig.refreshSecret) as { userId: string; email: string };
}
