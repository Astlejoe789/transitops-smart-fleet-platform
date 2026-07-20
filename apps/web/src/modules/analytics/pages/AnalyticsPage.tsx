import { ModulePlaceholderPage } from '@/components/common/ModulePlaceholderPage';
import { TrendingUp } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <ModulePlaceholderPage
      moduleName="Data Analytics"
      category="Intelligence"
      description="Visual analytics dashboards for operational efficiency, cost per trip, and trends."
      icon={TrendingUp}
      plannedFeatures={[
        'Fleet Cost Per Kilometer',
        'Revenue vs Operating Cost',
        'Driver Performance Trends',
        'Route Efficiency Heatmaps',
        'Interactive Chart Widgets'
      ]}
    />
  );
}
