import { ModulePlaceholderPage } from '@/components/common/ModulePlaceholderPage';
import { Settings } from 'lucide-react';

export default function SettingsPage() {
  return (
    <ModulePlaceholderPage
      moduleName="Application Settings"
      category="System"
      description="Configure organization profile, system preferences, notification rules, and integrations."
      icon={Settings}
      plannedFeatures={[
        'Company Profile & Logo',
        'System Preferences (Units/Currency)',
        'Tax & Financial Rules',
        'API Keys & Webhooks',
        'Data Export & Backup'
      ]}
    />
  );
}
