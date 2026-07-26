# TransitOps: Interview Preparation Guide

This document is designed to help you confidently discuss TransitOps during technical interviews.

## ⏱️ Project Summary (2-Minute Elevator Pitch)
"For my recent project, I built TransitOps, a full-stack enterprise platform for transport and fleet operations. It solves the problem of disconnected logistics by unifying vehicle tracking, driver credentials, dispatching, and financial billing into one dashboard. I engineered the frontend as a React SPA using Vite, Tailwind v4, and Shadcn UI to deliver a highly premium, dark-mode ready interface. The backend is an Express-based REST API utilizing Node.js, TypeScript, and Prisma ORM to communicate with a PostgreSQL database. I personally implemented strict role-based access control, TanStack Query for optimal client-side caching, and deployed the system utilizing Vercel and Railway. It was a massive undertaking that taught me how to structure scalable, modular monoliths."

## 🏗️ Technical Architecture
- **Why React + Vite?** I chose Vite over standard CRA/Webpack for significantly faster HMR during development and granular chunk optimization in production.
- **Why Prisma?** Prisma provides end-to-end type safety. Instead of writing raw SQL or dealing with messy ORM configurations, my database schemas generate strict TypeScript types that my Express services consume.
- **Why React Query?** State management for server-state is notoriously difficult. Redux is too verbose for simple CRUD. React Query handles loading states, error boundaries, and cache invalidation elegantly out of the box.

## 🧗 Challenges Faced & Problems Solved
**Challenge**: Legacy pages were causing UI layout drift. Some pages had custom padding, others used hardcoded max-widths.
**Solution**: I architected a unified `PageContainer` and `PageHeader` system. I audited the entire 40-route application and systematically refactored every screen to use this standard, resulting in a cohesive design system and drastically less code duplication.

**Challenge**: The Vite build was throwing warnings for chunk sizes exceeding 500kb, which negatively impacted application load times.
**Solution**: I implemented a custom Rollup `manualChunks` strategy in `vite.config.ts`, splitting `react-vendor`, `ui-vendor`, and `query-vendor` into explicit bundles. This solved the warning and optimized browser caching.

## 🎨 Design Decisions
- **Shadcn over Bootstrap/MUI**: I wanted complete control over the accessibility and styling. Shadcn isn't an NPM package; it copies Radix primitives directly into the codebase, allowing me to tailor every component precisely to the Tailwind v4 tokens.
- **Modular Monolith**: Instead of a scattered microservice architecture (which is overkill for a v1), I structured the Express backend into distinct domain modules (`/fleet`, `/trips`, `/drivers`) using a Controller-Service-Repository pattern. This allows for an easy microservice migration in the future if scale demands it.

## 🚀 Deployment Process
I utilized modern PaaS (Platform as a Service) solutions:
- **Frontend**: Vercel reads from `apps/web`. I wrote a custom `vercel.json` to handle React Router client-side rewrites.
- **Backend/DB**: Railway hosts the PostgreSQL instance and runs the Express API utilizing Nixpacks. I configured a `railway.json` for explicit health checks and start commands.

## 🔮 Future Improvements
If I were to continue developing this for a real client, my next steps would be:
1. Setting up comprehensive End-to-End tests with Playwright to safeguard critical paths like Trip creation.
2. Integrating WebSockets (Socket.io) to allow the dispatch board to receive live updates without requiring React Query to poll the server.
