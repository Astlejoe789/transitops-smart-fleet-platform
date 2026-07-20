import type { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

/**
 * Standardized API response helpers.
 */
export class ApiResponse {
  static success<T>(res: Response, data: T, message = 'Success', statusCode = StatusCodes.OK) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static created<T>(res: Response, data: T, message = 'Created successfully') {
    return ApiResponse.success(res, data, message, StatusCodes.CREATED);
  }

  static paginated<T>(
    res: Response,
    data: T[],
    meta: { total: number; page: number; limit: number },
  ) {
    return res.status(StatusCodes.OK).json({
      success: true,
      data,
      meta: {
        ...meta,
        totalPages: Math.ceil(meta.total / meta.limit),
      },
    });
  }

  static noContent(res: Response) {
    return res.status(StatusCodes.NO_CONTENT).send();
  }
}
