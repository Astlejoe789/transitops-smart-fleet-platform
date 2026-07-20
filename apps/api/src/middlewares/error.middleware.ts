import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { HttpException } from '../shared/exceptions/http.exception.js';

/**
 * Global error handling middleware.
 * Must be the last middleware registered on the app.
 */
export function errorMiddleware(
  error: Error | HttpException,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (error instanceof HttpException) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
      statusCode: error.statusCode,
      errors: error.errors,
    });
    return;
  }

  // Unhandled errors
  console.error('Unhandled error:', error);
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: 'Internal server error',
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
  });
}
