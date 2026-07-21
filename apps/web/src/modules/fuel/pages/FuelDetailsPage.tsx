import { useParams, useNavigate } from 'react-router-dom';
import { useFuelLog, useDeleteFuelLog } from '../hooks/useFuel';
import { Button } from '@/components/ui/Button';
import { format } from 'date-fns';
import { ArrowLeft, Droplet, Truck, User, MapPin, Receipt, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';

export function FuelDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: log, isLoading } = useFuelLog(id!);
  const { mutate: deleteLog } = useDeleteFuelLog();

  if (isLoading) {
    return <div className="p-8 text-center text-surface-500">Loading details...</div>;
  }

  if (!log) {
    return <div className="p-8 text-center text-surface-500">Fuel log not found</div>;
  }

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this fuel log?')) {
      deleteLog(log.id, { onSuccess: () => navigate('/fuel') });
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/fuel')}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-surface-900 dark:text-white flex items-center gap-3">
              Fuel Log {log.fuelLogNumber}
              <Badge>{log.fuelType}</Badge>
            </h1>
            <p className="mt-1 text-sm text-surface-500">
              Logged on {format(new Date(log.fuelDate), 'PPP')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="w-4 h-4 mr-2" /> Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 md:col-span-2 space-y-6 bg-white shadow-sm border border-surface-200 dark:border-surface-800 dark:bg-surface-900 rounded-xl">
          <h2 className="text-lg font-semibold flex items-center gap-2 border-b pb-4 dark:border-surface-800">
            <Droplet className="w-5 h-5 text-primary-500" /> Fuel Details
          </h2>
          <div className="grid grid-cols-2 gap-y-6 gap-x-8">
            <div>
              <p className="text-sm text-surface-500">Volume</p>
              <p className="text-lg font-medium">{log.liters.toFixed(2)} {log.fuelType === 'ELECTRIC' ? 'kWh' : 'L'}</p>
            </div>
            <div>
              <p className="text-sm text-surface-500">Cost per unit</p>
              <p className="text-lg font-medium">{formatCurrency(log.costPerLiter)}</p>
            </div>
            <div>
              <p className="text-sm text-surface-500">Total Cost</p>
              <p className="text-2xl font-bold text-primary-600">{formatCurrency(log.totalCost)}</p>
            </div>
            <div>
              <p className="text-sm text-surface-500">Fuel Grade</p>
              <p className="text-lg font-medium">{log.fuelGrade || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-surface-500">Odometer Reading</p>
              <p className="text-lg font-medium">{log.odometerReading} km</p>
            </div>
            <div>
              <p className="text-sm text-surface-500">Calculated Efficiency</p>
              <p className="text-lg font-medium">{log.efficiency ? `${log.efficiency.toFixed(2)} km/L` : 'N/A'}</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 bg-white shadow-sm border border-surface-200 dark:border-surface-800 dark:bg-surface-900 rounded-xl">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2 dark:border-surface-800 flex items-center gap-2">
              <Truck className="w-5 h-5 text-surface-400" /> Vehicle
            </h2>
            {log.vehicle ? (
              <div>
                <p className="font-medium text-lg">{log.vehicle.plateNumber}</p>
                <p className="text-sm text-surface-500">{log.vehicle.make} {log.vehicle.model}</p>
              </div>
            ) : (
              <p className="text-surface-500 italic">Unknown Vehicle</p>
            )}
          </div>

          <div className="p-6 bg-white shadow-sm border border-surface-200 dark:border-surface-800 dark:bg-surface-900 rounded-xl">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2 dark:border-surface-800 flex items-center gap-2">
              <User className="w-5 h-5 text-surface-400" /> Driver
            </h2>
            {log.driver ? (
              <div>
                <p className="font-medium text-lg">{log.driver.user?.firstName} {log.driver.user?.lastName}</p>
              </div>
            ) : (
              <p className="text-surface-500 italic">Unknown Driver</p>
            )}
          </div>

          <div className="p-6 bg-white shadow-sm border border-surface-200 dark:border-surface-800 dark:bg-surface-900 rounded-xl">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2 dark:border-surface-800 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-surface-400" /> Location & Payment
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-surface-500">Station</p>
                <p className="font-medium">{log.stationName || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-surface-500">Location</p>
                <p className="font-medium">{log.location || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-surface-500 flex items-center gap-1"><Receipt className="w-4 h-4"/> Payment Method</p>
                <p className="font-medium">{log.paymentMethod.replace('_', ' ')}</p>
                {log.receiptNumber && <p className="text-sm text-surface-500">Receipt: {log.receiptNumber}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
