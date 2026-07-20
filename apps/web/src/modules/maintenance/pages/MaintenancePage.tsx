import { ModulePlaceholderPage } from '@/components/common/ModulePlaceholderPage';
import { Wrench } from 'lucide-react';

export default function MaintenancePage() {
  return (
    <ModulePlaceholderPage
      moduleName="Maintenance Logs"
      category="Operations"
      description="Schedule routine servicing, track repair orders, and manage vendor service costs."
      icon={Wrench}
      plannedFeatures={[
        'Service Schedule Calendar',
        'Work Order Generation',
        'Repair & Breakdown Logs',
        'Vendor Service Billing',
        'Parts & Labor Cost Tracking'
      ]}
    />
  );
}
