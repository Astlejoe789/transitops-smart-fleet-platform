import { User } from 'lucide-react';
import { PageContainer, PageHeader } from "@/components/layout";
import { EmptyState } from '@/components/ui/EmptyState';

export default function ProfilePage() {
  return (
    <PageContainer maxWidth="ultra" className="space-y-6">
      <PageHeader 
        title="Profile & Account"
        subtitle="Manage your personal details, preferences, and account security."
      />

      <div className="mt-8">
        <EmptyState
          icon={User}
          title="Profile settings are not available yet."
          description="Your profile and account settings will become available in a future update."
        />
      </div>
    </PageContainer>
  );
}
