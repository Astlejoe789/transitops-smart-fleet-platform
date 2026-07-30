import { ShieldCheck } from 'lucide-react';
import { PageContainer, PageHeader } from '@/components/layout';
import { EmptyState } from '@/components/ui/EmptyState';

export default function AdministrationPage() {
  return (
    <PageContainer>
      <PageHeader
        title="System Administration"
        subtitle="Manage company branches, roles, permissions, and security."
      />
      
      <div className="mt-8">
        <EmptyState
          icon={ShieldCheck}
          title="Administration Settings Unavailable"
          description="System administration and RBAC features will become available in the next major release."
        />
      </div>
    </PageContainer>
  );
}

