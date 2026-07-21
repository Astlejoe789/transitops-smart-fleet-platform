import { useState } from 'react';
import { X, Calendar, MapPin, Package } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useCreateTrip } from '../hooks/useTrips';

interface TripFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TripFormModal({ isOpen, onClose }: TripFormModalProps) {
  const [formData, setFormData] = useState({
    tripName: '',
    origin: '',
    destination: '',
    scheduledStart: '',
    scheduledEnd: '',
    priority: 'MEDIUM',
    cargoDescription: '',
    cargoWeight: '',
  });

  const createTrip = useCreateTrip();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTrip.mutate({
      ...formData,
      scheduledStart: new Date(formData.scheduledStart).toISOString(),
      scheduledEnd: new Date(formData.scheduledEnd).toISOString(),
      cargoWeight: formData.cargoWeight ? Number(formData.cargoWeight) : undefined,
    }, {
      onSuccess: () => onClose()
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-surface-900 w-full max-w-2xl rounded-xl shadow-xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between border-b border-surface-200 dark:border-surface-800 p-6">
          <h2 className="text-xl font-semibold text-surface-900 dark:text-white">Create New Trip</h2>
          <button onClick={onClose} className="text-surface-400 hover:text-surface-500">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-6">
          <form id="trip-form" onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                  Trip Name (Optional)
                </label>
                <input
                  type="text"
                  value={formData.tripName}
                  onChange={(e) => setFormData({ ...formData, tripName: e.target.value })}
                  className="block w-full rounded-md border-0 py-2 text-surface-900 shadow-sm ring-1 ring-inset ring-surface-300 placeholder:text-surface-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6 dark:bg-surface-800 dark:text-white dark:ring-surface-700"
                  placeholder="e.g. Weekly Restock - North Branch"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                  Pickup Location *
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <MapPin className="h-4 w-4 text-surface-400" />
                  </div>
                  <input
                    required
                    type="text"
                    value={formData.origin}
                    onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                    className="block w-full rounded-md border-0 py-2 pl-10 text-surface-900 shadow-sm ring-1 ring-inset ring-surface-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6 dark:bg-surface-800 dark:text-white dark:ring-surface-700"
                    placeholder="Origin address"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                  Drop Location *
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <MapPin className="h-4 w-4 text-surface-400" />
                  </div>
                  <input
                    required
                    type="text"
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    className="block w-full rounded-md border-0 py-2 pl-10 text-surface-900 shadow-sm ring-1 ring-inset ring-surface-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6 dark:bg-surface-800 dark:text-white dark:ring-surface-700"
                    placeholder="Destination address"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                  Scheduled Start *
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Calendar className="h-4 w-4 text-surface-400" />
                  </div>
                  <input
                    required
                    type="datetime-local"
                    value={formData.scheduledStart}
                    onChange={(e) => setFormData({ ...formData, scheduledStart: e.target.value })}
                    className="block w-full rounded-md border-0 py-2 pl-10 text-surface-900 shadow-sm ring-1 ring-inset ring-surface-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6 dark:bg-surface-800 dark:text-white dark:ring-surface-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                  Expected End *
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Calendar className="h-4 w-4 text-surface-400" />
                  </div>
                  <input
                    required
                    type="datetime-local"
                    value={formData.scheduledEnd}
                    onChange={(e) => setFormData({ ...formData, scheduledEnd: e.target.value })}
                    className="block w-full rounded-md border-0 py-2 pl-10 text-surface-900 shadow-sm ring-1 ring-inset ring-surface-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6 dark:bg-surface-800 dark:text-white dark:ring-surface-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="block w-full rounded-md border-0 py-2 text-surface-900 shadow-sm ring-1 ring-inset ring-surface-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6 dark:bg-surface-800 dark:text-white dark:ring-surface-700"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                  Cargo Weight (kg)
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Package className="h-4 w-4 text-surface-400" />
                  </div>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.cargoWeight}
                    onChange={(e) => setFormData({ ...formData, cargoWeight: e.target.value })}
                    className="block w-full rounded-md border-0 py-2 pl-10 text-surface-900 shadow-sm ring-1 ring-inset ring-surface-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6 dark:bg-surface-800 dark:text-white dark:ring-surface-700"
                    placeholder="e.g. 5000"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                  Cargo Description
                </label>
                <textarea
                  rows={2}
                  value={formData.cargoDescription}
                  onChange={(e) => setFormData({ ...formData, cargoDescription: e.target.value })}
                  className="block w-full rounded-md border-0 py-2 text-surface-900 shadow-sm ring-1 ring-inset ring-surface-300 placeholder:text-surface-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6 dark:bg-surface-800 dark:text-white dark:ring-surface-700"
                  placeholder="Describe the goods being transported..."
                />
              </div>

            </div>
          </form>
        </div>

        <div className="border-t border-surface-200 dark:border-surface-800 p-6 flex justify-end gap-3 bg-surface-50 dark:bg-surface-800/50 rounded-b-xl">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="trip-form" isLoading={createTrip.isPending}>
            Create Trip
          </Button>
        </div>
      </div>
    </div>
  );
}
