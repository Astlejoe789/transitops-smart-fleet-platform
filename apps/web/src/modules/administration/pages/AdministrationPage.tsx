import { ModulePlaceholderPage } from '@/components/common/ModulePlaceholderPage';
import { ShieldCheck } from 'lucide-react';

export default function AdministrationPage() {
  return (
    <ModulePlaceholderPage
      moduleName="System Administration"
      category="System"
      description="Manage company branches, system roles, permissions, audit logs, and security."
      icon={ShieldCheck}
      plannedFeatures={[
        'Company Branch Management',
        'RBAC Role & Permission Editor',
        'System User Provisioning',
        'Audit Trail Log Viewer',
        'Security Policy Settings'
      ]}
    />
  );
}
