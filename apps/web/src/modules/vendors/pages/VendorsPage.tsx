import { ModulePlaceholderPage } from '@/components/common/ModulePlaceholderPage';
import { Building2 } from 'lucide-react';

export default function VendorsPage() {
  return (
    <ModulePlaceholderPage
      moduleName="Vendor Management"
      category="Commercial"
      description="Manage workshop providers, fuel suppliers, spare parts vendors, and contracts."
      icon={Building2}
      plannedFeatures={[
        'Vendor Directory',
        'Category Classification',
        'Service History & Rating',
        'Tax ID & Payment Terms',
        'Contract Expiry Alerts'
      ]}
    />
  );
}
