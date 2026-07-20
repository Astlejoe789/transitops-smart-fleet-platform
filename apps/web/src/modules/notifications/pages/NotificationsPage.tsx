import { ModulePlaceholderPage } from '@/components/common/ModulePlaceholderPage';
import { Bell } from 'lucide-react';

export default function NotificationsPage() {
  return (
    <ModulePlaceholderPage
      moduleName="Notification Center"
      category="System"
      description="Centralized alerts for compliance expiries, maintenance schedules, and trip updates."
      icon={Bell}
      plannedFeatures={[
        'Alert Severity Categorization',
        'Unread Filter & Bulk Mark Read',
        'Email & Push Notification Sync',
        'Real-time Telemetry Alerts',
        'Custom Notification Triggers'
      ]}
    />
  );
}
