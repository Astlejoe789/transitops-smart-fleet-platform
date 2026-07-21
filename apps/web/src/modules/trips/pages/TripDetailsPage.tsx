import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, Edit2, Play, CheckCircle, Truck, User,
  MapPin, Activity, FileText, Receipt, Wrench, Package, Navigation, Map
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useTrip, useUpdateTripStatus } from '../hooks/useTrips';

export default function TripDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: trip, isLoading } = useTrip(id!);
  const updateStatus = useUpdateTripStatus();
  
  const [activeTab, setActiveTab] = useState('overview');

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h2 className="text-xl font-semibold text-surface-900">Trip not found</h2>
        <Link to="/trips" className="mt-4 text-primary-600 hover:underline">
          Back to Trips
        </Link>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: FileText },
    { id: 'route', name: 'Route', icon: Map },
    { id: 'assignments', name: 'Assignments', icon: Truck },
    { id: 'cargo', name: 'Cargo', icon: Package },
    { id: 'timeline', name: 'Timeline', icon: Activity },
    { id: 'documents', name: 'Documents', icon: FileText },
    { id: 'expenses', name: 'Expenses', icon: Receipt },
    { id: 'maintenance', name: 'Maintenance', icon: Wrench },
  ];

  const handleStatusChange = (status: any) => {
    updateStatus.mutate({ id: trip.id, status });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/trips"
          className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white dark:bg-surface-800 text-surface-500 hover:text-surface-900 dark:hover:text-white shadow-sm ring-1 ring-inset ring-surface-200 dark:ring-surface-700"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="flex-1 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-surface-900 dark:text-white sm:text-3xl">
              {trip.tripNumber}
            </h1>
            <Badge variant="outline">{trip.status.replace(/_/g, ' ')}</Badge>
          </div>
          <div className="flex items-center gap-2">
            {trip.status === 'READY_FOR_DISPATCH' && (
              <Button size="sm" onClick={() => handleStatusChange('IN_PROGRESS')} isLoading={updateStatus.isPending}>
                <Play className="mr-2 h-4 w-4" /> Start Trip
              </Button>
            )}
            {trip.status === 'IN_PROGRESS' && (
              <Button size="sm" variant="outline" onClick={() => handleStatusChange('COMPLETED')} isLoading={updateStatus.isPending}>
                <CheckCircle className="mr-2 h-4 w-4 text-emerald-500" /> Complete Trip
              </Button>
            )}
            <Button size="sm" variant="outline">
              <Edit2 className="mr-2 h-4 w-4" /> Edit
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white dark:bg-surface-900 shadow-sm ring-1 ring-surface-200 dark:ring-surface-800 rounded-xl overflow-hidden">
        
        {/* Quick Info Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-surface-200 dark:divide-surface-800 border-b border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-800/50">
          <div className="p-4 flex items-center gap-3">
            <MapPin className="h-8 w-8 text-surface-400" />
            <div>
              <p className="text-xs font-medium text-surface-500 uppercase tracking-wider">Origin</p>
              <p className="font-medium text-surface-900 dark:text-white truncate">{trip.origin}</p>
            </div>
          </div>
          <div className="p-4 flex items-center gap-3">
            <Navigation className="h-8 w-8 text-surface-400" />
            <div>
              <p className="text-xs font-medium text-surface-500 uppercase tracking-wider">Destination</p>
              <p className="font-medium text-surface-900 dark:text-white truncate">{trip.destination}</p>
            </div>
          </div>
          <div className="p-4 flex items-center gap-3">
            <User className="h-8 w-8 text-surface-400" />
            <div>
              <p className="text-xs font-medium text-surface-500 uppercase tracking-wider">Driver</p>
              <p className="font-medium text-surface-900 dark:text-white truncate">
                {trip.driver ? `${trip.driver.user.firstName} ${trip.driver.user.lastName}` : 'Unassigned'}
              </p>
            </div>
          </div>
          <div className="p-4 flex items-center gap-3">
            <Truck className="h-8 w-8 text-surface-400" />
            <div>
              <p className="text-xs font-medium text-surface-500 uppercase tracking-wider">Vehicle</p>
              <p className="font-medium text-surface-900 dark:text-white truncate">
                {trip.vehicle ? trip.vehicle.plateNumber : 'Unassigned'}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-surface-200 dark:border-surface-800 overflow-x-auto">
          <nav className="flex px-4" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 py-4 px-4 border-b-2 text-sm font-medium whitespace-nowrap transition-colors
                    ${
                      activeTab === tab.id
                        ? 'border-primary-600 text-primary-600 dark:text-primary-400 dark:border-primary-400'
                        : 'border-transparent text-surface-500 hover:text-surface-700 hover:border-surface-300 dark:hover:text-surface-300 dark:hover:border-surface-600'
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6 min-h-[400px]">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-medium text-surface-900 dark:text-white mb-4">Trip Details</h3>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                  <div>
                    <dt className="text-sm font-medium text-surface-500">Scheduled Start</dt>
                    <dd className="mt-1 text-sm text-surface-900 dark:text-white">
                      {new Date(trip.scheduledStart).toLocaleString()}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-surface-500">Scheduled End</dt>
                    <dd className="mt-1 text-sm text-surface-900 dark:text-white">
                      {new Date(trip.scheduledEnd).toLocaleString()}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-surface-500">Priority</dt>
                    <dd className="mt-1 text-sm text-surface-900 dark:text-white">{trip.priority}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-surface-500">Customer</dt>
                    <dd className="mt-1 text-sm text-surface-900 dark:text-white">
                      {trip.customer ? trip.customer.name : 'N/A'}
                    </dd>
                  </div>
                </dl>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-surface-900 dark:text-white mb-4">Notes</h3>
                <div className="bg-surface-50 dark:bg-surface-800 p-4 rounded-md text-sm text-surface-700 dark:text-surface-300">
                  {trip.notes || 'No notes provided for this trip.'}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'route' && (
            <div className="flex items-center justify-center h-full min-h-[300px] border-2 border-dashed border-surface-200 dark:border-surface-800 rounded-xl">
              <div className="text-center">
                <Map className="mx-auto h-12 w-12 text-surface-300" />
                <h3 className="mt-2 text-sm font-semibold text-surface-900 dark:text-white">Interactive Map</h3>
                <p className="mt-1 text-sm text-surface-500">Map integration coming soon.</p>
              </div>
            </div>
          )}

          {activeTab === 'assignments' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-surface-200 dark:border-surface-800 rounded-lg p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-surface-900 dark:text-white flex items-center">
                    <User className="mr-2 h-5 w-5 text-primary-600" /> Driver
                  </h3>
                  <Button variant="outline" size="sm">Change Driver</Button>
                </div>
                {trip.driver ? (
                  <div>
                    <p className="font-medium text-surface-900 dark:text-white">{trip.driver.user.firstName} {trip.driver.user.lastName}</p>
                    <p className="text-sm text-surface-500">{trip.driver.user.email}</p>
                  </div>
                ) : (
                  <p className="text-sm text-surface-500 italic">No driver assigned.</p>
                )}
              </div>
              <div className="border border-surface-200 dark:border-surface-800 rounded-lg p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-surface-900 dark:text-white flex items-center">
                    <Truck className="mr-2 h-5 w-5 text-primary-600" /> Vehicle
                  </h3>
                  <Button variant="outline" size="sm">Change Vehicle</Button>
                </div>
                {trip.vehicle ? (
                  <div>
                    <p className="font-medium text-surface-900 dark:text-white">{trip.vehicle.plateNumber}</p>
                    <p className="text-sm text-surface-500">{trip.vehicle.make} {trip.vehicle.model}</p>
                  </div>
                ) : (
                  <p className="text-sm text-surface-500 italic">No vehicle assigned.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'cargo' && (
            <div>
              <h3 className="text-lg font-medium text-surface-900 dark:text-white mb-4">Cargo Information</h3>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                <div>
                  <dt className="text-sm font-medium text-surface-500">Description</dt>
                  <dd className="mt-1 text-sm text-surface-900 dark:text-white">
                    {trip.cargoDescription || 'N/A'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-surface-500">Weight (kg)</dt>
                  <dd className="mt-1 text-sm text-surface-900 dark:text-white">
                    {trip.cargoWeight ? trip.cargoWeight.toLocaleString() : 'N/A'}
                  </dd>
                </div>
              </dl>
            </div>
          )}

          {/* Placeholders for upcoming modules */}
          {['expenses', 'maintenance', 'documents', 'timeline'].includes(activeTab) && (
            <div className="flex items-center justify-center h-full min-h-[300px] border-2 border-dashed border-surface-200 dark:border-surface-800 rounded-xl">
              <div className="text-center">
                <Activity className="mx-auto h-12 w-12 text-surface-300" />
                <h3 className="mt-2 text-sm font-semibold text-surface-900 dark:text-white capitalize">{activeTab}</h3>
                <p className="mt-1 text-sm text-surface-500">This module is part of a future phase.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
