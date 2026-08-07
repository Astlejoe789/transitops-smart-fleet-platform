import React, { Suspense } from 'react';
import { type RouteObject } from 'react-router-dom';
import { AuthLayout } from '@/layouts/AuthLayout';
import { MainLayout } from '@/layouts/MainLayout';
import { AuthGuard } from '@/guards/AuthGuard';

// Code Splitting with React.lazy
// Utility to handle named exports dynamically by grabbing the first exported value
const lazyNamed = (importPromise: Promise<any>) =>
  React.lazy(() => importPromise.then((m) => ({ default: Object.values(m)[0] as React.ComponentType<any> })));

const LoginPage = lazyNamed(import('@/modules/auth/pages/LoginPage'));
const ForgotPasswordPage = lazyNamed(import('@/modules/auth/pages/ForgotPasswordPage'));
const ResetPasswordPage = lazyNamed(import('@/modules/auth/pages/ResetPasswordPage'));
const UnauthorizedPage = lazyNamed(import('@/pages/UnauthorizedPage'));
const NotFoundPage = lazyNamed(import('@/pages/NotFoundPage'));
const LandingPage = lazyNamed(import('@/pages/LandingPage'));

// App Pages
const DashboardPage = React.lazy(() => import('@/modules/dashboard/pages/DashboardPage'));
const VehiclesPage = React.lazy(() => import('@/modules/fleet/pages/VehiclesPage'));
const DriversPage = React.lazy(() => import('@/modules/fleet/pages/DriversPage'));
const TripsPage = React.lazy(() => import('@/modules/trips/pages/TripsPage'));
const MaintenancePage = React.lazy(() => import('@/modules/maintenance/pages/MaintenancePage'));
const FuelPage = React.lazy(() => import('@/modules/fuel/pages/FuelPage'));
const ExpensesPage = React.lazy(() => import('@/modules/expenses/pages/ExpensesPage'));
const ReportsPage = React.lazy(() => import('@/modules/reports/pages/ReportsPage'));
const SettingsPage = React.lazy(() => import('@/modules/settings/pages/SettingsPage'));

// Generic suspense loader
const PageLoader = () => (
  <div className="flex-1 flex items-center justify-center p-8">
    <div className="flex flex-col items-center gap-4">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0066B3] border-t-transparent" />
      <p className="text-sm text-slate-500">Loading...</p>
    </div>
  </div>
);

const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);

export const routes: RouteObject[] = [
  // Public Landing Page
  {
    path: '/',
    element: withSuspense(LandingPage),
  },

  // Public Authentication Routes
  {
    element: <AuthLayout />,
    children: [
      { path: 'login', element: withSuspense(LoginPage) },
      { path: 'forgot-password', element: withSuspense(ForgotPasswordPage) },
      { path: 'reset-password', element: withSuspense(ResetPasswordPage) },
    ],
  },

  // System Error Pages
  { path: 'unauthorized', element: withSuspense(UnauthorizedPage) },

  // Protected SaaS Application Routes
  {
    element: (
      <AuthGuard>
        <MainLayout />
      </AuthGuard>
    ),
    children: [
      { path: 'dashboard', element: withSuspense(DashboardPage) },
      { path: 'vehicles', element: withSuspense(VehiclesPage) },
      { path: 'drivers', element: withSuspense(DriversPage) },
      { path: 'trips', element: withSuspense(TripsPage) },
      { path: 'maintenance', element: withSuspense(MaintenancePage) },
      { path: 'fuel', element: withSuspense(FuelPage) },
      { path: 'expenses', element: withSuspense(ExpensesPage) },
      { path: 'reports', element: withSuspense(ReportsPage) },
      { path: 'settings', element: withSuspense(SettingsPage) },

      // 404 Catch-All Page inside Dashboard
      { path: '*', element: withSuspense(NotFoundPage) },
    ],
  },

  // 404 Catch-All Page
  { path: '*', element: withSuspense(NotFoundPage) },
];
