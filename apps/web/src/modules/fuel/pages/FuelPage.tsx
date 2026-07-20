import { ModulePlaceholderPage } from '@/components/common/ModulePlaceholderPage';
import { Fuel } from 'lucide-react';

export default function FuelPage() {
  return (
    <ModulePlaceholderPage
      moduleName="Fuel Logs"
      category="Operations"
      description="Monitor fuel consumption, station receipts, efficiency metrics, and cost per km."
      icon={Fuel}
      plannedFeatures={[
        'Refueling Transaction Logs',
        'Fuel Efficiency Analytics (L/100km)',
        'Receipt Upload & Audit',
        'Fuel Card Integration',
        'Abnormal Fuel Alert Trigger'
      ]}
    />
  );
}
