import { NavLink } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
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
  Bell,
  ShieldCheck,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
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
    category: 'MAIN',
    items: [{ name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard }],
  },
  {
    category: 'OPERATIONS',
    items: [
      { name: 'Fleet', path: '/fleet', icon: Truck },
      { name: 'Drivers', path: '/drivers', icon: Users },
      { name: 'Trips', path: '/trips', icon: Route },
      { name: 'Maintenance', path: '/maintenance', icon: Wrench },
      { name: 'Fuel Logs', path: '/fuel', icon: Fuel },
      { name: 'Expenses', path: '/expenses', icon: Receipt },
    ],
  },
  {
    category: 'COMMERCIAL',
    items: [
      { name: 'Customers', path: '/customers', icon: UserSquare2 },
      { name: 'Vendors', path: '/vendors', icon: Building2 },
      { name: 'Billing', path: '/billing', icon: FileText },
      { name: 'Payments', path: '/payments', icon: CreditCard },
    ],
  },
  {
    category: 'INTELLIGENCE',
    items: [
      { name: 'Reports', path: '/reports', icon: BarChart3 },
      { name: 'Analytics', path: '/analytics', icon: TrendingUp },
      { name: 'AI Insights', path: '/ai', icon: Sparkles, badge: 'AI' },
    ],
  },
  {
    category: 'SYSTEM',
    items: [
      { name: 'Notifications', path: '/notifications', icon: Bell },
      { name: 'Administration', path: '/administration', icon: ShieldCheck },
      { name: 'Settings', path: '/settings', icon: Settings },
    ],
  },
];

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ collapsed, onToggleCollapse }: SidebarProps) {
  const { user, logout } = useAuth();

  return (
    <aside
      className={`hidden lg:flex flex-col justify-between border-r border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 transition-all duration-300 z-20 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Section: Brand & Collapse Toggle */}
      <div>
        <div className="flex h-16 items-center justify-between px-4 border-b border-surface-200 dark:border-surface-800">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-primary-600 to-primary-400 shadow-md shadow-primary-500/20 text-white">
              <Truck className="h-6 w-6" />
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="text-base font-bold tracking-tight text-surface-900 dark:text-white">
                  TransitOps
                </span>
                <span className="text-[10px] font-semibold tracking-wider text-surface-400 uppercase">
                  Operations Suite
                </span>
              </div>
            )}
          </div>

          <button
            onClick={onToggleCollapse}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-surface-200 dark:border-surface-800 text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-surface-900 dark:hover:text-white transition-colors"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Navigation Group Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 max-h-[calc(100vh-10rem)]">
          {NAV_GROUPS.map((group) => (
            <div key={group.category} className="space-y-1">
              {!collapsed && (
                <h3 className="px-3 text-[10px] font-bold tracking-wider text-surface-400 uppercase">
                  {group.category}
                </h3>
              )}

              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    title={collapsed ? item.name : undefined}
                    className={({ isActive }) =>
                      `group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400 border-l-4 border-primary-500 font-semibold'
                          : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800/60 hover:text-surface-900 dark:hover:text-white'
                      }`
                    }
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    {!collapsed && <span className="truncate">{item.name}</span>}
                    {!collapsed && item.badge && (
                      <span className="ml-auto rounded-full bg-accent-500/20 px-2 py-0.5 text-[10px] font-bold text-accent-600 dark:text-accent-400">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom User Info & Logout */}
      <div className="p-3 border-t border-surface-200 dark:border-surface-800">
        <div
          className={`flex items-center gap-3 rounded-xl bg-surface-50 dark:bg-surface-800/50 p-2.5 ${
            collapsed ? 'justify-center' : 'justify-between'
          }`}
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-white uppercase shadow-sm">
              {user ? `${user.firstName[0]}${user.lastName[0]}` : 'U'}
            </div>
            {!collapsed && (
              <div className="flex flex-col overflow-hidden">
                <span className="truncate text-xs font-semibold text-surface-900 dark:text-white">
                  {user ? `${user.firstName} ${user.lastName}` : 'Guest User'}
                </span>
                <span className="truncate text-[10px] text-surface-400 uppercase font-medium">
                  {user?.role || 'User'}
                </span>
              </div>
            )}
          </div>

          {!collapsed && (
            <button
              onClick={logout}
              title="Logout"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-surface-400 hover:bg-danger-500/10 hover:text-danger-500 transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
