<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/truck.svg" alt="TransitOps Logo" width="120" height="120" />
  <h1>?? TransitOps Smart Fleet Platform</h1>
  <p><strong>AI-powered Smart Fleet & Transport Operations Platform for Modern Logistics</strong></p>

  <p>
    <a href="https://reactjs.org/"><img src="https://img.shields.io/badge/React-18-blue?logo=react&logoColor=white" alt="React" /></a>
    <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node.js-18+-green?logo=node.js&logoColor=white" alt="Node.js" /></a>
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.5-blue?logo=typescript&logoColor=white" alt="TypeScript" /></a>
    <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white" alt="Tailwind CSS" /></a>
    <a href="https://www.postgresql.org/"><img src="https://img.shields.io/badge/PostgreSQL-Neon-336791?logo=postgresql&logoColor=white" alt="PostgreSQL" /></a>
    <a href="https://www.prisma.io/"><img src="https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma&logoColor=white" alt="Prisma" /></a>
  </p>
</div>

<hr />

## ?? Project Overview

**TransitOps** is an enterprise-grade, full-stack logistics and fleet management solution designed to streamline the lifecycle of transport operations. It provides role-based dashboards to manage vehicles, dispatch drivers, track expenses, schedule maintenance, and invoice customers seamlessly.

This repository is built as a highly scalable **Monorepo** (using npm workspaces) separating concerns cleanly between the API, the Web dashboard, and the database schema.

---

## ? Key Features

- ?? **Comprehensive Fleet Management:** Track vehicle lifecycles, maintenance logs, and document expiries.
- ????? **Driver & HR Operations:** Manage driver profiles, licenses, and assignments seamlessly.
- ?? **Intelligent Dispatch & Trips:** Plan routes, assign vehicles, and track trip statuses from draft to completion.
- ?? **Preventative Maintenance:** Schedule vehicle servicing and track inventory parts.
- ?? **Financial Engine:** Log fuel, approve expenses, and generate robust customer invoices.
- ?? **Granular RBAC:** Enterprise-ready Role-Based Access Control (`Super Admin`, `Company Admin`, `Dispatcher`, `Fleet Manager`, etc.).

---

## ??? Architecture

```mermaid
graph TD
    Client[Web Dashboard - React/Vite] -->|REST API - Axios| Gateway(API Gateway/Express)
    Gateway --> Auth[Auth Service / JWT]
    Gateway --> Services[Domain Services]
    Services --> DB[Prisma ORM]
    DB --> Neon[(Neon PostgreSQL)]
```

### Monorepo Structure
- ?? **`apps/api`**: Node.js + Express backend powering the robust REST API.
- ?? **`apps/web`**: React + Vite frontend dashboard featuring `Shadcn UI` and `Framer Motion`.
- ?? **`database`**: Centralized Prisma schema, migrations, and seed scripts.

---

## ??? Tech Stack & Decisions

| Layer | Technology | Rationale |
| --- | --- | --- |
| **Frontend** | React 18, Vite, Tailwind CSS | Fast HMR, highly customizable utility classes, modern hooks ecosystem. |
| **UI Components**| Shadcn UI, Radix Primitives | Accessible, unstyled primitives offering full control over component design. |
| **Backend** | Node.js, Express, TypeScript | High-performance asynchronous API with strict type safety across boundaries. |
| **Database** | PostgreSQL, Prisma ORM | Relational integrity with a strongly typed query builder and schema management. |
| **Security** | JWT, Bcrypt, Helmet, Zod | Robust payload validation, secure hashing, and HTTP header protection. |

---

## ?? Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/en/download/) (v18 or higher)
- [PostgreSQL](https://www.postgresql.org/) running locally or via a cloud provider like Neon.

### 1. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/Astlejoe789/transitops-smart-fleet-platform.git
cd transitops-smart-fleet-platform
npm install
```

### 2. Environment Variables
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

### 3. Database Initialization
Push the schema to your database and seed demo data:
```bash
npm run db:push
npm run db:generate
npm run db:seed
```

### 4. Run the Platform
```bash
# Starts both frontend and backend concurrently
npm run dev
```

---

## ?? Demo Credentials

After running the seed script, log in with these roles to explore the platform:

| Role | Email | Password |
| --- | --- | --- |
| **Admin** | `admin@transitops.com` | `Admin@123456` |
| **Fleet Manager**| `fleet@transitops.com` | `Fleet@123456` |
| **Dispatcher** | `dispatcher@transitops.com` | `Dispatch@123456` |

---

## ?? Production Deployment

- **Frontend (`apps/web`)**: Optimized for **Vercel**. Set root directory to `apps/web`, build command `npm run build`, and output to `dist`.
- **Backend (`apps/api`)**: Optimized for **Railway** or Docker. 
  - *Note on Migrations*: Run `npx prisma migrate deploy --schema=database/prisma/schema.prisma` against your production database after deployment.

---

<div align="center">
  <p>Built with ?? for modern logistics operations.</p>
</div>

