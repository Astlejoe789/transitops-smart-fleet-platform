import { createApp } from './app.js';
import { env } from './config/env.config.js';

const app = createApp();

app.listen(env.PORT, () => {
  console.log(`🚛 TransitOps API running on http://localhost:${env.PORT}`);
  console.log(`📋 Health check: http://localhost:${env.PORT}/health`);
  console.log(`🌍 Environment: ${env.NODE_ENV}`);
});
