/**
 * Application-wide constants.
 */
export const APP_CONFIG = {
  name: 'TransitOps',
  version: '0.1.0',
  description: 'AI-powered Smart Fleet & Transport Operations Platform',
  api: {
    baseUrl: import.meta.env.VITE_API_URL || '/api',
    timeout: 15000,
  },
  pagination: {
    defaultPage: 1,
    defaultLimit: 20,
    limitOptions: [10, 20, 50, 100],
  },
  auth: {
    tokenKey: 'accessToken',
    refreshTokenKey: 'refreshToken',
  },
} as const;
