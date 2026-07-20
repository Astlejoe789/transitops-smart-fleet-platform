import type { Request, Response, NextFunction } from 'express';
import type { ZodSchema } from 'zod';
import { HttpException } from '../shared/exceptions/http.exception.js';
import { StatusCodes } from 'http-status-codes';

/**
 * Request validation middleware using Zod schemas.
 *
 * @param schema - Zod schema to validate against
 * @param source - Which part of the request to validate ('body' | 'query' | 'params')
 */
export function validate(schema: ZodSchema, source: 'body' | 'query' | 'params' = 'body') {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors as Record<string, string[]>;
      throw new HttpException(StatusCodes.BAD_REQUEST, 'Validation failed', errors);
    }

    req[source] = result.data;
    next();
  };
}
