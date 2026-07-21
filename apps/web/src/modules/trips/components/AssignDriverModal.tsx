import { useState } from 'react';
import { X, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAssignDriver } from '../hooks/useTrips';
import { useQuery } from '@tanstack/react-query';
import { apiClient as api } from '@/api/client';

interface AssignDriverModalProps {
  tripId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AssignDriverModal({ tripId, isOpen, onClose }: AssignDriverModalProps) {
  const [search, setSearch] = useState('');
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
  
  const { data: driversResponse, isLoading } = useQuery({
    queryKey: ['drivers', 'available', search],
    queryFn: async () => {
      const { data } = await api.get('/drivers', { params: { status: 'AVAILABLE', search, limit: 10 } });
      return data;
    },
    enabled: isOpen,
  });
  
  const drivers = driversResponse?.data || [];
  const assignDriver = useAssignDriver();

  if (!isOpen || !tripId) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDriverId) return;
    
    assignDriver.mutate({ id: tripId, driverId: selectedDriverId }, {
      onSuccess: () => {
        setSelectedDriverId(null);
        onClose();
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-surface-900 w-full max-w-lg rounded-xl shadow-xl flex flex-col">
        <div className="flex items-center justify-between border-b border-surface-200 dark:border-surface-800 p-6">
          <h2 className="text-xl font-semibold text-surface-900 dark:text-white">Assign Driver</h2>
          <button onClick={onClose} className="text-surface-400 hover:text-surface-500">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-4 min-h-[300px]">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-surface-400" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full rounded-md border-0 py-2 pl-10 text-surface-900 shadow-sm ring-1 ring-inset ring-surface-300 placeholder:text-surface-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6 dark:bg-surface-800 dark:text-white dark:ring-surface-700"
              placeholder="Search available drivers..."
            />
          </div>

          <div className="flex-1 overflow-y-auto border border-surface-200 dark:border-surface-800 rounded-md">
            {isLoading ? (
              <div className="p-4 text-center text-sm text-surface-500">Loading drivers...</div>
            ) : drivers.length === 0 ? (
              <div className="p-4 text-center text-sm text-surface-500">No available drivers found.</div>
            ) : (
              <ul className="divide-y divide-surface-200 dark:divide-surface-800">
                {drivers.map((driver: any) => (
                  <li 
                    key={driver.id} 
                    className={`p-4 hover:bg-surface-50 dark:hover:bg-surface-800/50 cursor-pointer flex items-center justify-between ${selectedDriverId === driver.id ? 'bg-primary-50 dark:bg-primary-900/20' : ''}`}
                    onClick={() => setSelectedDriverId(driver.id)}
                  >
                    <div>
                      <p className="font-medium text-surface-900 dark:text-white">{driver.user.firstName} {driver.user.lastName}</p>
                      <p className="text-xs text-surface-500">ID: {driver.employeeId} | {driver.licenseCategory}</p>
                    </div>
                    <div className="h-4 w-4 rounded-full border border-surface-300 dark:border-surface-600 flex items-center justify-center">
                      {selectedDriverId === driver.id && <div className="h-2 w-2 rounded-full bg-primary-600" />}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="border-t border-surface-200 dark:border-surface-800 p-6 flex justify-end gap-3 bg-surface-50 dark:bg-surface-800/50 rounded-b-xl">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!selectedDriverId || assignDriver.isPending} isLoading={assignDriver.isPending}>
            Assign Selected
          </Button>
        </div>
      </div>
    </div>
  );
}
