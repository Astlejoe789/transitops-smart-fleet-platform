import { Button } from '@/components/ui/Button';
import { Notification } from '../services/notificationsApi';
import { formatDistanceToNow } from 'date-fns';
import { Bell, Info, AlertTriangle, CheckCircle, XCircle, X } from 'lucide-react';
import { notificationsApi } from '../services/notificationsApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface NotificationDrawerProps {
  open: boolean;
  onClose: () => void;
  data: Notification[];
  unreadCount: number;
}

const CategoryIcon = ({ category }: { category: string }) => {
  switch (category) {
    case 'SUCCESS': return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'WARNING': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    case 'ERROR':
    case 'CRITICAL': return <XCircle className="h-4 w-4 text-red-500" />;
    default: return <Info className="h-4 w-4 text-blue-500" />;
  }
};

export function NotificationDrawer({ open, onClose, data, unreadCount }: NotificationDrawerProps) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const markAllMutation = useMutation({
    mutationFn: notificationsApi.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />
      <div className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white dark:bg-surface-900 shadow-2xl z-50 flex flex-col transform transition-transform duration-300">
        <div className="flex flex-row justify-between items-center p-4 border-b dark:border-surface-800">
          <div className="flex items-center gap-2 font-bold text-lg">
            <Bell className="h-5 w-5" />
            Notifications ({unreadCount})
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={() => markAllMutation.mutate()}>
                Mark read
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {data.length === 0 ? (
            <div className="text-center text-muted-foreground mt-10">No new notifications</div>
          ) : (
            data.map(n => (
              <div key={n.id} className={cn("p-4 rounded-lg border", !n.isRead ? "bg-muted/50 border-primary/20" : "bg-card")}>
                <div className="flex items-start gap-3">
                  <CategoryIcon category={n.category} />
                  <div className="flex-1">
                    <p className={cn("text-sm font-medium", !n.isRead && "font-semibold")}>{n.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{n.message}</p>
                    <p className="text-xs text-muted-foreground mt-2">{formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t dark:border-surface-800">
          <Button className="w-full" variant="outline" onClick={() => { onClose(); navigate('/dashboard/notifications'); }}>
            View All Notifications
          </Button>
        </div>
      </div>
    </>
  );
}
