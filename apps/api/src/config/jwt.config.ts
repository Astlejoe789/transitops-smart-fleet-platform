import { env } from './env.config.js';

/**
 * JWT configuration constants.
 */
export const jwtConfig = {
  secret: env.JWT_SECRET,
  refreshSecret: env.JWT_REFRESH_SECRET || `${env.JWT_SECRET}_refresh`,
  accessExpiration: env.JWT_ACCESS_EXPIRATION,
  refreshExpiration: env.JWT_REFRESH_EXPIRATION,
};
