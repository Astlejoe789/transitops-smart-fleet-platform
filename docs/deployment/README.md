# Deployment Guide

## Environments

| Environment | Description |
|-------------|-------------|
| Development | Local development with hot-reload |
| Staging | Pre-production testing |
| Production | Live deployment |

## Prerequisites

- Node.js >= 18.0.0
- PostgreSQL >= 14
- npm >= 9

## Local Development

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development servers
npm run dev:web   # Frontend: http://localhost:5173
npm run dev:api   # Backend:  http://localhost:3001
```

## Docker (Future)

> Docker and Docker Compose configurations will be added for containerized deployment.

## CI/CD (Future)

> GitHub Actions or similar CI/CD pipeline will be configured for:
> - Automated testing
> - Linting & formatting checks
> - Build verification
> - Deployment to staging/production
