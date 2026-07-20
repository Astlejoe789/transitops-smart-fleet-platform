import { useState, useRef, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useTheme, type ThemeMode } from '@/hooks/useTheme';
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  Laptop,
  ChevronDown,
  User as UserIcon,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
} from 'lucide-react';

interface HeaderProps {
  onOpenMobileDrawer: () => void;
}

export function Header({ onOpenMobileDrawer }: HeaderProps) {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const location = useLocation();

  const [profileOpen, setProfileOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const themeRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
      if (themeRef.current && !themeRef.current.contains(e.target as Node)) {
        setThemeOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute breadcrumb path
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const formattedBreadcrumb = pathSegments.length > 0
    ? pathSegments.map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(' / ')
    : 'Dashboard';

  return (
    <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b border-surface-200 dark:border-surface-800 bg-white/80 dark:bg-surface-900/80 px-4 sm:px-6 backdrop-blur-md">
      {/* Left Section: Mobile Toggle & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileDrawer}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-surface-200 dark:border-surface-800 text-surface-600 dark:text-surface-300 lg:hidden hover:bg-surface-100 dark:hover:bg-surface-800"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden sm:flex items-center text-xs font-medium text-surface-400">
          <Link to="/dashboard" className="hover:text-surface-900 dark:hover:text-white transition-colors">
            TransitOps
          </Link>
          <ChevronRight className="h-3.5 w-3.5 mx-1.5 text-surface-400" />
          <span className="font-semibold text-surface-900 dark:text-white">{formattedBreadcrumb}</span>
        </div>
      </div>

      {/* Middle Section: Global Search Bar */}
      <div className="hidden md:flex flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-surface-400" />
          </div>
          <input
            type="text"
            placeholder="Search vehicles, drivers, trips, invoices... (Press ⌘K)"
            className="w-full rounded-xl border border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-950 py-2 pl-9 pr-4 text-xs text-surface-900 dark:text-white placeholder-surface-400 focus:border-primary-500 focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Right Section: Actions, Theme Toggle, Profile Menu */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-surface-200 dark:border-surface-800 text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
          >
            <Bell className="h-4.5 w-4.5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary-500 animate-pulse"></span>
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 p-4 shadow-xl z-30">
              <div className="flex items-center justify-between pb-3 border-b border-surface-200 dark:border-surface-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-surface-900 dark:text-white">
                  Notifications
                </h4>
                <span className="rounded-full bg-primary-500/10 px-2 py-0.5 text-[10px] font-bold text-primary-500">
                  3 New
                </span>
              </div>
              <div className="py-3 space-y-2 text-xs">
                <div className="p-2 rounded-lg bg-surface-50 dark:bg-surface-800/50">
                  <p className="font-semibold text-surface-900 dark:text-white">Vehicle Service Due</p>
                  <p className="text-surface-400 mt-0.5">Truck #TRK-104 is due for oil maintenance.</p>
                </div>
                <div className="p-2 rounded-lg bg-surface-50 dark:bg-surface-800/50">
                  <p className="font-semibold text-surface-900 dark:text-white">Driver License Expiry</p>
                  <p className="text-surface-400 mt-0.5">Driver Marcus Vance license expires in 14 days.</p>
                </div>
              </div>
              <Link
                to="/notifications"
                onClick={() => setNotificationsOpen(false)}
                className="block text-center text-xs font-semibold text-primary-500 hover:underline pt-2"
              >
                View all notifications
              </Link>
            </div>
          )}
        </div>

        {/* Theme Selector Dropdown */}
        <div className="relative" ref={themeRef}>
          <button
            onClick={() => setThemeOpen(!themeOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-surface-200 dark:border-surface-800 text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
          >
            {theme === 'dark' && <Moon className="h-4.5 w-4.5 text-primary-400" />}
            {theme === 'light' && <Sun className="h-4.5 w-4.5 text-warning-500" />}
            {theme === 'system' && <Laptop className="h-4.5 w-4.5 text-surface-400" />}
          </button>

          {themeOpen && (
            <div className="absolute right-0 mt-2 w-36 rounded-xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 p-1.5 shadow-xl z-30 space-y-1">
              {[
                { mode: 'light' as ThemeMode, label: 'Light', icon: Sun },
                { mode: 'dark' as ThemeMode, label: 'Dark', icon: Moon },
                { mode: 'system' as ThemeMode, label: 'System', icon: Laptop },
              ].map(({ mode, label, icon: Icon }) => (
                <button
                  key={mode}
                  onClick={() => {
                    setTheme(mode);
                    setThemeOpen(false);
                  }}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                    theme === mode
                      ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400 font-semibold'
                      : 'text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User Profile Dropdown Menu */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 rounded-xl border border-surface-200 dark:border-surface-800 p-1.5 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-600 text-xs font-bold text-white uppercase">
              {user ? `${user.firstName[0]}${user.lastName[0]}` : 'U'}
            </div>
            <span className="hidden sm:inline-block text-xs font-semibold text-surface-900 dark:text-white max-w-[100px] truncate">
              {user?.firstName || 'User'}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-surface-400" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 p-2 shadow-xl z-30 space-y-1">
              <div className="px-3 py-2 border-b border-surface-200 dark:border-surface-800">
                <p className="text-xs font-bold text-surface-900 dark:text-white">
                  {user ? `${user.firstName} ${user.lastName}` : 'User'}
                </p>
                <p className="text-[11px] text-surface-400 truncate">{user?.email}</p>
                <span className="mt-1.5 inline-block rounded-full bg-primary-500/10 px-2 py-0.5 text-[10px] font-bold text-primary-500 uppercase">
                  {user?.role || 'Role'}
                </span>
              </div>

              <Link
                to="/settings"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800"
              >
                <UserIcon className="h-4 w-4" /> Profile & Account
              </Link>
              <Link
                to="/settings"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800"
              >
                <Settings className="h-4 w-4" /> System Settings
              </Link>
              <a
                href="#help"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800"
              >
                <HelpCircle className="h-4 w-4" /> Documentation & Help
              </a>

              <div className="border-t border-surface-200 dark:border-surface-800 pt-1">
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    logout();
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-danger-500 hover:bg-danger-500/10 transition-colors"
                >
                  <LogOut className="h-4 w-4" /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
