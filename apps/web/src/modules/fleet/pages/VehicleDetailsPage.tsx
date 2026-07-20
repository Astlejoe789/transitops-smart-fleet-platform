import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Truck, Activity, Wrench, Fuel, FileText, Clock, File } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useVehicle } from '../hooks/useFleet';
import { DocumentList } from '../components/DocumentList';
import { format } from 'date-fns';

export default function VehicleDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: vehicle, isLoading } = useVehicle(id || '');
  const [activeTab, setActiveTab] = useState('overview');

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="flex h-64 flex-col items-center justify-center space-y-4">
        <h2 className="text-xl font-semibold">Vehicle not found</h2>
        <Button onClick={() => navigate('/fleet')} variant="outline">
          Back to Fleet
        </Button>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'documents', label: 'Documents', icon: File },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench },
    { id: 'fuel', label: 'Fuel Logs', icon: Fuel },
    { id: 'trips', label: 'Trip History', icon: Truck },
    { id: 'expenses', label: 'Expenses', icon: FileText },
    { id: 'timeline', label: 'Timeline', icon: Clock },
  ];

  return (
    <div className="mx-auto max-w-7xl pb-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/fleet')} className="-ml-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold tracking-tight text-surface-900 dark:text-white">
                {vehicle.plateNumber}
              </h1>
              <Badge variant={vehicle.status === 'AVAILABLE' ? 'success' : 'secondary'}>
                {vehicle.status.replace('_', ' ')}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-surface-500">
              {vehicle.year} {vehicle.make} {vehicle.model} • VIN: {vehicle.vin}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 overflow-x-auto border-b border-surface-200 dark:border-surface-800">
        <div className="flex w-max space-x-6 px-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 border-b-2 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-surface-500 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-100'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="rounded-xl border border-surface-200 bg-white p-6 shadow-sm dark:border-surface-800 dark:bg-surface-900">
        {activeTab === 'overview' && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1">
              <span className="text-xs text-surface-500">Vehicle Type</span>
              <p className="font-medium text-surface-900 dark:text-white">{vehicle.type}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-surface-500">Fuel Type</span>
              <p className="font-medium text-surface-900 dark:text-white">{vehicle.fuelType}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-surface-500">Color</span>
              <p className="font-medium text-surface-900 dark:text-white">{vehicle.color || '-'}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-surface-500">Current Odometer</span>
              <p className="font-medium text-surface-900 dark:text-white">{vehicle.currentOdometer.toLocaleString()} km</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-surface-500">Purchase Date</span>
              <p className="font-medium text-surface-900 dark:text-white">
                {vehicle.purchaseDate ? format(new Date(vehicle.purchaseDate), 'MMM dd, yyyy') : '-'}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-surface-500">Insurance Expiry</span>
              <p className="font-medium text-surface-900 dark:text-white">
                {vehicle.insuranceExpiry ? format(new Date(vehicle.insuranceExpiry), 'MMM dd, yyyy') : '-'}
              </p>
            </div>
          </div>
        )}

        {activeTab === 'documents' && <DocumentList vehicleId={vehicle.id} />}

        {['maintenance', 'fuel', 'trips', 'expenses', 'timeline'].includes(activeTab) && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <h4 className="mb-2 text-lg font-medium text-surface-900 dark:text-white">Module Coming Soon</h4>
            <p className="max-w-sm text-sm text-surface-500">
              The {tabs.find((t) => t.id === activeTab)?.label} module is currently under development.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
