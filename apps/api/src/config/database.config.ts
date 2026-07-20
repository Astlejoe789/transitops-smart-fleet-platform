import { env } from './env.config.js';

/**
 * Database configuration constants.
 */
export const databaseConfig = {
  url: env.DATABASE_URL,
  logging: env.NODE_ENV === 'development',
};
