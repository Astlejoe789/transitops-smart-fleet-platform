import { ModulePlaceholderPage } from '@/components/common/ModulePlaceholderPage';
import { Users } from 'lucide-react';

export default function DriversPage() {
  return (
    <ModulePlaceholderPage
      moduleName="Driver Management"
      category="Operations"
      description="Manage driver profiles, license categories, medical certifications, and assignments."
      icon={Users}
      plannedFeatures={[
        'Driver Profiles & Contact Info',
        'License Category & Expiry Tracking',
        'Duty & Leave Status',
        'Emergency Contacts',
        'Performance Metrics'
      ]}
    />
  );
}
