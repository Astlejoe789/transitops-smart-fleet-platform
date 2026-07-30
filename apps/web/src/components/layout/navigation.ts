import {
  Truck,
  LayoutDashboard,
  Users,
  Route,
  Wrench,
  Fuel,
  Receipt,
  UserSquare2,
  Building2,
  FileText,
  CreditCard,
  BarChart3,
  TrendingUp,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  name: string;
  path: string;
  icon: LucideIcon;
  badge?: string;
}

export interface NavGroup {
  category: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    category: 'OPERATIONS',
    items: [
      { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { name: 'Trips & Dispatch', path: '/trips', icon: Route },
      { name: 'Fleet Copilot', path: '/ai', icon: Sparkles },
    ],
  },
  {
    category: 'FLEET',
    items: [
      { name: 'Vehicles', path: '/fleet', icon: Truck },
      { name: 'Drivers', path: '/drivers', icon: Users },
      { name: 'Maintenance', path: '/maintenance', icon: Wrench },
      { name: 'Fuel & Expenses', path: '/fuel', icon: Fuel },
    ],
  },
  {
    category: 'INSIGHTS',
    items: [
      { name: 'Driver Portal', path: '/driver-portal', icon: UserSquare2 },
      { name: 'Reports', path: '/reports', icon: BarChart3 },
    ],
  },
];
