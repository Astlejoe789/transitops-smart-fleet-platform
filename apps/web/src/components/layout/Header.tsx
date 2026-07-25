import { useState, useRef, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import {
  Menu,
  Search,
  ChevronDown,
  User as UserIcon,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { NotificationBell } from '@/modules/notifications/components/NotificationBell';

interface HeaderProps {
  onOpenMobileDrawer?: () => void;
}

export function Header({ onOpenMobileDrawer }: HeaderProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
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
    <header className="sticky top-0 z-10 flex h-[72px] w-full items-center justify-between border-b border-surface-800 bg-[#09090B] px-8">
      {/* Left Section: Mobile Toggle & Breadcrumb */}
      <div className="flex items-center gap-3">
        {onOpenMobileDrawer && (
          <button
            onClick={onOpenMobileDrawer}
            className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-surface-800 text-surface-400 lg:hidden hover:bg-surface-850 hover:text-white"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        <div className="hidden sm:flex items-center text-[15px] font-medium text-surface-400">
          <Link to="/dashboard" className="hover:text-white transition-colors">
            TransitOps
          </Link>
          <ChevronRight className="h-4 w-4 mx-2 text-surface-500" />
          <span className="font-semibold text-white">{formattedBreadcrumb}</span>
        </div>
      </div>

      {/* Middle Section: Global Search Bar */}
      <div className="hidden md:flex flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-surface-500" />
          </div>
          <input
            type="text"
            placeholder="Search... (Press ⌘K)"
            className="w-full h-[44px] rounded-[10px] border border-surface-800 bg-surface-900 py-2 pl-10 pr-4 text-[15px] text-white placeholder-surface-500 focus:border-primary-500 focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Right Section: Actions, Profile Menu */}
      <div className="flex items-center gap-4">
        {/* Quick Action Button */}
        <button className="hidden sm:flex h-[44px] items-center justify-center rounded-[10px] bg-primary-500 px-4 text-[15px] font-semibold text-white hover:bg-primary-600 transition-colors">
          Create New
        </button>

        {/* Notifications Dropdown */}
        <div className="flex items-center justify-center h-[44px] w-[44px] rounded-[10px] border border-surface-800 hover:bg-surface-850 transition-colors">
          <NotificationBell />
        </div>

        {/* User Profile Dropdown Menu */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 rounded-[10px] border border-surface-800 h-[44px] px-2 hover:bg-surface-850 transition-colors"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-[6px] bg-surface-800 text-[12px] font-bold text-white uppercase border border-surface-700">
              {user ? `${user.firstName[0]}${user.lastName[0]}` : 'U'}
            </div>
            <span className="hidden sm:inline-block text-[14px] font-medium text-white max-w-[100px] truncate">
              {user?.firstName || 'User'}
            </span>
            <ChevronDown className="h-4 w-4 text-surface-400" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-[16px] border border-surface-800 bg-surface-900 p-2 shadow-xl z-30 space-y-1">
              <div className="px-3 py-3 border-b border-surface-800">
                <p className="text-[15px] font-semibold text-white">
                  {user ? `${user.firstName} ${user.lastName}` : 'User'}
                </p>
                <p className="text-[12px] text-surface-400 truncate mt-1">{user?.email}</p>
              </div>

              <Link
                to="/settings"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-3 rounded-[10px] px-3 py-2 text-[14px] font-medium text-surface-400 hover:bg-surface-850 hover:text-white"
              >
                <UserIcon className="h-4 w-4" /> Profile & Account
              </Link>
              <Link
                to="/settings"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-3 rounded-[10px] px-3 py-2 text-[14px] font-medium text-surface-400 hover:bg-surface-850 hover:text-white"
              >
                <Settings className="h-4 w-4" /> System Settings
              </Link>
              <a
                href="#help"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-3 rounded-[10px] px-3 py-2 text-[14px] font-medium text-surface-400 hover:bg-surface-850 hover:text-white"
              >
                <HelpCircle className="h-4 w-4" /> Documentation
              </a>

              <div className="border-t border-surface-800 pt-1 mt-1">
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    logout();
                  }}
                  className="flex w-full items-center gap-3 rounded-[10px] px-3 py-2 text-[14px] font-semibold text-danger-500 hover:bg-surface-850"
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
