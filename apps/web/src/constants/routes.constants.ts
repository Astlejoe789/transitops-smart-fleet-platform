/**
 * Route path constants for type-safe navigation.
 */
export const ROUTES = {
  // Auth
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',

  // Main
  DASHBOARD: '/',
  FLEET: '/fleet',
  DRIVERS: '/drivers',
  TRIPS: '/trips',
  MAINTENANCE: '/maintenance',
  FUEL: '/fuel',
  EXPENSES: '/expenses',
  BILLING: '/billing',
  PAYMENTS: '/payments',
  CUSTOMERS: '/customers',
  VENDORS: '/vendors',
  REPORTS: '/reports',
  ANALYTICS: '/analytics',
  AI: '/ai',
  NOTIFICATIONS: '/notifications',
  ADMINISTRATION: '/administration',
  SETTINGS: '/settings',
} as const;
