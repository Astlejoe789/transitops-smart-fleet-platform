import type { CorsOptions } from 'cors';

const defaultOrigins = [
  'https://transitops-smart-fleet-platform-web-roan.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000'
];

/**
 * CORS configuration.
 */
export const corsConfig: CorsOptions = {
  origin: process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : defaultOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
};
