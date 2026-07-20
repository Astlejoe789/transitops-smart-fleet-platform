import { NavLink } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { NAV_GROUPS } from './Sidebar';
import { Truck, X, LogOut } from 'lucide-react';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const { user, logout } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop Overlay */}
      <div
        className="fixed inset-0 bg-surface-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div className="fixed inset-y-0 left-0 flex w-full max-w-xs flex-col bg-white dark:bg-surface-900 border-r border-surface-200 dark:border-surface-800 shadow-2xl transition-transform">
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-surface-200 dark:border-surface-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-primary-600 to-primary-400 text-white shadow-md">
              <Truck className="h-6 w-6" />
            </div>
            <span className="text-base font-bold text-surface-900 dark:text-white">TransitOps</span>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-surface-200 dark:border-surface-800 text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-900 dark:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Groups */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          {NAV_GROUPS.map((group) => (
            <div key={group.category} className="space-y-1">
              <h3 className="px-3 text-[10px] font-bold tracking-wider text-surface-400 uppercase">
                {group.category}
              </h3>
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400 font-semibold border-l-4 border-primary-500'
                          : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-surface-900 dark:hover:text-white'
                      }`
                    }
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer User Info */}
        <div className="p-4 border-t border-surface-200 dark:border-surface-800">
          <div className="flex items-center justify-between rounded-xl bg-surface-50 dark:bg-surface-800/50 p-3">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-white uppercase">
                {user ? `${user.firstName[0]}${user.lastName[0]}` : 'U'}
              </div>
              <div className="flex flex-col truncate">
                <span className="truncate text-xs font-semibold text-surface-900 dark:text-white">
                  {user ? `${user.firstName} ${user.lastName}` : 'User'}
                </span>
                <span className="truncate text-[10px] text-surface-400 uppercase font-medium">
                  {user?.role}
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                onClose();
                logout();
              }}
              className="flex h-8 w-8 items-center justify-center text-danger-500 hover:bg-danger-500/10 rounded-lg"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
