import { ModulePlaceholderPage } from '@/components/common/ModulePlaceholderPage';
import { FileText } from 'lucide-react';

export default function BillingPage() {
  return (
    <ModulePlaceholderPage
      moduleName="Billing & Invoicing"
      category="Commercial"
      description="Generate customer invoices, line item breakdowns, due dates, and tax calculations."
      icon={FileText}
      plannedFeatures={[
        'Invoice Generation',
        'Line Item Customization',
        'Tax & Freight Charge Calc',
        'PDF Export & Emailing',
        'Overdue Tracking & Reminders'
      ]}
    />
  );
}
