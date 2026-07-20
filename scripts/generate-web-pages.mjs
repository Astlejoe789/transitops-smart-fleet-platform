import { writeFileSync } from 'fs';
import { join } from 'path';

const WEB_MODULES = [
  {
    name: 'drivers',
    component: 'DriversPage',
    title: 'Driver Management',
    category: 'Operations',
    desc: 'Manage driver profiles, license categories, medical certifications, and assignments.',
    icon: 'Users',
    features: ['Driver Profiles & Contact Info', 'License Category & Expiry Tracking', 'Duty & Leave Status', 'Emergency Contacts', 'Performance Metrics'],
  },
  {
    name: 'trips',
    component: 'TripsPage',
    title: 'Trip Management',
    category: 'Operations',
    desc: 'Schedule, dispatch, track, and complete transport trips across fleet routes.',
    icon: 'Route',
    features: ['Trip Scheduling & Dispatch', 'Origin & Destination Route Map', 'Vehicle & Driver Assignment', 'Real-time Cargo Tracking', 'Trip Cost & Odometer Logs'],
  },
  {
    name: 'maintenance',
    component: 'MaintenancePage',
    title: 'Maintenance Logs',
    category: 'Operations',
    desc: 'Schedule routine servicing, track repair orders, and manage vendor service costs.',
    icon: 'Wrench',
    features: ['Service Schedule Calendar', 'Work Order Generation', 'Repair & Breakdown Logs', 'Vendor Service Billing', 'Parts & Labor Cost Tracking'],
  },
  {
    name: 'fuel',
    component: 'FuelPage',
    title: 'Fuel Logs',
    category: 'Operations',
    desc: 'Monitor fuel consumption, station receipts, efficiency metrics, and cost per km.',
    icon: 'Fuel',
    features: ['Refueling Transaction Logs', 'Fuel Efficiency Analytics (L/100km)', 'Receipt Upload & Audit', 'Fuel Card Integration', 'Abnormal Fuel Alert Trigger'],
  },
  {
    name: 'expenses',
    component: 'ExpensesPage',
    title: 'Expense Management',
    category: 'Operations',
    desc: 'Track operational expenses including tolls, driver allowances, permits, and parking.',
    icon: 'Receipt',
    features: ['Expense Submission & Receipts', 'Trip-Linked Expense Audit', 'Multi-Category Classification', 'Approval Workflow', 'Cost Allocation Reports'],
  },
  {
    name: 'customers',
    component: 'CustomersPage',
    title: 'Customer Management',
    category: 'Commercial',
    desc: 'Freight customer CRM, contract terms, billing addresses, and order history.',
    icon: 'UserSquare2',
    features: ['Customer Account Profiles', 'Contract Terms & Rates', 'Order History & Ledger', 'Tax & Invoicing Details', 'Credit Limit Monitoring'],
  },
  {
    name: 'vendors',
    component: 'VendorsPage',
    title: 'Vendor Management',
    category: 'Commercial',
    desc: 'Manage workshop providers, fuel suppliers, spare parts vendors, and contracts.',
    icon: 'Building2',
    features: ['Vendor Directory', 'Category Classification', 'Service History & Rating', 'Tax ID & Payment Terms', 'Contract Expiry Alerts'],
  },
  {
    name: 'billing',
    component: 'BillingPage',
    title: 'Billing & Invoicing',
    category: 'Commercial',
    desc: 'Generate customer invoices, line item breakdowns, due dates, and tax calculations.',
    icon: 'FileText',
    features: ['Invoice Generation', 'Line Item Customization', 'Tax & Freight Charge Calc', 'PDF Export & Emailing', 'Overdue Tracking & Reminders'],
  },
  {
    name: 'payments',
    component: 'PaymentsPage',
    title: 'Payment Processing',
    category: 'Commercial',
    desc: 'Record customer payments, bank transfers, credit card settlements, and receipts.',
    icon: 'CreditCard',
    features: ['Payment Transaction Receipt', 'Multi-Method Settlements', 'Invoice Reconciliation', 'Partial Payment Tracking', 'Revenue Summary'],
  },
  {
    name: 'reports',
    component: 'ReportsPage',
    title: 'Operational Reports',
    category: 'Intelligence',
    desc: 'Generate downloadable operational reports for fleet, trips, fuel, and compliance.',
    icon: 'BarChart3',
    features: ['Fleet Utilization Report', 'Driver Hours Log Report', 'Fuel & Expense Statements', 'Maintenance Audit Export', 'Custom PDF & CSV Export'],
  },
  {
    name: 'analytics',
    component: 'AnalyticsPage',
    title: 'Data Analytics',
    category: 'Intelligence',
    desc: 'Visual analytics dashboards for operational efficiency, cost per trip, and trends.',
    icon: 'TrendingUp',
    features: ['Fleet Cost Per Kilometer', 'Revenue vs Operating Cost', 'Driver Performance Trends', 'Route Efficiency Heatmaps', 'Interactive Chart Widgets'],
  },
  {
    name: 'ai',
    component: 'AiPage',
    title: 'AI Insights',
    category: 'Intelligence',
    desc: 'AI-powered predictive maintenance, smart route recommendations, and fuel optimization.',
    icon: 'Sparkles',
    features: ['Predictive Breakdown Alerts', 'Optimal Driver-Vehicle Match', 'Smart Route Fuel Savings', 'Anomaly Detection in Logs', 'AI Operations Assistant'],
  },
  {
    name: 'notifications',
    component: 'NotificationsPage',
    title: 'Notification Center',
    category: 'System',
    desc: 'Centralized alerts for compliance expiries, maintenance schedules, and trip updates.',
    icon: 'Bell',
    features: ['Alert Severity Categorization', 'Unread Filter & Bulk Mark Read', 'Email & Push Notification Sync', 'Real-time Telemetry Alerts', 'Custom Notification Triggers'],
  },
  {
    name: 'administration',
    component: 'AdministrationPage',
    title: 'System Administration',
    category: 'System',
    desc: 'Manage company branches, system roles, permissions, audit logs, and security.',
    icon: 'ShieldCheck',
    features: ['Company Branch Management', 'RBAC Role & Permission Editor', 'System User Provisioning', 'Audit Trail Log Viewer', 'Security Policy Settings'],
  },
  {
    name: 'settings',
    component: 'SettingsPage',
    title: 'Application Settings',
    category: 'System',
    desc: 'Configure organization profile, system preferences, notification rules, and integrations.',
    icon: 'Settings',
    features: ['Company Profile & Logo', 'System Preferences (Units/Currency)', 'Tax & Financial Rules', 'API Keys & Webhooks', 'Data Export & Backup'],
  },
];

const BASE = join(import.meta.dirname, '..', 'apps', 'web', 'src', 'modules');

for (const m of WEB_MODULES) {
  const filePath = join(BASE, m.name, 'pages', `${m.component}.tsx`);
  const content = `import { ModulePlaceholderPage } from '@/components/common/ModulePlaceholderPage';
import { ${m.icon} } from 'lucide-react';

export default function ${m.component}() {
  return (
    <ModulePlaceholderPage
      moduleName="${m.title}"
      category="${m.category}"
      description="${m.desc}"
      icon={${m.icon}}
      plannedFeatures={[
        ${m.features.map((f) => `'${f}'`).join(',\n        ')}
      ]}
    />
  );
}
`;
  writeFileSync(filePath, content, 'utf-8');
  console.log(`Generated: ${filePath}`);
}
