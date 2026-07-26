<div align="center">
  <h1>🚛 TransitOps Smart Fleet Platform</h1>
  <p>An enterprise-grade fleet and transport operations management system.</p>
</div>

## 📖 Project Overview
TransitOps is a comprehensive web platform built to modernize transport and logistics operations. From tracking fleet health and driver certifications to managing dispatch multi-stop routing and generating financial invoices, TransitOps unifies disconnected transport silos into a single, intuitive dashboard. 

## ✨ Features
- **Intelligent Dispatch & Trips**: End-to-end trip planning, real-time dispatch assignment, and multi-stop support.
- **Complete Fleet Lifecycle**: Vehicle tracking, preventive maintenance schedules, and fuel logging.
- **Driver Management**: Comprehensive driver profiles, license expiry tracking, and vehicle assignment histories.
- **Financial Suite**: Vendor management, cost tracking, invoice generation, and full CRUD for payments/billing.
- **Global Theme & UI**: Stunning, responsive interface powered by Shadcn UI and Tailwind CSS v4, complete with Dark/Light modes.
- **Enterprise Security**: Role-based access control (RBAC), JWT authentication, and secure API architecture.

## 🏗️ Architecture
TransitOps employs a modern modular monolith architecture. The frontend is a React 18 Single Page Application (SPA), while the backend is an Express-powered REST API communicating with a PostgreSQL database via Prisma ORM.

## 🛠️ Technology Stack
### Frontend (`apps/web`)
- **Framework**: React 18 (Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + Shadcn UI
- **State/Data**: TanStack React Query + React Router v6

### Backend (`apps/api`)
- **Framework**: Node.js + Express
- **Language**: TypeScript
- **Database ORM**: Prisma
- **Validation**: Zod
- **Database**: PostgreSQL

## 📂 Folder Structure
```text
transitops/
├── apps/
│   ├── api/          # Express Backend (Modules, Services, Controllers)
│   └── web/          # React Frontend (Pages, Components, API Clients)
├── database/         # Prisma Schemas & Seed Data
├── docs/             # Portfolio & Interview Preparation Assets
└── scripts/          # Automation and Generator Utilities
```

## 🚀 Installation Guide
### Prerequisites
- Node.js >= 18
- PostgreSQL

### 1. Clone the repository
```bash
git clone https://github.com/Astlejoe789/transitops-smart-fleet-platform.git
cd transitops-smart-fleet-platform
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create `.env` in `apps/api/`:
```env
PORT=3000
DATABASE_URL="postgresql://user:password@localhost:5432/transitops"
JWT_SECRET="super-secret-jwt-key"
FRONTEND_URL="http://localhost:5173"
NODE_ENV="development"
```
Create `.env` in `apps/web/`:
```env
VITE_API_URL="http://localhost:3000/api"
```

### 4. Database Setup
```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```
*Note: The seed script provides demo credentials (`admin@transitops.com` / `Admin@123456`).*

### 5. Run Locally
Start both backend and frontend concurrently:
```bash
npm run dev
```

## 🌍 Deployment Guide
The project is configured for cloud deployment:
- **Frontend (Vercel)**: Connect the GitHub repository to Vercel. Ensure the Framework Preset is Vite. The included `vercel.json` handles React Router rewrites.
- **Backend & Database (Railway)**: Connect the GitHub repository to Railway. The included `railway.json` utilizes Nixpacks to automatically build and run the Express API. Add a PostgreSQL plugin and link the `DATABASE_URL`.

## 🔮 Future Roadmap
- [ ] Automated weekly PDF report generation for dispatchers.
- [ ] E2E Test suite using Cypress/Playwright.
- [ ] Live WebSocket integration for real-time map GPS tracking.

## 📄 License
This project is licensed under the MIT License.

## ✍️ Author
Designed and engineered by **Astlejoe789**.
