# TransitOps — Smart Fleet Platform

## 📖 Portfolio Description
TransitOps is an enterprise-grade, full-stack logistics and transport operations platform. Designed to replace fragmented spreadsheets and disconnected legacy software, TransitOps provides a centralized hub for fleet managers, dispatchers, and administrators. It seamlessly links vehicle maintenance, driver credentials, active trip dispatching, and financial invoicing into one cohesive, highly performant dashboard.

## ✨ Feature Summary
- **Intelligent Dispatch Board**: Real-time routing and assignment of vehicles/drivers to customer trips.
- **Fleet & Driver Lifecycle**: Complete CRUD matrix for vehicles (maintenance, fuel logs) and drivers (medical certs, licenses).
- **Financial Module**: Integrated CRM for vendors/customers, operational expense tracking, and invoice generation.
- **Enterprise UI**: Custom Dark/Light mode theme utilizing Shadcn UI and Tailwind CSS v4 for a premium user experience.
- **RBAC Security**: JWT authentication with distinct access boundaries for Admins vs. Dispatchers.

## 🏗️ Architecture Overview
- **Client (React 18)**: Built with Vite and TypeScript. Employs TanStack React Query for aggressive server-state caching and invalidation, decoupling the UI from loading/error boundary logic.
- **Server (Express.js)**: Structured as a Modular Monolith (Controller -> Service -> Repository), heavily utilizing Zod to validate all incoming requests.
- **Database (PostgreSQL)**: Modeled and queried securely utilizing Prisma ORM, providing end-to-end type safety from the DB tables directly to the React frontend.

## 🧗 Challenges Solved
1. **Layout Drift & UI Inconsistencies**: The legacy codebase had fragmented page wrappers causing responsive breakages. I engineered a strict `PageContainer` and `PageHeader` system, auditing and refactoring over 40+ routes to enforce universal design tokens.
2. **Vite Bundle Bloat**: The initial SPA payload exceeded standard chunk limits (>500kb). I authored a custom Rollup `manualChunks` configuration to isolate React-DOM, UI primitives, and Data-Fetching libraries, vastly improving browser caching and Time-to-Interactive (TTI).

## 🧠 Technical Decisions
- **Why Shadcn UI?** Instead of utilizing a rigid component library like MUI, Shadcn copies Radix accessible primitives directly into the codebase. This allowed me absolute precision in styling with Tailwind without overriding heavy default CSS.
- **Why Prisma?** The developer experience of Prisma is unmatched for relational DBs. The auto-generated types meant if I dropped a column in PostgreSQL, my TypeScript backend would throw a compiler error instantly, preventing runtime crashes.

---

## 🔗 Links
- [Live Interactive Demo](#)
- [GitHub Source Code](#)

## 📸 Gallery
*(Placeholders for screenshots)*
- `[Screenshot: Dark Mode Dashboard]`
- `[Screenshot: Dispatch Trips Board]`
- `[Screenshot: Driver Details Tabbed View]`
- `[Screenshot: Add Vehicle Validation Form]`
