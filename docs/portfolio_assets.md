# Portfolio Assets & Preparation

This folder contains necessary assets to help showcase TransitOps for portfolio presentations, GitHub README files, and LinkedIn posts.

## Suggested Screenshots List
Capture these screens to create a compelling visual portfolio:
1. **The Dashboard (Dark Mode)**: Show the financial KPI charts and active trip counters.
2. **The Dispatch Board (Light Mode)**: Show the grid of active trips, drivers assigned, and status badges.
3. **Driver Details Page**: Highlight the clean Shadcn UI tab system (Profile, License, Medical, Vehicles).
4. **Theme Toggling**: A side-by-side split image of Light and Dark modes.
5. **Add Vehicle Modal**: Showcase the Zod-validated forms and responsive Dialog UI.

## Demo Walkthrough Outline
When recording a Loom or YouTube video demo, follow this flow (3-4 minutes):
1. **Intro (30s)**: "This is TransitOps, a full-stack Smart Fleet platform I built to solve X."
2. **Dashboard (30s)**: Point out real-time metrics and dynamic theming.
3. **Core CRUD (60s)**: Navigate to Fleet -> Add Vehicle -> Show it appear in the grid. 
4. **Dispatch Flow (60s)**: Navigate to Trips -> Show how a Trip links a Driver, Vehicle, and Customer together.
5. **Outro (30s)**: Discuss the tech stack (React Query, Express, Prisma) and where to find the code.

## Feature Highlights
- **Stunning UI**: Custom-tailored design system built on Tailwind v4 and Shadcn.
- **Type-Safe Full Stack**: End-to-end TypeScript utilizing Zod schemas that mirror Prisma models.
- **Performant Bundling**: Vite code-splitting implemented to keep the React vendor and UI token chunks exceptionally small.
- **Robust Role System**: Built-in JWT architecture supporting Admin, Dispatcher, and Manager roles.

## Architecture Explanation
- **Frontend**: A React 18 SPA. It strictly separates concerns: Pages handle layout, Components handle UI, and API clients (via TanStack React Query) handle data fetching, caching, and mutations.
- **Backend**: Express modular monolith. Organized by domain (e.g., `/modules/fleet`). Each module has a Controller, Service, and Repository pattern, ensuring business logic is isolated from HTTP and Database logic.
- **Database**: PostgreSQL mapped via Prisma. All tables utilize `createdAt`, `updatedAt`, and soft-delete strategies.
