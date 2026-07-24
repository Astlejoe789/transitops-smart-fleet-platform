import React, { Suspense } from 'react';
import { Navigate, type RouteObject } from 'react-router-dom';
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

const DashboardPage = lazyNamed(import('@/modules/dashboard/pages/DashboardPage'));
const FleetPage = lazyNamed(import('@/modules/fleet/pages/FleetPage'));
const VehicleDetailsPage = lazyNamed(import('@/modules/fleet/pages/VehicleDetailsPage'));
const DriversPage = lazyNamed(import('@/modules/drivers/pages/DriversPage'));
const DriverDetailsPage = lazyNamed(import('@/modules/drivers/pages/DriverDetailsPage'));
const TripsPage = lazyNamed(import('@/modules/trips/pages/TripsPage'));
const TripDetailsPage = lazyNamed(import('@/modules/trips/pages/TripDetailsPage'));
const DispatchPage = lazyNamed(import('@/modules/trips/pages/DispatchPage'));
const MaintenancePage = lazyNamed(import('@/modules/maintenance/pages/MaintenancePage'));
const MaintenanceDetailsPage = lazyNamed(import('@/modules/maintenance/pages/MaintenanceDetailsPage'));
const FuelPage = lazyNamed(import('@/modules/fuel/pages/FuelPage'));
const FuelDetailsPage = lazyNamed(import('@/modules/fuel/pages/FuelDetailsPage'));
const ExpensesPage = lazyNamed(import('@/modules/expenses/pages/ExpensesPage'));
const ExpenseDetailsPage = lazyNamed(import('@/modules/expenses/pages/ExpenseDetailsPage'));
const CustomersPage = lazyNamed(import('@/modules/customers/pages/CustomersPage'));
const CustomerDetailsPage = lazyNamed(import('@/modules/customers/pages/CustomerDetailsPage'));
const VendorsPage = lazyNamed(import('@/modules/vendors/pages/VendorsPage'));
const VendorDetailsPage = lazyNamed(import('@/modules/vendors/pages/VendorDetailsPage'));
const BillingPage = lazyNamed(import('@/modules/billing/pages/BillingPage'));
const InvoiceDetailsPage = lazyNamed(import('@/modules/billing/pages/InvoiceDetailsPage'));
const ReportsPage = lazyNamed(import('@/modules/reports/pages/ReportsPage'));
const AnalyticsPage = lazyNamed(import('@/modules/analytics/pages/AnalyticsPage'));
const AiPage = lazyNamed(import('@/modules/ai/pages/AiPage'));
const NotificationsPage = lazyNamed(import('@/modules/notifications/pages/NotificationsPage'));
const NotificationSettingsPage = lazyNamed(import('@/modules/notifications/pages/NotificationSettingsPage'));
const AdministrationDashboardPage = lazyNamed(import('@/modules/administration/pages/AdministrationDashboardPage'));
const UserManagementPage = lazyNamed(import('@/modules/administration/pages/UserManagementPage'));
const RoleManagementPage = lazyNamed(import('@/modules/administration/pages/RoleManagementPage'));
const SystemConfigPage = lazyNamed(import('@/modules/administration/pages/SystemConfigPage'));
const AuditLogPage = lazyNamed(import('@/modules/administration/pages/AuditLogPage'));
const SettingsPage = lazyNamed(import('@/modules/settings/pages/SettingsPage'));

// Generic suspense loader
const PageLoader = () => (
  <div className="flex-1 flex items-center justify-center p-8">
    <div className="flex flex-col items-center gap-4">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
      <p className="text-sm text-muted-foreground">Loading module...</p>
    </div>
  </div>
);

const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);

export const routes: RouteObject[] = [
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
      { path: 'dashboard', element: withSuspense(DashboardPage) },
      
      // Customers
      { path: 'customers', element: withSuspense(CustomersPage) },
      { path: 'customers/:id', element: withSuspense(CustomerDetailsPage) },

      // Setup
      { path: 'setup', element: <div>Setup Page (Coming Soon)</div> },
      
      { path: 'fleet', element: withSuspense(FleetPage) },
      { path: 'fleet/:id', element: withSuspense(VehicleDetailsPage) },
      { path: 'drivers', element: withSuspense(DriversPage) },
      { path: 'drivers/:id', element: withSuspense(DriverDetailsPage) },
      { path: 'trips', element: withSuspense(TripsPage) },
      { path: 'trips/:id', element: withSuspense(TripDetailsPage) },
      { path: 'dispatch', element: withSuspense(DispatchPage) },
      { path: 'maintenance', element: withSuspense(MaintenancePage) },
      { path: 'maintenance/:id', element: withSuspense(MaintenanceDetailsPage) },
      { path: 'fuel', element: withSuspense(FuelPage) },
      { path: 'fuel/:id', element: withSuspense(FuelDetailsPage) },
      { path: 'expenses', element: withSuspense(ExpensesPage) },
      { path: 'expenses/:id', element: withSuspense(ExpenseDetailsPage) },
      { path: 'vendors', element: withSuspense(VendorsPage) },
      { path: 'vendors/:id', element: withSuspense(VendorDetailsPage) },
      { path: 'billing', element: withSuspense(BillingPage) },
      { path: 'billing/:id', element: withSuspense(InvoiceDetailsPage) },
      { path: 'reports', element: withSuspense(ReportsPage) },
      { path: 'analytics', element: withSuspense(AnalyticsPage) },
      { path: 'ai', element: withSuspense(AiPage) },
      { path: 'notifications', element: withSuspense(NotificationsPage) },
      { path: 'settings/notifications', element: withSuspense(NotificationSettingsPage) },
      { path: 'admin', element: withSuspense(AdministrationDashboardPage) },
      { path: 'admin/users', element: withSuspense(UserManagementPage) },
      { path: 'admin/roles', element: withSuspense(RoleManagementPage) },
      { path: 'admin/settings', element: withSuspense(SystemConfigPage) },
      { path: 'admin/audit', element: withSuspense(AuditLogPage) },
      { path: 'settings', element: withSuspense(SettingsPage) },
    ],
  },

  // 404 Catch-All Page
  { path: '*', element: withSuspense(NotFoundPage) },
];
