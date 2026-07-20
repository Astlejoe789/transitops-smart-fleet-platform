import { ModulePlaceholderPage } from '@/components/common/ModulePlaceholderPage';
import { Sparkles } from 'lucide-react';

export default function AiPage() {
  return (
    <ModulePlaceholderPage
      moduleName="AI Insights"
      category="Intelligence"
      description="AI-powered predictive maintenance, smart route recommendations, and fuel optimization."
      icon={Sparkles}
      plannedFeatures={[
        'Predictive Breakdown Alerts',
        'Optimal Driver-Vehicle Match',
        'Smart Route Fuel Savings',
        'Anomaly Detection in Logs',
        'AI Operations Assistant'
      ]}
    />
  );
}
