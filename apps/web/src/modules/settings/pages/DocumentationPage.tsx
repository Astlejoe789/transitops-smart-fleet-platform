import { HelpCircle } from 'lucide-react';
import { PageContainer, PageHeader } from "@/components/layout";
import { EmptyState } from '@/components/ui/EmptyState';

export default function DocumentationPage() {
  return (
    <PageContainer maxWidth="ultra" className="space-y-6">
      <PageHeader 
        title="Documentation & Support"
        subtitle="Access guides, API documentation, and contact support."
      />

      <div className="mt-8">
        <EmptyState
          icon={HelpCircle}
          title="Documentation is not available yet."
          description="The knowledge base and support center will become available in a future update."
        />
      </div>
    </PageContainer>
  );
}
