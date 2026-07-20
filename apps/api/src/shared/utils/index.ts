/**
 * Shared utility functions for the backend.
 */

/**
 * Async route handler wrapper to catch errors and pass to error middleware.
 */
export function asyncHandler(
  fn: (req: any, res: any, next: any) => Promise<any>,
) {
  return (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * Generate a unique identifier (placeholder — use uuid in production).
 */
export function generateId(): string {
  return crypto.randomUUID();
}

export { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken } from './jwt.utils.js';
export { hashPassword, comparePassword } from './password.utils.js';
