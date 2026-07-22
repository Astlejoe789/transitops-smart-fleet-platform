import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useQuery } from '@tanstack/react-query';
import { notificationsApi } from '../services/notificationsApi';
import { NotificationDrawer } from './NotificationDrawer';
import { useState } from 'react';

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const { data, refetch } = useQuery({
    queryKey: ['notifications', 'unread'],
    queryFn: () => notificationsApi.getNotifications({ limit: 5 }),
  });

  const unreadCount = data?.unread || 0;

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setOpen(true)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 animate-pulse" />
        )}
      </Button>

      <NotificationDrawer 
        open={open} 
        onClose={() => {
          setOpen(false);
          refetch();
        }} 
        data={data?.notifications || []} 
        unreadCount={unreadCount}
      />
    </>
  );
}
