import { NavLink } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import {
  Truck, X, LogOut, Settings, LayoutDashboard, Route,
  Users, Wrench, Fuel, Receipt, BarChart3, Map,
  Ellipsis, Sun, Moon
} from 'lucide-react';
import { useTheme } from 'next-themes';

type NavItem = { name: string; path: string; icon: any; badge?: number };
type NavGroup = { category: string; items: NavItem[] };

const NAV_GROUPS: NavGroup[] = [
  {
    category: 'Workspace',
    items: [
      { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
      { name: 'Live map', path: '/map', icon: Map },
      { name: 'Vehicles', path: '/vehicles', icon: Truck },
      { name: 'Drivers', path: '/drivers', icon: Users },
      { name: 'Trips', path: '/trips', icon: Route },
      { name: 'Maintenance', path: '/maintenance', icon: Wrench, badge: 3 },
    ],
  },
  {
    category: 'Finance',
    items: [
      { name: 'Fuel Logs', path: '/fuel', icon: Fuel },
      { name: 'Expenses', path: '/expenses', icon: Receipt },
      { name: 'Reports', path: '/reports', icon: BarChart3 },
    ],
  },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  mobile?: boolean;
}

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  return (
    <>
      {/* Brand header */}
      <div className="flex h-18 items-center justify-between border-b border-sidebar-border px-5">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-md bg-primary text-primary-foreground">
            <Route className="h-[19px] w-[19px]" aria-hidden="true" />
          </span>
          <span className="font-display text-lg font-bold text-sidebar-foreground">TransitOps</span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center h-9 w-9 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors lg:hidden"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5 text-sidebar-foreground" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 p-3 overflow-y-auto" aria-label="Main navigation">
        {NAV_GROUPS.map((group) => (
          <div key={group.category}>
            <p className="px-3 pb-2 pt-3 text-[10px] font-bold uppercase text-sidebar-foreground/45">
              {group.category}
            </p>
            {group.items.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                        : 'text-sidebar-foreground/65 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                    }`
                  }
                >
                  <Icon width={18} height={18} aria-hidden="true" />
                  {item.name}
                  {item.badge && (
                    <span className="ml-auto rounded bg-warning px-1.5 py-0.5 text-[10px] font-bold text-foreground">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer: Settings + User */}
      <div className="border-t border-sidebar-border p-3">
        <NavLink
          to="/settings"
          onClick={onClose}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors ${
              isActive
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'text-sidebar-foreground/65 hover:bg-sidebar-accent'
            }`
          }
        >
          <Settings width={18} height={18} aria-hidden="true" />
          Settings
        </NavLink>

        {/* User card */}
        <div className="mt-2 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-md bg-sidebar-accent/70 p-3">
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            {user ? `${user.firstName[0]}${user.lastName[0]}` : 'AK'}
          </span>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-sidebar-foreground">
              {user ? `${user.firstName} ${user.lastName}` : 'Alex Kim'}
            </p>
            <p className="truncate text-[10px] text-sidebar-foreground/45">Fleet manager</p>
          </div>
          <div className="flex flex-col gap-1">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              title="Toggle theme"
              className="text-sidebar-foreground/45 hover:text-sidebar-foreground transition-colors p-1"
            >
              {theme === 'dark' ? <Sun width={14} height={14} aria-hidden="true" /> : <Moon width={14} height={14} aria-hidden="true" />}
            </button>
            <button
              onClick={logout}
              title="Sign out"
              className="text-sidebar-foreground/45 hover:text-red-400 transition-colors p-1"
            >
              <Ellipsis width={14} height={14} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export function Sidebar() {
  return (
    <aside className="hidden lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-[236px] lg:flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <SidebarContent />
    </aside>
  );
}

export function MobileSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      {/* Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[236px] flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform duration-300 lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent onClose={onClose} />
      </aside>
    </>
  );
}
