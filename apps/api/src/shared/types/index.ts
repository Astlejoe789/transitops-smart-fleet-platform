/**
 * Shared TypeScript types for the backend.
 */

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export interface AuthenticatedRequest extends Express.Request {
  user: JwtPayload;
}
