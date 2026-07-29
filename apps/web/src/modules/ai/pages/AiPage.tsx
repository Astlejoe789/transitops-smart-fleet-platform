import { Sparkles } from 'lucide-react';
import { PageContainer, PageHeader } from "@/components/layout";
import { EmptyState } from '@/components/ui/EmptyState';

export default function AiPage() {
  return (
    <PageContainer className="space-y-6">
      <PageHeader 
        title="AI Insights"
        subtitle="Harness the power of machine learning to predict trends, identify risks, and optimize your fleet operations."
      />

      <div className="mt-8">
        <EmptyState
          icon={Sparkles}
          title="AI analytics are not available yet."
          description="AI features will become available after sufficient operational data has been collected."
          action={{
            label: "Generate Insights",
            onClick: () => {},
            disabled: true
          }}
        />
      </div>
    </PageContainer>
  );
}
