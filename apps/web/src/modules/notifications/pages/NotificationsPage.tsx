import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsApi, Notification } from '../services/notificationsApi';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Bell, Info, AlertTriangle, CheckCircle, XCircle, Trash2, Check, Settings } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

const CategoryIcon = ({ category }: { category: string }) => {
  switch (category) {
    case 'SUCCESS': return <CheckCircle className="h-5 w-5 text-green-500" />;
    case 'WARNING': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    case 'ERROR':
    case 'CRITICAL': return <XCircle className="h-5 w-5 text-red-500" />;
    default: return <Info className="h-5 w-5 text-blue-500" />;
  }
};

export default function NotificationsPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['notifications', 'all'],
    queryFn: () => notificationsApi.getNotifications({ limit: 50 }),
  });

  const markAsReadMutation = useMutation({
    mutationFn: notificationsApi.markAsRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] })
  });

  const markAllMutation = useMutation({
    mutationFn: notificationsApi.markAllAsRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] })
  });

  const deleteMutation = useMutation({
    mutationFn: notificationsApi.deleteNotification,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] })
  });

  if (isLoading) return <div className="p-8 text-center">Loading notifications...</div>;

  const notifications = data?.notifications || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notification Center</h1>
          <p className="text-muted-foreground mt-2">Manage all your operational alerts and messages.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => markAllMutation.mutate()}>
            <Check className="mr-2 h-4 w-4" /> Mark all read
          </Button>
          <Button variant="default" onClick={() => navigate('/dashboard/settings/notifications')}>
            <Settings className="mr-2 h-4 w-4" /> Preferences
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground flex flex-col items-center">
              <Bell className="h-12 w-12 mb-4 opacity-20" />
              <p>You're all caught up!</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((n: Notification) => (
                <div key={n.id} className={cn("p-6 flex items-start gap-4 transition-colors", !n.isRead ? "bg-muted/20" : "hover:bg-muted/10")}>
                  <div className="mt-1">
                    <CategoryIcon category={n.category} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className={cn("text-base", !n.isRead ? "font-semibold" : "font-medium")}>{n.title}</h3>
                      <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                        {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{n.message}</p>
                    <div className="mt-2 flex gap-4 text-xs font-medium text-muted-foreground">
                      <span className="uppercase tracking-wider">{n.type.replace(/_/g, ' ')}</span>
                      <span className={cn("uppercase tracking-wider", n.priority === 'URGENT' ? "text-red-500" : "")}>{n.priority}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!n.isRead && (
                      <Button variant="ghost" size="sm" onClick={() => markAsReadMutation.mutate(n.id)}>
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => deleteMutation.mutate(n.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
