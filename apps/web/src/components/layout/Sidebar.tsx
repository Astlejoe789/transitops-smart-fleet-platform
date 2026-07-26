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
];

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ collapsed, onToggleCollapse }: SidebarProps) {
  const { user, logout } = useAuth();

  return (
    <aside
      className={`hidden lg:flex flex-col justify-between border-r border-surface-800 bg-surface-950 transition-all duration-300 z-20 ${
        collapsed ? 'w-20' : 'w-[280px]'
      }`}
    >
      {/* Top Section: Brand & Collapse Toggle */}
      <div>
        <div className="flex h-[72px] items-center justify-between px-6 border-b border-surface-800">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-primary-500 text-white shadow-sm">
              <Truck className="h-5 w-5" />
            </div>
            {!collapsed && (
              <span className="text-[length:var(--text-body)] font-bold tracking-tight text-white">
                TransitOps
              </span>
            )}
          </div>

          <button
            onClick={onToggleCollapse}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-surface-400 hover:text-white transition-colors"
          >
            {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </button>
        </div>

        {/* Navigation Group Items */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-8 max-h-[calc(100vh-140px)]">
          {NAV_GROUPS.map((group) => (
            <div key={group.category} className="space-y-2">
              {!collapsed && (
                <h3 className="px-3 text-[length:var(--text-caption)] font-semibold tracking-wider text-surface-500 uppercase">
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
                      `group flex items-center gap-3 rounded-[10px] px-3 h-[44px] text-[length:var(--text-body)] font-medium transition-all ${
                        isActive
                          ? 'bg-primary-500 text-white shadow-sm'
                          : 'text-surface-400 hover:bg-surface-850 hover:text-white'
                      }`
                    }
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    {!collapsed && <span className="truncate">{item.name}</span>}
                    {!collapsed && item.badge && (
                      <span className="ml-auto rounded-full bg-surface-800 px-2 py-0.5 text-[length:var(--text-caption)] font-bold text-white">
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
      <div className="p-4 border-t border-surface-800 bg-surface-950">
        {!collapsed && (
          <div className="space-y-1 mb-4">
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-[10px] px-3 h-[44px] text-[length:var(--text-body)] font-medium transition-all ${
                  isActive
                    ? 'bg-primary-500 text-white shadow-sm'
                    : 'text-surface-400 hover:bg-surface-850 hover:text-white'
                }`
              }
            >
              <Settings className="h-5 w-5 shrink-0" />
              <span>Settings</span>
            </NavLink>
          </div>
        )}
        
        <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : 'justify-between'}`}>
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-surface-800 text-[length:var(--text-body-sm)] font-semibold text-white uppercase border border-surface-700">
              {user ? `${user.firstName[0]}${user.lastName[0]}` : 'U'}
            </div>
            {!collapsed && (
              <div className="flex flex-col overflow-hidden">
                <span className="truncate text-[length:var(--text-body)] font-semibold text-white">
                  {user ? `${user.firstName} ${user.lastName}` : 'Guest User'}
                </span>
                <span className="truncate text-[length:var(--text-caption)] text-surface-400 font-medium">
                  {user?.email || 'user@example.com'}
                </span>
              </div>
            )}
          </div>

          {!collapsed && (
            <button
              onClick={logout}
              title="Logout"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] text-surface-400 hover:bg-surface-850 hover:text-white transition-colors"
            >
              <LogOut className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
