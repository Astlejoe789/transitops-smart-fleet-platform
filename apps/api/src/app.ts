import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

import { corsConfig } from './config/cors.config.js';
import { apiRouter } from './routes/index.js';
import { errorMiddleware } from './middlewares/error.middleware.js';

/**
 * Express application factory.
 */
export function createApp() {
  const app = express();

  // ---- Security ----
  app.use(helmet());
  app.use(cors(corsConfig));
  
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 1000, // higher limit for enterprise API
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use(limiter);

  // ---- Parsing ----
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // ---- Compression ----
  app.use(compression());

  // ---- Logging ----
  app.use(morgan('dev'));

  // ---- Health Check ----
  app.get('/health', (_req, res) => {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'TransitOps API',
      version: '0.1.0',
    });
  });

  // ---- Readiness Check (DB) ----
  app.get('/readiness', async (_req, res) => {
    try {
      const { prisma } = await import('./database/prisma.js');
      await prisma.$queryRaw`SELECT 1`;
      res.status(200).json({ status: 'ready', database: 'connected' });
    } catch (error) {
      res.status(503).json({ status: 'not_ready', database: 'disconnected', error: String(error) });
    }
  });

  // ---- API Routes ----
  app.use('/api', apiRouter);

  // ---- Global Error Handler (must be last) ----
  app.use(errorMiddleware);

  return app;
}
