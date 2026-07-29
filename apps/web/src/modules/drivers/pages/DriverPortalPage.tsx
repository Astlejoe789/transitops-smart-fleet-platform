import { PageContainer, PageHeader } from "@/components/layout";
import { Button } from '@/components/ui/Button';

export default function DriverPortalPage() {
  return (
    <PageContainer>
      <PageHeader 
        title="Driver Portal" 
        subtitle="Self-service portal for drivers to manage trips, logs, and compliance."
      />

      <div className="flex flex-col items-center justify-center rounded-[18px] border border-dashed border-surface-700/50 bg-surface-900/30 text-center p-16 min-h-[340px]">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-500/10 mb-6">
          <svg className="h-8 w-8 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h3 className="text-[length:var(--text-h3)] leading-[var(--leading-h3)] font-semibold text-white">
          Portal Not Active
        </h3>
        <p className="mt-2 max-w-sm text-[length:var(--text-body-sm)] text-surface-400">
          You currently have no active driver profile associated with this account. Contact your fleet manager to get set up.
        </p>
        <Button className="mt-8">
          Request Access
        </Button>
      </div>
    </PageContainer>
  );
}
