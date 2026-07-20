import { ModulePlaceholderPage } from '@/components/common/ModulePlaceholderPage';
import { UserSquare2 } from 'lucide-react';

export default function CustomersPage() {
  return (
    <ModulePlaceholderPage
      moduleName="Customer Management"
      category="Commercial"
      description="Freight customer CRM, contract terms, billing addresses, and order history."
      icon={UserSquare2}
      plannedFeatures={[
        'Customer Account Profiles',
        'Contract Terms & Rates',
        'Order History & Ledger',
        'Tax & Invoicing Details',
        'Credit Limit Monitoring'
      ]}
    />
  );
}
