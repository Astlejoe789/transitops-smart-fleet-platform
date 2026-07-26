🚀 I'm incredibly excited to announce the v1.0.0 release of my capstone project: **TransitOps**!

TransitOps is a full-stack, enterprise-grade Smart Fleet and Transport Operations platform I built from the ground up. I noticed how fragmented logistics operations can be—jumping between spreadsheets for dispatching, vehicle maintenance, and driver payroll. I wanted to solve that by unifying everything into a single, highly performant dashboard.

🛠️ **The Tech Stack:**
- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS v4, Shadcn UI, React Query
- **Backend**: Node.js, Express, Prisma ORM, Zod Validation
- **Database**: PostgreSQL
- **Hosting**: Vercel (Web) & Railway (API/DB)

🧠 **Key Technical Learnings:**
- **Architecture**: Structuring a scalable modular monolith in Node/Express (Controller-Service-Repository pattern).
- **State Management**: Moving away from Redux and letting TanStack React Query handle server-state caching, loading boundaries, and mutations.
- **Performance**: Configuring Vite Rollup `manualChunks` to strictly decouple React vendor code from UI components, heavily optimizing Time-to-Interactive metrics.
- **End-to-End Type Safety**: Passing Prisma schema types seamlessly through Express controllers directly into the React frontend.

I put a massive focus on UI/UX polish (yes, there is a flawless Dark Mode 🌙) and strict code quality (0 ESLint and TypeScript compilation errors).

Check out the live demo and the open-source code below! I’d love to hear any feedback from the engineering community. 👇

🔗 **Live Demo**: [Insert Vercel Link Here]
🐙 **GitHub Repo**: [Insert GitHub Link Here]

#SoftwareEngineering #WebDevelopment #ReactJS #TypeScript #NodeJS #Prisma #LogisticsTech #OpenSource #FullStackDeveloper
