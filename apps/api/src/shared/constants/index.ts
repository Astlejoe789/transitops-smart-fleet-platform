/**
 * Shared constants for the backend.
 */

export const API_PREFIX = '/api';
export const API_VERSION = 'v1';

export const PAGINATION_DEFAULTS = {
  page: 1,
  limit: 20,
  maxLimit: 100,
} as const;

export const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  MANAGER: 'manager',
  DISPATCHER: 'dispatcher',
  DRIVER: 'driver',
  VIEWER: 'viewer',
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];
