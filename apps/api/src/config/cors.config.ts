import type { CorsOptions } from 'cors';

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5174',
  'http://localhost:3000'
];

if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

/**
 * CORS configuration.
 */
import { HttpException } from '../shared/exceptions/http.exception.js';

export const corsConfig: CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g., server-to-server or curl)
    if (!origin) return callback(null, true);

    const originToCheck = origin.replace(/\/$/, '');

    if (allowedOrigins.indexOf(originToCheck) !== -1) {
      return callback(null, true);
    }

    // Allow Vercel preview URLs for this specific project
    if (originToCheck.startsWith('https://transitops-smart-fleet-platform-web') && originToCheck.endsWith('.vercel.app')) {
      return callback(null, true);
    }

    return callback(new HttpException(403, 'Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
};
