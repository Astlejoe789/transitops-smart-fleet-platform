import { Navigate, type RouteObject } from 'react-router-dom';
import { AuthLayout } from '@/layouts/AuthLayout';
import { MainLayout } from '@/layouts/MainLayout';
import { AuthGuard } from '@/guards/AuthGuard';

import LoginPage from '@/modules/auth/pages/LoginPage';
import ForgotPasswordPage from '@/modules/auth/pages/ForgotPasswordPage';
import ResetPasswordPage from '@/modules/auth/pages/ResetPasswordPage';
import UnauthorizedPage from '@/pages/UnauthorizedPage';
import NotFoundPage from '@/pages/NotFoundPage';

// Module Page Imports
import DashboardPage from '@/modules/dashboard/pages/DashboardPage';
import FleetPage from '@/modules/fleet/pages/FleetPage';
import VehicleDetailsPage from '@/modules/fleet/pages/VehicleDetailsPage';
import DriversPage from '@/modules/drivers/pages/DriversPage';
import DriverDetailsPage from '@/modules/drivers/pages/DriverDetailsPage';
import TripsPage from '@/modules/trips/pages/TripsPage';
import TripDetailsPage from '@/modules/trips/pages/TripDetailsPage';
import DispatchPage from '@/modules/trips/pages/DispatchPage';
import MaintenancePage from '@/modules/maintenance/pages/MaintenancePage';
import MaintenanceDetailsPage from '@/modules/maintenance/pages/MaintenanceDetailsPage';
import { FuelPage } from '@/modules/fuel/pages/FuelPage';
import { FuelDetailsPage } from '@/modules/fuel/pages/FuelDetailsPage';
import { ExpensesPage } from '@/modules/expenses/pages/ExpensesPage';
import { ExpenseDetailsPage } from '@/modules/expenses/pages/ExpenseDetailsPage';
import { CustomersPage } from '@/modules/customers/pages/CustomersPage';
import { CustomerDetailsPage } from '@/modules/customers/pages/CustomerDetailsPage';
import { VendorsPage } from '@/modules/vendors/pages/VendorsPage';
import { VendorDetailsPage } from '@/modules/vendors/pages/VendorDetailsPage';
import { BillingPage } from '@/modules/billing/pages/BillingPage';
import { InvoiceDetailsPage } from '@/modules/billing/pages/InvoiceDetailsPage';
import ReportsPage from '@/modules/reports/pages/ReportsPage';
import AnalyticsPage from '@/modules/analytics/pages/AnalyticsPage';
import AiPage from '@/modules/ai/pages/AiPage';
import NotificationsPage from '@/modules/notifications/pages/NotificationsPage';
import AdministrationPage from '@/modules/administration/pages/AdministrationPage';
import SettingsPage from '@/modules/settings/pages/SettingsPage';

export const routes: RouteObject[] = [
  // Public Authentication Routes
  {
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <LoginPage /> },
      { path: 'forgot-password', element: <ForgotPasswordPage /> },
      { path: 'reset-password', element: <ResetPasswordPage /> },
    ],
  },

  // System Error Pages
  { path: 'unauthorized', element: <UnauthorizedPage /> },

  // Protected SaaS Application Routes (MainLayout Shell)
  {
    path: '/',
    element: (
      <AuthGuard>
        <MainLayout />
      </AuthGuard>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      // Customers
      { path: 'customers', element: <CustomersPage /> },
      { path: 'customers/:id', element: <CustomerDetailsPage /> },

      // Setup
      { path: 'setup', element: <div>Setup Page (Coming Soon)</div> },
      { path: 'fleet', element: <FleetPage /> },
      { path: 'fleet/:id', element: <VehicleDetailsPage /> },
      { path: 'drivers', element: <DriversPage /> },
      { path: 'drivers/:id', element: <DriverDetailsPage /> },
      { path: 'trips', element: <TripsPage /> },
      { path: 'trips/:id', element: <TripDetailsPage /> },
      { path: 'dispatch', element: <DispatchPage /> },
      { path: 'maintenance', element: <MaintenancePage /> },
      { path: 'maintenance/:id', element: <MaintenanceDetailsPage /> },
      { path: 'fuel', element: <FuelPage /> },
      { path: 'fuel/:id', element: <FuelDetailsPage /> },
      { path: 'expenses', element: <ExpensesPage /> },
      { path: 'expenses/:id', element: <ExpenseDetailsPage /> },
      { path: 'vendors', element: <VendorsPage /> },
      { path: 'vendors/:id', element: <VendorDetailsPage /> },
      { path: 'billing', element: <BillingPage /> },
      { path: 'billing/:id', element: <InvoiceDetailsPage /> },
      { path: 'reports', element: <ReportsPage /> },
      { path: 'analytics', element: <AnalyticsPage /> },
      { path: 'ai', element: <AiPage /> },
      { path: 'notifications', element: <NotificationsPage /> },
      { path: 'administration', element: <AdministrationPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },

  // 404 Catch-All Page
  { path: '*', element: <NotFoundPage /> },
];
