# 🚛 TransitOps

> AI-powered Smart Fleet & Transport Operations Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite)](https://vitejs.dev/)
[![Express](https://img.shields.io/badge/Express-4-000000?logo=express)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql)](https://www.postgresql.org/)

---

## Overview

TransitOps is a comprehensive fleet management and transport operations platform designed for logistics companies. It provides real-time fleet tracking, driver management, trip planning, maintenance scheduling, expense tracking, billing, and AI-powered insights.

## Screenshots

> *Screenshots will be added here once the UI is finalized.*

## Tech Stack

### Frontend
- **React** — UI library
- **TypeScript** — Type safety
- **Vite** — Build tool & dev server
- **Tailwind CSS v4** — Utility-first styling
- **shadcn/ui** — Component library
- **React Router** — Client-side routing
- **TanStack Query** — Server state management
- **React Hook Form + Zod** — Forms & validation

### Backend
- **Node.js + Express** — API server
- **TypeScript** — Type safety
- **Prisma ORM** — Database access & migrations
- **PostgreSQL** — Relational database
- **JWT** — Authentication
- **Zod** — Runtime validation

## Project Structure

```
TransitOps/
├── apps/
│   ├── web/                 # React frontend (Vite)
│   │   └── src/
│   │       ├── app/         # App shell
│   │       ├── router/      # Route configuration
│   │       ├── layouts/     # Page layouts
│   │       ├── providers/   # React context providers
│   │       ├── guards/      # Auth & role guards
│   │       ├── modules/     # Feature modules (18)
│   │       ├── components/  # Shared components
│   │       ├── hooks/       # Shared hooks
│   │       ├── services/    # API service layer
│   │       ├── api/         # Axios client config
│   │       ├── store/       # Global state
│   │       ├── theme/       # Theme configuration
│   │       ├── types/       # Shared types
│   │       ├── constants/   # Shared constants
│   │       ├── utils/       # Utility functions
│   │       ├── lib/         # Library wrappers
│   │       ├── assets/      # Static assets
│   │       └── styles/      # Global styles
│   └── api/                 # Express backend
│       └── src/
│           ├── config/      # App configuration
│           ├── database/    # Prisma client
│           ├── middlewares/ # Express middlewares
│           ├── modules/     # Feature modules (18)
│           ├── routes/      # Route aggregator
│           └── shared/      # Shared utilities
├── database/                # Database management
│   ├── prisma/              # Schema & config
│   ├── migrations/          # Migration history
│   ├── seeds/               # Seed scripts
│   ├── erd/                 # Entity diagrams
│   └── backups/             # DB backups
├── docs/                    # Documentation
│   ├── architecture/
│   ├── api/
│   ├── database/
│   ├── deployment/
│   ├── ui-ux/
│   └── roadmap/
└── packages/                # Shared packages (future)
```

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- PostgreSQL >= 14
- npm >= 9

### Installation

```bash
# Clone the repository
git clone <repo-url> TransitOps
cd TransitOps

# Install all dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Run database migrations
npx prisma migrate dev --schema=database/prisma/schema.prisma

# Start development servers
npm run dev:web   # Frontend on http://localhost:5173
npm run dev:api   # Backend on http://localhost:3001
```

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start all dev servers |
| `npm run dev:web` | Start frontend only |
| `npm run dev:api` | Start backend only |
| `npm run build` | Build all packages |
| `npm run lint` | Run ESLint |
| `npm run format` | Format with Prettier |

## Feature Modules

| Module | Description |
|--------|-------------|
| Auth | Authentication & RBAC |
| Dashboard | Overview & KPIs |
| Fleet | Vehicle management |
| Drivers | Driver profiles & assignments |
| Trips | Trip planning & tracking |
| Maintenance | Service schedules & logs |
| Fuel | Fuel consumption tracking |
| Expenses | Expense management |
| Billing | Invoicing & billing |
| Payments | Payment processing |
| Customers | Customer CRM |
| Vendors | Vendor management |
| Reports | Operational reports |
| Analytics | Data analytics |
| AI | AI-powered insights |
| Notifications | Alert system |
| Administration | System administration |
| Settings | App configuration |

## Roadmap

- [x] **Phase 1:** Enterprise Project Foundation
- [x] **Phase 2:** PostgreSQL + Prisma Database Schema
- [x] **Phase 3:** Authentication & RBAC + SaaS Layout
- [x] **Phase 4:** Executive Dashboard
- [x] **Phase 5:** Fleet Management Module
- [ ] **Phase 6:** Driver Management
- [ ] **Phase 7:** Trip & Dispatch Operations
- [ ] **Phase 8:** Maintenance & Fuel Logs
- [ ] **Phase 9:** Billing & Expenses
- [ ] **Phase 10:** AI Insights & Reports

## License

Private — All rights reserved.

## Author

Astlejoe789
