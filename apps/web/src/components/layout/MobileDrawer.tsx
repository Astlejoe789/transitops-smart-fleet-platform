import { NavLink } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { NAV_GROUPS } from './navigation';
import { Truck, X, LogOut, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const { user, logout } = useAuth();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer Container */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="relative flex w-full max-w-[280px] flex-col bg-[#0B1426] border-r border-surface-800/50 shadow-2xl"
          >
            {/* Header */}
            <div className="flex h-[72px] items-center justify-between px-6 border-b border-surface-800/50 shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-lg)] bg-gradient-to-br from-primary-500 to-accent-500 text-white shadow-lg shadow-primary-600/20">
                  <Truck className="h-5 w-5" />
                </div>
                <span className="text-[length:var(--text-body)] font-bold tracking-tight text-white">TransitOps</span>
              </div>

              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-surface-400 hover:text-white hover:bg-surface-800/60 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Navigation Groups */}
            <div className="flex-1 overflow-y-auto px-3 py-6 space-y-6">
              {NAV_GROUPS.map((group, index) => (
                <div key={group.category} className="space-y-1">
                  <h3 className="px-4 pb-2 text-[length:var(--text-caption)] font-semibold tracking-wider text-surface-500 uppercase">
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
                          `group relative flex items-center gap-3 px-4 rounded-[var(--radius-lg)] h-[40px] text-[length:var(--text-body-sm)] font-medium transition-all ${
                            isActive
                              ? 'bg-primary-600/20 text-white'
                              : 'text-surface-400 hover:bg-surface-800/50 hover:text-white'
                          }`
                        }
                      >
                        {({ isActive }) => (
                          <>
                            {isActive && (
                              <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r bg-primary-500" />
                            )}
                            <Icon className={`shrink-0 ${isActive ? 'text-primary-400' : ''} h-[18px] w-[18px]`} />
                            <span className="truncate">{item.name}</span>
                            {item.badge && (
                              <span className="ml-auto rounded-full bg-primary-500/15 px-2 py-0.5 text-[length:var(--text-caption)] font-bold text-primary-300">
                                {item.badge}
                              </span>
                            )}
                          </>
                        )}
                      </NavLink>
                    );
                  })}
                  
                  {index < NAV_GROUPS.length - 1 && (
                    <div className="mx-4 pt-4 border-b border-surface-800/30" />
                  )}
                </div>
              ))}
            </div>

            {/* Footer User Info */}
            <div className="p-4 border-t border-surface-800/50 bg-[#0B1426] shrink-0">
              <div className="space-y-1 mb-4">
                <NavLink
                  to="/settings"
                  onClick={onClose}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-3 px-4 rounded-[var(--radius-lg)] h-[40px] text-[length:var(--text-body-sm)] font-medium transition-all ${
                      isActive
                        ? 'bg-primary-600/20 text-white'
                        : 'text-surface-400 hover:bg-surface-800/50 hover:text-white'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r bg-primary-500" />
                      )}
                      <Settings className={`shrink-0 ${isActive ? 'text-primary-400' : ''} h-[18px] w-[18px]`} />
                      <span>Settings</span>
                    </>
                  )}
                </NavLink>
              </div>

              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-lg)] bg-surface-800/60 text-[length:var(--text-body-sm)] font-semibold text-white uppercase border border-surface-700/40">
                    {user ? `${user.firstName[0]}${user.lastName[0]}` : 'U'}
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="truncate text-[length:var(--text-body-sm)] font-semibold text-white">
                      {user ? `${user.firstName} ${user.lastName}` : 'Guest User'}
                    </span>
                    <span className="truncate text-[length:var(--text-caption)] text-surface-400 font-medium">
                      {user?.email || 'user@example.com'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    logout();
                  }}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-surface-400 hover:bg-surface-800/60 hover:text-white transition-colors"
                >
                  <LogOut className="h-[18px] w-[18px]" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
