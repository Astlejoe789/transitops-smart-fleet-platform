import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { TripFilters } from '../components/TripFilters';
import { TripTable } from '../components/TripTable';
import { TripFormModal } from '../components/TripFormModal';
import { useTrips } from '../hooks/useTrips';
import { useNavigate } from 'react-router-dom';

export default function TripsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [page, setPage] = useState(1);

  const { data, isLoading } = useTrips({
    page,
    limit: 10,
    search: search || undefined,
    status: statusFilter || undefined,
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-surface-900 dark:text-white sm:text-3xl">
            Trips
          </h1>
          <p className="mt-1 text-sm text-surface-500 dark:text-surface-400">
            Manage your fleet trips, routes, and assignments.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Trip
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-surface-900 rounded-xl shadow-sm border border-surface-200 dark:border-surface-800 p-6">
        <TripFilters
          search={search}
          setSearch={setSearch}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />
        
        <TripTable 
          data={data?.data || []} 
          isLoading={isLoading} 
          onView={(id) => navigate(`/trips/${id}`)}
        />

        {data?.meta && data.meta.totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between border-t border-surface-200 dark:border-surface-800 pt-4">
            <Button 
              variant="outline" 
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
            >
              Previous
            </Button>
            <span className="text-sm text-surface-600 dark:text-surface-400">
              Page {page} of {data.meta.totalPages}
            </span>
            <Button 
              variant="outline" 
              disabled={page === data.meta.totalPages}
              onClick={() => setPage(p => p + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>

      <TripFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
      />
    </div>
  );
}
