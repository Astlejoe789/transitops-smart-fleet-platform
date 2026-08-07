import { useState, useEffect, useRef, useCallback } from 'react';
import { Bell, Search, Menu, Check, CheckCheck, Trash2, ExternalLink, Wrench, Fuel, Shield, Info, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { notificationsApi, type Notification } from '@/api/notifications.api';

interface HeaderProps {
  onOpenMobileDrawer: () => void;
}

/* ── Helpers ─────────────────────────────────────── */
function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

const CATEGORY_ICON: Record<string, React.ElementType> = {
  MAINTENANCE: Wrench,
  FUEL: Fuel,
  COMPLIANCE: Shield,
  TRIPS: Info,
  DEFAULT: AlertTriangle,
};

const PRIORITY_STYLES: Record<string, { dot: string; badge: string; label: string }> = {
  CRITICAL: { dot: 'bg-destructive', badge: 'bg-destructive/10 text-destructive', label: 'Critical' },
  HIGH:     { dot: 'bg-destructive', badge: 'bg-destructive/10 text-destructive', label: 'High' },
  MEDIUM:   { dot: 'bg-warning',     badge: 'bg-warning/10 text-warning',         label: 'Medium' },
  LOW:      { dot: 'bg-success',     badge: 'bg-success-soft text-success',       label: 'Low' },
};

/* ── Notification Panel ──────────────────────────── */
function NotificationPanel({
  notifications,
  unreadCount,
  loading,
  onMarkRead,
  onMarkAllRead,
  onDelete,
  onNavigate,
}: {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onDelete: (id: string) => void;
  onNavigate: (url?: string) => void;
}) {
  return (
    <div
      className="absolute right-0 top-[calc(100%+8px)] z-50 w-[380px] rounded-xl border border-border bg-card shadow-2xl overflow-hidden flex flex-col"
      style={{ maxHeight: '520px' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold">Notifications</span>
          {unreadCount > 0 && (
            <span className="grid h-5 min-w-[20px] place-items-center rounded-full bg-destructive px-1.5 text-[10px] font-bold text-destructive-foreground">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={onMarkAllRead}
            className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:opacity-75 transition-opacity"
            title="Mark all as read"
          >
            <CheckCheck className="h-3.5 w-3.5" />
            Mark all read
          </button>
        )}
      </div>

      {/* List */}
      <div className="overflow-y-auto flex-1">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-3 px-4 py-3 border-b border-border">
              <div className="animate-pulse size-8 rounded-lg bg-muted shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="animate-pulse h-3 w-3/4 rounded bg-muted" />
                <div className="animate-pulse h-2.5 w-full rounded bg-muted" />
              </div>
            </div>
          ))
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
            <Bell className="mb-3 h-8 w-8 opacity-40" />
            <p className="text-sm font-medium">All caught up!</p>
            <p className="text-xs mt-1">No new notifications.</p>
          </div>
        ) : (
          notifications.map((n) => {
            const Icon = CATEGORY_ICON[n.category] || CATEGORY_ICON.DEFAULT;
            const prio = PRIORITY_STYLES[n.priority] || PRIORITY_STYLES.LOW;
            return (
              <div
                key={n.id}
                className={`group relative flex items-start gap-3 px-4 py-3 border-b border-border transition-colors hover:bg-accent/50 cursor-pointer ${!n.isRead ? 'bg-primary/[0.03]' : ''}`}
                onClick={() => {
                  if (!n.isRead) onMarkRead(n.id);
                  onNavigate(n.linkUrl);
                }}
              >
                {/* Unread indicator */}
                {!n.isRead && (
                  <span className={`absolute left-1.5 top-1/2 -translate-y-1/2 size-1.5 rounded-full ${prio.dot}`} />
                )}

                {/* Icon */}
                <span className={`mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-muted`}>
                  <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                </span>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <p className={`text-xs font-semibold truncate ${!n.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {n.title}
                    </p>
                    <span className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold ${prio.badge}`}>
                      {prio.label}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">{n.message}</p>
                  <p className="mt-1 text-[10px] text-muted-foreground/60">{timeAgo(n.createdAt)}</p>
                </div>

                {/* Actions (appear on hover) */}
                <div
                  className="absolute right-3 top-3 hidden group-hover:flex items-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  {!n.isRead && (
                    <button
                      onClick={() => onMarkRead(n.id)}
                      className="grid size-6 place-items-center rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                      title="Mark as read"
                    >
                      <Check className="h-3.5 w-3.5" />
                    </button>
                  )}
                  {n.linkUrl && (
                    <button
                      onClick={() => onNavigate(n.linkUrl)}
                      className="grid size-6 place-items-center rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                      title="Go to page"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => onDelete(n.id)}
                    className="grid size-6 place-items-center rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                    title="Dismiss"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="border-t border-border px-4 py-2.5 text-center">
          <span className="text-xs text-muted-foreground">
            Showing {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}
    </div>
  );
}

/* ── Main Header ─────────────────────────────────── */
export function Header({ onOpenMobileDrawer }: HeaderProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [panelOpen, setPanelOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Fetch on mount and every 60 s
  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const result = await notificationsApi.getNotifications({ limit: 10 });
      setNotifications(result.data);
      setUnreadCount(result.meta.unreadCount);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60_000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Close panel on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setPanelOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleMarkRead = async (id: string) => {
    // Optimistic update
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    setUnreadCount((c) => Math.max(0, c - 1));
    await notificationsApi.markAsRead(id);
  };

  const handleMarkAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
    await notificationsApi.markAllAsRead();
  };

  const handleDelete = async (id: string) => {
    const notif = notifications.find((n) => n.id === id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (notif && !notif.isRead) setUnreadCount((c) => Math.max(0, c - 1));
    await notificationsApi.deleteNotification(id);
  };

  const handleNavigate = (url?: string) => {
    if (url) {
      navigate(url);
      setPanelOpen(false);
    }
  };

  return (
    <header className="grid h-18 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-b bg-card px-4 sm:px-7">
      {/* Mobile menu toggle */}
      <button
        onClick={onOpenMobileDrawer}
        className="inline-flex items-center justify-center h-9 w-9 rounded-md border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors lg:hidden"
        aria-label="Open navigation"
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </button>

      {/* Search */}
      <div className="relative hidden max-w-md sm:block">
        <Search
          className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <input
          aria-label="Search fleet"
          placeholder="Search vehicles, drivers, routes…"
          className="h-9 w-full rounded-md border bg-muted/50 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring/30 text-foreground placeholder:text-muted-foreground"
        />
      </div>

      {/* Mobile: empty spacer so right-side actions align */}
      <div className="sm:hidden" />

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <div ref={panelRef} className="relative">
          <button
            onClick={() => setPanelOpen((o) => !o)}
            className="relative inline-flex items-center justify-center h-9 w-9 rounded-md border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors"
            aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
            aria-expanded={panelOpen}
          >
            <Bell className="h-4 w-4" aria-hidden="true" />
            {unreadCount > 0 && (
              <span className="absolute right-1 top-1 grid h-4 min-w-[16px] place-items-center rounded-full bg-destructive px-0.5 text-[9px] font-bold text-destructive-foreground ring-2 ring-card">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {panelOpen && (
            <NotificationPanel
              notifications={notifications}
              unreadCount={unreadCount}
              loading={loading}
              onMarkRead={handleMarkRead}
              onMarkAllRead={handleMarkAllRead}
              onDelete={handleDelete}
              onNavigate={handleNavigate}
            />
          )}
        </div>

        {/* User */}
        <div className="hidden items-center gap-2 border-l pl-4 md:flex">
          <span className="grid size-8 place-items-center rounded-full bg-secondary text-xs font-bold text-foreground">
            {user ? `${user.firstName[0]}${user.lastName[0]}` : 'AK'}
          </span>
          <span className="text-sm font-semibold text-foreground">
            {user ? `${user.firstName} ${user.lastName}` : 'Alex Kim'}
          </span>
        </div>
      </div>
    </header>
  );
}
