import { NavLink } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { NAV_GROUPS } from './navigation';
import {
  Truck,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ collapsed, onToggleCollapse }: SidebarProps) {
  const { user, logout } = useAuth();

  return (
    <aside
      className={`hidden lg:flex flex-col justify-between border-r border-surface-800/50 bg-[#0B1426] transition-[width] duration-300 z-20 ${
        collapsed ? 'w-20' : 'w-[280px]'
      }`}
    >
      {/* Top Section: Brand & Collapse Toggle */}
      <div>
        <div className="flex h-[72px] items-center justify-between px-6 border-b border-surface-800/50">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 text-white shadow-lg shadow-primary-600/20">
              <Truck className="h-5 w-5" />
            </div>
            {!collapsed && (
              <span className="text-[length:var(--text-body)] font-bold tracking-tight text-white whitespace-nowrap">
                TransitOps
              </span>
            )}
          </div>

          <button
            onClick={onToggleCollapse}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-surface-500 hover:text-white hover:bg-surface-800/60 transition-colors"
          >
            {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </button>
        </div>

        {/* Navigation Group Items */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-8 max-h-[calc(100vh-200px)] custom-scrollbar">
          {NAV_GROUPS.map((group) => (
            <div key={group.category} className="space-y-2">
              {!collapsed && (
                <h3 className="px-3 pb-1 text-[11px] font-bold tracking-[0.1em] text-surface-500 uppercase">
                  {group.category}
                </h3>
              )}

              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      title={collapsed ? item.name : undefined}
                      className={({ isActive }) =>
                        `group relative flex items-center ${collapsed ? 'justify-center px-0' : 'gap-3 px-3'} rounded-[12px] h-[40px] text-[14px] font-semibold transition-all ${
                          isActive
                            ? 'text-white bg-gradient-to-r from-primary-600 to-primary-500 shadow-md shadow-primary-600/15'
                            : 'text-surface-300 hover:text-white hover:bg-surface-800/50'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <Icon className={`shrink-0 h-[18px] w-[18px] transition-colors ${isActive ? 'text-white' : 'text-surface-400 group-hover:text-white'}`} />
                          {!collapsed && <span className="truncate leading-none">{item.name}</span>}
                          {!collapsed && item.badge && (
                            <span className="ml-auto rounded bg-primary-500/20 px-2 py-0.5 text-[10px] font-bold text-primary-300 border border-primary-600/20">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom User Info & Logout */}
      <div className="p-6 mt-auto border-t border-surface-800/50 space-y-6">
        {!collapsed && (
          <p className="text-[11px] leading-relaxed text-surface-500 pr-4">
            All modules live — fleet, dispatch, maintenance, fuel, reports, AI copilot, driver portal & audit.
          </p>
        )}
        <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : 'justify-between'}`}>
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-800/60 text-sm font-bold text-white border border-surface-700/40">
              {user ? `${user.firstName[0]}${user.lastName[0]}` : 'U'}
            </div>
            {!collapsed && (
              <div className="flex flex-col overflow-hidden">
                <span className="truncate text-sm font-bold text-white">
                  {user ? `${user.firstName} ${user.lastName}` : 'Guest User'}
                </span>
                <span className="truncate text-[11px] text-surface-400 font-medium">
                  {user?.email || 'user@example.com'}
                </span>
              </div>
            )}
          </div>

          {!collapsed && (
            <button
              onClick={logout}
              title="Logout"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-surface-500 hover:bg-surface-800/60 hover:text-white transition-colors"
            >
              <LogOut className="h-[18px] w-[18px]" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
