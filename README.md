# TransitOps Enterprise - Smart Fleet & Transport Operations Platform

TransitOps Enterprise is an AI-powered logistics, fleet, and transportation management platform designed for scale.

## Architecture Overview
TransitOps is designed as a modern enterprise monorepo workspace containing:
- **`apps/api`**: Node.js & Express REST API Backend.
- **`apps/web`**: React & Vite Frontend (shadcn/ui + Tailwind).
- **`database`**: Prisma schema and migration configurations.

### Key Technologies:
- **Frontend**: React, TypeScript, TailwindCSS, Vite, TanStack Query.
- **Backend**: Node.js, Express, TypeScript, Zod, Prisma ORM.
- **Database**: PostgreSQL (via Docker Compose).
- **Security**: Helmet, Express Rate Limit, CORS.
- **Testing**: Vitest, React Testing Library, Supertest.

## Project Structure
```
TransitOps/
├── apps/
│   ├── api/          # Express API (Controllers, Middlewares, Services)
│   └── web/          # React Frontend (Modules, Components, Layouts)
├── database/         # Prisma Schema and DB Seeds
├── docker-compose.yml# Production & local orchestrator
├── .github/          # CI/CD Workflows
└── package.json      # Root Workspace Configuration
```

## Quick Start (Docker)
To run the platform via Docker without installing local dependencies:

1. Copy the environment variables:
   ```bash
   cp .env.example .env
   ```
2. Spin up the containers (PostgreSQL, Backend API, NGINX Frontend):
   ```bash
   docker-compose up --build -d
   ```
3. Access the platform at `http://localhost`.

## Development Workflow (Local)
To run the application locally for development:

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the local database (if using Docker Compose just for DB):
   ```bash
   docker-compose up postgres -d
   ```
3. Run Prisma Migrations:
   ```bash
   npm run db:migrate --workspace=@transitops/api
   ```
4. Start Development Servers:
   ```bash
   npm run dev
   ```

## Environment Variables
See `.env.example` for all required keys.
- **`DATABASE_URL`**: Your PostgreSQL connection string.
- **`JWT_SECRET`**: Required for secure authentication sessions.
- **`VITE_API_URL`**: Used by the frontend to point to the backend API.

## Testing & CI/CD
- **Unit & Integration Tests**: `npm run test`
- **Build Verification**: `npm run build`
- CI/CD automatically runs linting, tests, and builds via GitHub Actions on PRs to `main`.

## Deployment Guide
1. Pull the repository onto your target production environment.
2. Configure your `.env` securely.
3. Build and launch with `docker-compose -f docker-compose.yml up --build -d`.
4. Ensure a Reverse Proxy (like Cloudflare or another NGINX layer) handles SSL termination.
