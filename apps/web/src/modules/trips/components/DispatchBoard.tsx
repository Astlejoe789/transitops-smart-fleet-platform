import { useState } from 'react';
import { Truck, User, MapPin, Navigation, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { AssignDriverModal } from './AssignDriverModal';
import { AssignVehicleModal } from './AssignVehicleModal';
import { useUpdateTripStatus } from '../hooks/useTrips';
import type { Trip } from '../types';

interface DispatchBoardProps {
  data: {
    pending: Trip[];
    assigned: Trip[];
    active: Trip[];
    completed: Trip[];
  };
}

export function DispatchBoard({ data }: DispatchBoardProps) {
  const [assignDriverTripId, setAssignDriverTripId] = useState<string | null>(null);
  const [assignVehicleTripId, setAssignVehicleTripId] = useState<string | null>(null);
  
  const updateStatus = useUpdateTripStatus();

  const handleStartTrip = (id: string) => {
    updateStatus.mutate({ id, status: 'IN_PROGRESS' });
  };

  const handleCompleteTrip = (id: string) => {
    updateStatus.mutate({ id, status: 'COMPLETED' });
  };

  const TripCard = ({ trip, type }: { trip: Trip, type: 'pending' | 'assigned' | 'active' | 'completed' }) => (
    <div className="bg-white dark:bg-surface-800 p-4 rounded-lg shadow-sm border border-surface-200 dark:border-surface-700 space-y-3">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-surface-900 dark:text-white">{trip.tripNumber}</span>
        <Badge variant={
          trip.status === 'READY_FOR_DISPATCH' ? 'success' :
          trip.status === 'IN_PROGRESS' ? 'default' :
          trip.status === 'DELAYED' ? 'destructive' : 'secondary'
        }>
          {trip.status.replace(/_/g, ' ')}
        </Badge>
      </div>
      
      <div className="space-y-1.5 text-sm text-surface-600 dark:text-surface-300">
        <div className="flex items-start">
          <MapPin className="h-4 w-4 mr-2 mt-0.5 text-surface-400 shrink-0" />
          <span className="line-clamp-1">{trip.origin}</span>
        </div>
        <div className="flex items-start">
          <Navigation className="h-4 w-4 mr-2 mt-0.5 text-surface-400 shrink-0" />
          <span className="line-clamp-1">{trip.destination}</span>
        </div>
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-2 text-surface-400 shrink-0" />
          <span>{new Date(trip.scheduledStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>

      <div className="pt-3 border-t border-surface-100 dark:border-surface-700 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1.5">
            <User className={`h-4 w-4 ${trip.driver ? 'text-primary-600 dark:text-primary-400' : 'text-surface-400'}`} />
            <span className={trip.driver ? 'text-surface-900 dark:text-white font-medium' : 'text-surface-500 italic'}>
              {trip.driver ? `${trip.driver.user.firstName} ${trip.driver.user.lastName}` : 'Unassigned'}
            </span>
          </div>
          {type === 'pending' || type === 'assigned' ? (
            <button onClick={() => setAssignDriverTripId(trip.id)} className="text-primary-600 hover:text-primary-700 text-xs font-medium">
              {trip.driver ? 'Change' : 'Assign'}
            </button>
          ) : null}
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1.5">
            <Truck className={`h-4 w-4 ${trip.vehicle ? 'text-primary-600 dark:text-primary-400' : 'text-surface-400'}`} />
            <span className={trip.vehicle ? 'text-surface-900 dark:text-white font-medium' : 'text-surface-500 italic'}>
              {trip.vehicle ? trip.vehicle.plateNumber : 'Unassigned'}
            </span>
          </div>
          {type === 'pending' || type === 'assigned' ? (
            <button onClick={() => setAssignVehicleTripId(trip.id)} className="text-primary-600 hover:text-primary-700 text-xs font-medium">
              {trip.vehicle ? 'Change' : 'Assign'}
            </button>
          ) : null}
        </div>
      </div>

      {type === 'assigned' && trip.status === 'READY_FOR_DISPATCH' && (
        <div className="pt-2">
          <Button className="w-full" size="sm" onClick={() => handleStartTrip(trip.id)} isLoading={updateStatus.isPending}>
            <Play className="h-4 w-4 mr-2" /> Start Trip
          </Button>
        </div>
      )}

      {type === 'active' && trip.status === 'IN_PROGRESS' && (
        <div className="pt-2">
          <Button className="w-full" variant="outline" size="sm" onClick={() => handleCompleteTrip(trip.id)} isLoading={updateStatus.isPending}>
            <CheckCircle className="h-4 w-4 mr-2 text-emerald-500" /> Mark Completed
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 h-[calc(100vh-12rem)] overflow-hidden">
        
        {/* Pending Column */}
        <div className="flex flex-col bg-surface-50 dark:bg-surface-900/50 rounded-xl border border-surface-200 dark:border-surface-800 h-full">
          <div className="p-4 border-b border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 rounded-t-xl">
            <h3 className="font-semibold text-surface-900 dark:text-white flex justify-between">
              Pending 
              <span className="bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 px-2 py-0.5 rounded-full text-xs">
                {data.pending.length}
              </span>
            </h3>
          </div>
          <div className="p-4 flex-1 overflow-y-auto space-y-4">
            {data.pending.map(trip => <TripCard key={trip.id} trip={trip} type="pending" />)}
            {data.pending.length === 0 && <p className="text-sm text-surface-500 text-center py-4">No pending trips</p>}
          </div>
        </div>

        {/* Assigned / Ready Column */}
        <div className="flex flex-col bg-surface-50 dark:bg-surface-900/50 rounded-xl border border-surface-200 dark:border-surface-800 h-full">
          <div className="p-4 border-b border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 rounded-t-xl">
            <h3 className="font-semibold text-surface-900 dark:text-white flex justify-between">
              Assigned & Ready 
              <span className="bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 px-2 py-0.5 rounded-full text-xs">
                {data.assigned.length}
              </span>
            </h3>
          </div>
          <div className="p-4 flex-1 overflow-y-auto space-y-4">
            {data.assigned.map(trip => <TripCard key={trip.id} trip={trip} type="assigned" />)}
            {data.assigned.length === 0 && <p className="text-sm text-surface-500 text-center py-4">No assigned trips</p>}
          </div>
        </div>

        {/* Active Column */}
        <div className="flex flex-col bg-surface-50 dark:bg-surface-900/50 rounded-xl border border-surface-200 dark:border-surface-800 h-full">
          <div className="p-4 border-b border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 rounded-t-xl">
            <h3 className="font-semibold text-surface-900 dark:text-white flex justify-between">
              Active / In Progress 
              <span className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full text-xs">
                {data.active.length}
              </span>
            </h3>
          </div>
          <div className="p-4 flex-1 overflow-y-auto space-y-4">
            {data.active.map(trip => <TripCard key={trip.id} trip={trip} type="active" />)}
            {data.active.length === 0 && <p className="text-sm text-surface-500 text-center py-4">No active trips</p>}
          </div>
        </div>

        {/* Completed Column */}
        <div className="flex flex-col bg-surface-50 dark:bg-surface-900/50 rounded-xl border border-surface-200 dark:border-surface-800 h-full">
          <div className="p-4 border-b border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 rounded-t-xl">
            <h3 className="font-semibold text-surface-900 dark:text-white flex justify-between">
              Completed Today 
              <span className="bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 px-2 py-0.5 rounded-full text-xs">
                {data.completed.length}
              </span>
            </h3>
          </div>
          <div className="p-4 flex-1 overflow-y-auto space-y-4 opacity-75">
            {data.completed.map(trip => <TripCard key={trip.id} trip={trip} type="completed" />)}
            {data.completed.length === 0 && <p className="text-sm text-surface-500 text-center py-4">No completed trips today</p>}
          </div>
        </div>

      </div>

      <AssignDriverModal
        isOpen={!!assignDriverTripId}
        tripId={assignDriverTripId}
        onClose={() => setAssignDriverTripId(null)}
      />
      <AssignVehicleModal
        isOpen={!!assignVehicleTripId}
        tripId={assignVehicleTripId}
        onClose={() => setAssignVehicleTripId(null)}
      />
    </>
  );
}

// A mock Play icon since we might need one
function Play(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  )
}
