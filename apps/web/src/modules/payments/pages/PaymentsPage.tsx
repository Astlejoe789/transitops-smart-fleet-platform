import { ModulePlaceholderPage } from '@/components/common/ModulePlaceholderPage';
import { CreditCard } from 'lucide-react';

export default function PaymentsPage() {
  return (
    <ModulePlaceholderPage
      moduleName="Payment Processing"
      category="Commercial"
      description="Record customer payments, bank transfers, credit card settlements, and receipts."
      icon={CreditCard}
      plannedFeatures={[
        'Payment Transaction Receipt',
        'Multi-Method Settlements',
        'Invoice Reconciliation',
        'Partial Payment Tracking',
        'Revenue Summary'
      ]}
    />
  );
}
