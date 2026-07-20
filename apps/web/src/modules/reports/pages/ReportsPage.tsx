import { ModulePlaceholderPage } from '@/components/common/ModulePlaceholderPage';
import { BarChart3 } from 'lucide-react';

export default function ReportsPage() {
  return (
    <ModulePlaceholderPage
      moduleName="Operational Reports"
      category="Intelligence"
      description="Generate downloadable operational reports for fleet, trips, fuel, and compliance."
      icon={BarChart3}
      plannedFeatures={[
        'Fleet Utilization Report',
        'Driver Hours Log Report',
        'Fuel & Expense Statements',
        'Maintenance Audit Export',
        'Custom PDF & CSV Export'
      ]}
    />
  );
}
