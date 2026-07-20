# Architecture Documentation

## System Overview

TransitOps follows a **monorepo architecture** with npm workspaces, separating concerns into distinct applications and packages.

## High-Level Architecture

```
┌─────────────────────────────────────────────┐
│                 Client (Web)                │
│          React + Vite + TypeScript          │
│         Tailwind CSS + shadcn/ui            │
├─────────────────────────────────────────────┤
│                 API Gateway                 │
│           Express.js + TypeScript           │
│         JWT Auth + Zod Validation           │
├─────────────────────────────────────────────┤
│               Data Layer                    │
│         Prisma ORM + PostgreSQL             │
└─────────────────────────────────────────────┘
```

## Architecture Principles

- **Feature-Based (Domain-Driven) Architecture**: Code is organized by business domain, not technical concern
- **Layered Architecture**: Controller → Service → Repository pattern for separation of concerns
- **Type Safety**: TypeScript strict mode across the entire stack
- **Validated Configuration**: Environment variables validated with Zod at startup
- **Centralized Error Handling**: Global error middleware with structured HTTP exceptions

## Module Structure

Each feature module is self-contained with its own:
- **Frontend**: Pages, components, hooks, services, schemas, types, constants, utils
- **Backend**: Controller, service, repository, routes, validation, DTOs, types, constants

## Feature Modules

| # | Module | Description |
|---|--------|-------------|
| 1 | Auth | Authentication, authorization, RBAC |
| 2 | Dashboard | Overview, KPIs, widgets |
| 3 | Fleet | Vehicle registration, tracking, status |
| 4 | Drivers | Driver profiles, assignments, documents |
| 5 | Trips | Trip planning, tracking, history |
| 6 | Maintenance | Service schedules, repair logs |
| 7 | Fuel | Fuel consumption, cost tracking |
| 8 | Expenses | Operational expense management |
| 9 | Billing | Invoice generation, billing cycles |
| 10 | Payments | Payment processing, receipts |
| 11 | Customers | Customer CRM, contracts |
| 12 | Vendors | Vendor management, procurement |
| 13 | Reports | Operational reports, exports |
| 14 | Analytics | Data visualization, trends |
| 15 | AI | AI-powered insights, predictions |
| 16 | Notifications | Alert system, in-app notifications |
| 17 | Administration | System admin, user management |
| 18 | Settings | App configuration, preferences |
