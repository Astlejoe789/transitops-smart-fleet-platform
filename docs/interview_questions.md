# TransitOps Interview Questions & Answers

Here are 25 highly likely interview questions based on the TransitOps architecture, alongside strong technical answers.

### Architecture & System Design
1. **Q: Why did you choose a modular monolith instead of microservices?**
   **A:** For a v1.0.0 application scaling from zero, microservices introduce unnecessary operational complexity (network latency, distributed tracing, complex CI/CD). A modular monolith (separating `/fleet`, `/trips`, `/drivers` by folder) keeps business logic isolated but deployment simple.
2. **Q: How does data flow from the database to the client?**
   **A:** PostgreSQL -> Prisma ORM -> Repository Layer -> Service Layer -> Controller (JSON via Express) -> React Query -> UI Component.
3. **Q: Why separate the Service and Repository layers?**
   **A:** The Repository strictly handles Prisma/DB queries. The Service handles business logic. This makes unit testing easier—I can mock the Repository without touching the DB, and test the Service logic in isolation.
4. **Q: How did you handle authentication?**
   **A:** I implemented JWTs. Upon login, a signed token is generated containing the user's ID and Role. The Express API uses a middleware to verify this token and attach the user payload to the request object for RBAC (Role-Based Access Control).
5. **Q: What happens if the database goes down?**
   **A:** The Express API has global error handling middleware. Prisma connection errors are caught and transformed into a generic 500 response, while React Query on the frontend catches the 500 and renders an Error Boundary fallback UI rather than crashing the app.

### Frontend (React & Vite)
6. **Q: Why use Vite instead of Create React App?**
   **A:** CRA uses Webpack, which bundles the entire app during dev, leading to slow HMR (Hot Module Replacement). Vite uses native ES modules during dev, making startup and HMR nearly instant regardless of app size.
7. **Q: What is React Query solving for you?**
   **A:** It eliminates the need for `useEffect` data fetching and Redux for server-state. It handles caching, background refetching, deduping multiple requests, and provides clean `isLoading` / `isError` flags.
8. **Q: How did you fix the large bundle size warning?**
   **A:** I configured Rollup `manualChunks` in `vite.config.ts`. I grouped `react` and `react-dom` into a `react-vendor` chunk, and `lucide-react` into a `ui-vendor` chunk. This allows the browser to cache these large libraries permanently, only downloading the small feature code when I push updates.
9. **Q: How did you implement Dark Mode?**
   **A:** I used `next-themes` combined with Tailwind CSS CSS variables. When the toggle is clicked, a `dark` class is appended to the HTML root, flipping the HSL variables that Shadcn UI components rely on.
10. **Q: How does routing work in your SPA?**
    **A:** I used React Router v6. To improve performance, I wrapped route components in `React.lazy()` and `<Suspense>`, meaning the code for the Billing page is only downloaded when the user actually navigates there.

### Backend (Node, Express, Prisma, Zod)
11. **Q: What is the purpose of Zod in this project?**
    **A:** Zod provides runtime schema validation. While TypeScript checks types at compile time, Zod ensures the actual JSON payload hitting the Express controller from an external client matches the expected shape before hitting the database.
12. **Q: Explain soft-deletes and why you used them.**
    **A:** Instead of `DELETE FROM`, I update an `isDeleted` boolean or `deletedAt` timestamp. In logistics, if you hard-delete a Driver, all historical Trips linked to them might break via foreign key constraints. Soft-delete preserves historical integrity.
13. **Q: How does Prisma compare to TypeORM or Sequelize?**
    **A:** Prisma's schema is highly readable, and its generated client is deeply typed. Unlike TypeORM which relies on decorators, Prisma creates types based on the schema file, meaning if I change a column, my TypeScript code instantly fails compilation where it's used incorrectly.
14. **Q: How do you handle pagination?**
    **A:** The API accepts `page` and `limit` queries. The Controller calculates `skip` and `take` for Prisma. It returns the data array alongside metadata (totalCount, totalPages) so the React Table knows how many pages exist.
15. **Q: How do you prevent users from accessing admin routes?**
    **A:** A custom `requireRole(['ADMIN'])` middleware sits on restricted Express routes. It checks the JWT payload's role array and returns a 403 Forbidden if the user lacks clearance.

### General Engineering & Operations
16. **Q: What was the hardest bug you fixed?**
    **A:** (Example) Standardizing the legacy layout. Multiple pages had hardcoded padding and max-widths causing random layout shifts. I had to audit 40 routes and replace them with a unified `PageContainer` component.
17. **Q: How is the app deployed?**
    **A:** Vercel for the frontend, Railway for the backend and Postgres. I use a `vercel.json` to handle client-side routing rewrites, and `railway.json` with Nixpacks for the Express server.
18. **Q: How do you handle environment variables safely?**
    **A:** They are never committed to Git (added to `.gitignore`). I use `.env` locally and configure them directly in the Vercel/Railway dashboards for production.
19. **Q: How do you ensure code quality?**
    **A:** Before any release, the CI requires `npm run lint` (ESLint) and `tsc` (TypeScript compiler) to pass with zero errors. 
20. **Q: Why use Tailwind over standard CSS or SASS?**
    **A:** Tailwind's utility classes prevent CSS bloat. Instead of writing custom `.card` classes that grow indefinitely, Tailwind enforces a constrained design system of standard margins and colors, making it highly maintainable.
21. **Q: What are React Hooks, and which ones did you use most?**
    **A:** Hooks allow functional components to hook into React state and lifecycle. I heavily used `useState` for UI toggles, and custom hooks like `useQuery` (from React Query) for data fetching. I specifically minimized `useEffect` to avoid race conditions.
22. **Q: How would you scale this application?**
    **A:** If traffic spiked, I would implement Redis caching for heavily read endpoints (like Dashboard KPIs), vertically scale the Railway database instance, and eventually split the modular monolith into microservices based on domain boundaries.
23. **Q: How did you model the Trip -> Vehicle relationship?**
    **A:** It's a One-to-Many relationship. A Vehicle can have many Trips over its lifetime, but a Trip is assigned exactly one Vehicle. This is enforced via Foreign Keys in PostgreSQL/Prisma.
24. **Q: What is a REST API?**
    **A:** Representational State Transfer. It means my Express server relies on standard HTTP verbs (GET, POST, PUT, DELETE) and standard URL paths (`/api/fleet/:id`) to perform CRUD operations statelessly.
25. **Q: Looking back, what would you do differently?**
    **A:** I would have implemented End-to-End testing (Playwright) earlier in the development lifecycle. Relying entirely on manual functional testing became tedious as the application grew to 40+ routes.
