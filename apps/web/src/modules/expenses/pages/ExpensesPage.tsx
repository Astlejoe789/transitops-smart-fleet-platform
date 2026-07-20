import { ModulePlaceholderPage } from '@/components/common/ModulePlaceholderPage';
import { Receipt } from 'lucide-react';

export default function ExpensesPage() {
  return (
    <ModulePlaceholderPage
      moduleName="Expense Management"
      category="Operations"
      description="Track operational expenses including tolls, driver allowances, permits, and parking."
      icon={Receipt}
      plannedFeatures={[
        'Expense Submission & Receipts',
        'Trip-Linked Expense Audit',
        'Multi-Category Classification',
        'Approval Workflow',
        'Cost Allocation Reports'
      ]}
    />
  );
}
