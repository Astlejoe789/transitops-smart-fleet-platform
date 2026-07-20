import type { CorsOptions } from 'cors';
import { env } from './env.config.js';

/**
 * CORS configuration.
 */
export const corsConfig: CorsOptions = {
  origin: env.CORS_ORIGIN.split(',').map((origin) => origin.trim()),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
