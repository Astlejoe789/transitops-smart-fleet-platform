import { Truck, CheckCircle, Link2Off, Car } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { useState } from 'react';
import { useAssignVehicle, useUnassignVehicle, useAvailableVehicles } from '../hooks/useDrivers';
import type { Driver } from '../types';

interface DriverAssignmentProps {
  driver: Driver;
}

export function DriverAssignment({ driver }: DriverAssignmentProps) {
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const { data: availableVehicles = [], isLoading: isLoadingVehicles } = useAvailableVehicles();
  const assignMutation = useAssignVehicle(driver.id);
  const unassignMutation = useUnassignVehicle(driver.id);

  const handleAssign = async () => {
    if (!selectedVehicleId) return;
    try {
      await assignMutation.mutateAsync(selectedVehicleId);
      setSelectedVehicleId('');
    } catch (err) {
      console.error('Failed to assign vehicle', err);
    }
  };

  const handleUnassign = async () => {
    try {
      await unassignMutation.mutateAsync();
    } catch (err) {
      console.error('Failed to unassign vehicle', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Assignment */}
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-surface-500">
          Current Assignment
        </h3>

        {driver.assignedVehicle ? (
          <div className="flex items-start justify-between rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950/20">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white shadow-sm dark:bg-surface-800">
                <Truck className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-bold text-surface-900 dark:text-white">
                    {driver.assignedVehicle.plateNumber}
                  </p>
                  <Badge variant="success">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Assigned
                  </Badge>
                </div>
                <p className="text-sm text-surface-500">
                  {driver.assignedVehicle.make} {driver.assignedVehicle.model}
                  {driver.assignedVehicle.year ? ` • ${driver.assignedVehicle.year}` : ''}
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleUnassign}
              isLoading={unassignMutation.isPending}
              className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400"
            >
              <Link2Off className="mr-1.5 h-3.5 w-3.5" />
              Unassign
            </Button>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-surface-300 bg-surface-50 p-6 text-center dark:border-surface-700 dark:bg-surface-800/30">
            <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-surface-100 dark:bg-surface-800">
              <Car className="h-6 w-6 text-surface-400" />
            </div>
            <p className="mt-2 font-medium text-surface-700 dark:text-surface-300">No vehicle assigned</p>
            <p className="mt-1 text-sm text-surface-500">Assign a vehicle to this driver below</p>
          </div>
        )}
      </div>

      {/* Assign Vehicle */}
      {!driver.assignedVehicle && (
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-surface-500">
            Assign a Vehicle
          </h3>
          <div className="flex gap-3">
            <div className="flex-1">
              <Select
                id="assign-vehicle-select"
                value={selectedVehicleId}
                onChange={(e) => setSelectedVehicleId(e.target.value)}
                disabled={isLoadingVehicles}
              >
                <option value="">Select available vehicle...</option>
                {availableVehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.plateNumber} — {v.make} {v.model}
                  </option>
                ))}
              </Select>
            </div>
            <Button
              onClick={handleAssign}
              disabled={!selectedVehicleId}
              isLoading={assignMutation.isPending}
              id="assign-vehicle-btn"
            >
              <Truck className="mr-1.5 h-4 w-4" />
              Assign
            </Button>
          </div>
          {availableVehicles.length === 0 && !isLoadingVehicles && (
            <p className="mt-2 text-xs text-surface-500">
              No available vehicles. All vehicles are currently assigned or in use.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
