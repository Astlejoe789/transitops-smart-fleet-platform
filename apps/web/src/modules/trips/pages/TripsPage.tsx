import { ModulePlaceholderPage } from '@/components/common/ModulePlaceholderPage';
import { Route } from 'lucide-react';

export default function TripsPage() {
  return (
    <ModulePlaceholderPage
      moduleName="Trip Management"
      category="Operations"
      description="Schedule, dispatch, track, and complete transport trips across fleet routes."
      icon={Route}
      plannedFeatures={[
        'Trip Scheduling & Dispatch',
        'Origin & Destination Route Map',
        'Vehicle & Driver Assignment',
        'Real-time Cargo Tracking',
        'Trip Cost & Odometer Logs'
      ]}
    />
  );
}
