import dotenv from 'dotenv';
import path from 'path';
import { existsSync } from 'fs';
import { z } from 'zod';

// Load .env before validation — search up the directory tree for monorepo root
function findEnvFile(): string {
  let dir = process.cwd();
  for (let i = 0; i < 5; i++) {
    const envPath = path.join(dir, '.env');
    if (existsSync(envPath)) return envPath;
    dir = path.dirname(dir);
  }
  return path.join(process.cwd(), '.env');
}

dotenv.config({ path: findEnvFile() });

/**
 * Zod-validated environment configuration.
 * Fails fast at startup if required env vars are missing.
 */
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3001),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
  JWT_REFRESH_SECRET: z.string().optional(),
  JWT_ACCESS_EXPIRATION: z.string().default('15m'),
  JWT_REFRESH_EXPIRATION: z.string().default('7d'),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  LOG_LEVEL: z.string().default('debug'),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900000),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().default(100),
});

export type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error('❌ Invalid environment variables:');
    console.error(parsed.error.flatten().fieldErrors);
    process.exit(1);
  }

  return parsed.data;
}

export const env = validateEnv();
