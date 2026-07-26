import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { DispatchBoard } from '../components/DispatchBoard';
import { useDispatchBoard } from '../hooks/useTrips';
import { PageContainer, PageHeader } from "@/components/layout";

export default function DispatchPage() {
  const { data, isLoading, refetch, isRefetching } = useDispatchBoard();

  return (
    <PageContainer className="space-y-6 max-w-[1600px] mx-auto pb-8 h-[calc(100vh-6rem)] flex flex-col">
      <PageHeader 
                  title="Dispatch Board"
                  subtitle="Live operational view of all active and pending assignments."
                  actions={<>
                    
          <Button variant="outline" onClick={() => refetch()} isLoading={isRefetching}>
                      <RefreshCw className={`mr-2 h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
                      Refresh
                    </Button>

                  </>}
                />

      {isLoading ? (
        <div className="flex-1 bg-white dark:bg-surface-900 rounded-xl shadow-sm border border-surface-200 dark:border-surface-800 p-8 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : data ? (
        <div className="flex-1 min-h-0">
          <DispatchBoard data={data} />
        </div>
      ) : (
        <div className="flex-1 bg-white dark:bg-surface-900 rounded-xl shadow-sm border border-surface-200 dark:border-surface-800 p-8 flex items-center justify-center">
          <p className="text-surface-500">Failed to load dispatch board data.</p>
        </div>
      )}
    </PageContainer>
  );
}
