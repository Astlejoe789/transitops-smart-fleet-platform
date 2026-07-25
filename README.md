# TransitOps Smart Fleet Platform

TransitOps is an AI-powered Smart Fleet & Transport Operations Platform designed for logistics companies to manage vehicles, drivers, trips, maintenance, and expenses seamlessly.

## Project Overview

This monorepo contains the following workspace packages:
- **`apps/api`**: Node.js + Express backend powering the REST API.
- **`apps/web`**: React + Vite frontend dashboard for operations management.
- **`database`**: Prisma schema, migrations, and seed scripts.

## Tech Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Shadcn UI, Lucide Icons, Framer Motion, Axios, React Router, Recharts.
- **Backend**: Node.js, Express, TypeScript, Zod (validation), Prisma ORM, JSON Web Tokens (JWT), Bcrypt, Helmet, CORS, Express Rate Limit.
- **Database**: PostgreSQL (Neon Serverless).
- **Deployment**:
  - Frontend: Vercel
  - Backend: Railway

## Features

- **Fleet Management**: Vehicle tracking, document management, lifecycle status.
- **Driver Management**: Driver profiles, license tracking, assignments.
- **Trip Operations**: Dispatch board, route planning, trip lifecycle (Draft -> Scheduled -> In Transit -> Completed).
- **Maintenance**: Maintenance logs, scheduled servicing, parts inventory.
- **Financials**: Fuel logging, expense tracking, invoicing, payments.
- **CRM & Vendors**: Manage customers and third-party service vendors.
- **Role-Based Access Control**: Granular permissions (Super Admin, Company Admin, Fleet Manager, Dispatcher, Driver, Finance, Viewer).

## Architecture

The backend follows a modular, service-oriented architecture (`Controller -> Service -> Repository / ORM`).
The frontend follows a feature-module architecture, grouping components, hooks, services, and pages by domain (e.g., `modules/fleet`, `modules/trips`).

## Installation & Local Development

### Prerequisites
- Node.js 18+
- PostgreSQL database

### 1. Clone the repository
`git clone https://github.com/Astlejoe789/transitops-smart-fleet-platform.git`
`cd transitops-smart-fleet-platform`

### 2. Install dependencies
`npm install`

### 3. Environment Variables
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://user:pass@localhost:5432/transitops?schema=public"
PORT=3000
NODE_ENV=development
JWT_SECRET="your-super-secret-key-change-in-prod"
JWT_REFRESH_SECRET="your-refresh-secret-key"
JWT_ACCESS_EXPIRATION="15m"
JWT_REFRESH_EXPIRATION="7d"
VITE_API_URL="http://localhost:3000/api"
```

### 4. Database Setup
`npm run db:push`
`npm run db:generate`
`npm run db:seed`

### 5. Run the Application
`npm run dev`

## Production Deployment

### Frontend (Vercel)
1. Import the repository into Vercel.
2. Set the Root Directory to `apps/web`.
3. Configure the Build Command: `npm run build`
4. Set the Output Directory: `dist`
5. Add Environment Variable: `VITE_API_URL` pointing to the production Railway URL.

### Backend (Railway)
1. Import the repository into Railway.
2. Set the Root Directory to `apps/api`.
3. Add a PostgreSQL database in Railway and copy the `DATABASE_URL`.
4. Set Environment Variables: `DATABASE_URL`, `JWT_SECRET`, `NODE_ENV=production`, `FRONTEND_URL`.

### Running Prisma Migrations in Production
Prisma migrations do not run automatically on Railway by default. After deploying the backend, you must run the following commands against the production database:
`npx prisma migrate deploy --schema=database/prisma/schema.prisma`
`npm run db:seed`

## Demo Credentials

After running the seed script, the following demo accounts are available:
- **Company Admin**: `admin@transitops.com` / `Admin@123456`
- **Fleet Manager**: `fleet@transitops.com` / `Fleet@123456`
- **Dispatcher**: `dispatcher@transitops.com` / `Dispatch@123456`
