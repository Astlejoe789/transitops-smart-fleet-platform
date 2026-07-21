import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, Wrench, CheckCircle, Package, FileText, 
  Clock, Activity, AlertCircle, Edit2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useMaintenanceDetails, useUpdateMaintenanceStatus } from '../hooks/useMaintenance';
import { ChecklistManager } from '../components/ChecklistManager';
import { PartsList } from '../components/PartsList';
import { DocumentUploader } from '../components/DocumentUploader';
import { MaintenanceFormModal } from '../components/MaintenanceFormModal';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import type { MaintenanceStatus } from '../types';

export default function MaintenanceDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { data: maintenance, isLoading } = useMaintenanceDetails(id || null);
  const updateStatusMutation = useUpdateMaintenanceStatus(id || null);

  if (isLoading) {
    return <div className="p-8 text-center">Loading maintenance details...</div>;
  }

  if (!maintenance) {
    return <div className="p-8 text-center">Maintenance log not found.</div>;
  }

  const handleStatusChange = (status: MaintenanceStatus) => {
    updateStatusMutation.mutate({ status });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
      case 'VERIFIED': return 'success';
      case 'IN_PROGRESS': return 'default';
      case 'WAITING_FOR_PARTS': return 'warning';
      case 'CANCELLED': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="flex flex-col h-full bg-surface-50 dark:bg-surface-950 overflow-auto">
      {/* Header Info */}
      <div className="bg-white dark:bg-surface-900 border-b border-surface-200 dark:border-surface-800">
        <div className="px-8 py-6">
          <div className="flex items-center gap-4 mb-6">
            <Link to="/maintenance">
              <Button variant="ghost" size="sm" className="-ml-3 text-surface-500">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Maintenance
              </Button>
            </Link>
          </div>

          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-surface-900 dark:text-white">
                  {maintenance.maintenanceId}
                </h1>
                <Badge variant={getStatusBadge(maintenance.status)}>
                  {maintenance.status.replace(/_/g, ' ')}
                </Badge>
                <Badge variant={maintenance.priority === 'CRITICAL' || maintenance.priority === 'HIGH' ? 'destructive' : 'outline'}>
                  {maintenance.priority} Priority
                </Badge>
              </div>
              <p className="text-lg text-surface-600 dark:text-surface-400 font-medium">
                {maintenance.vehicle?.plateNumber} - {maintenance.vehicle?.make} {maintenance.vehicle?.model}
              </p>
              <p className="text-sm text-surface-500 mt-1">
                {maintenance.description}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => setIsEditModalOpen(true)}>
                <Edit2 className="w-4 h-4 mr-2" />
                Edit
              </Button>
              
              {maintenance.status === 'SCHEDULED' && (
                <Button onClick={() => handleStatusChange('IN_PROGRESS')} isLoading={updateStatusMutation.isPending}>
                  <Wrench className="w-4 h-4 mr-2" />
                  Start Service
                </Button>
              )}
              
              {maintenance.status === 'IN_PROGRESS' && (
                <Button variant="outline" onClick={() => handleStatusChange('WAITING_FOR_PARTS')} isLoading={updateStatusMutation.isPending}>
                  <AlertCircle className="w-4 h-4 mr-2 text-warning-500" />
                  Wait for Parts
                </Button>
              )}
              
              {maintenance.status === 'WAITING_FOR_PARTS' && (
                <Button onClick={() => handleStatusChange('IN_PROGRESS')} isLoading={updateStatusMutation.isPending}>
                  <Wrench className="w-4 h-4 mr-2" />
                  Resume Service
                </Button>
              )}
              
              {maintenance.status === 'IN_PROGRESS' && (
                <Button variant="default" className="bg-success-600 hover:bg-success-700" onClick={() => handleStatusChange('COMPLETED')} isLoading={updateStatusMutation.isPending}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark Completed
                </Button>
              )}

              {maintenance.status === 'COMPLETED' && (
                <Button variant="default" className="bg-primary-600 hover:bg-primary-700" onClick={() => handleStatusChange('VERIFIED')} isLoading={updateStatusMutation.isPending}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Verify & Close
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="px-8 flex gap-6 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: Activity },
            { id: 'checklist', label: 'Service Checklist', icon: CheckCircle },
            { id: 'parts', label: 'Parts Used', icon: Package },
            { id: 'documents', label: 'Documents', icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  isActive
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-surface-500 hover:text-surface-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 p-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <div className="bg-white dark:bg-surface-900 rounded-xl shadow-sm border border-surface-200 dark:border-surface-800 p-6">
                  <h3 className="text-lg font-medium text-surface-900 dark:text-white mb-4">Service Details</h3>
                  <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                    <div>
                      <p className="text-sm text-surface-500">Maintenance Type</p>
                      <p className="font-medium text-surface-900 dark:text-white mt-1">
                        {maintenance.maintenanceType.replace(/_/g, ' ')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-surface-500">Technician / Vendor</p>
                      <p className="font-medium text-surface-900 dark:text-white mt-1">
                        {maintenance.assignedTechnician ? 
                          `${maintenance.assignedTechnician.firstName} ${maintenance.assignedTechnician.lastName}` : 
                          maintenance.vendor?.name || 'Unassigned'
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-surface-500">Odometer Reading</p>
                      <p className="font-medium text-surface-900 dark:text-white mt-1">
                        {maintenance.odometerReading ? `${maintenance.odometerReading.toLocaleString()} km` : 'Not recorded'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-surface-500">Warranty Status</p>
                      <p className="font-medium text-surface-900 dark:text-white mt-1">
                        {maintenance.warrantyStatus || 'N/A'}
                      </p>
                    </div>
                  </div>
                  
                  {maintenance.notes && (
                    <div className="mt-6 pt-6 border-t border-surface-100 dark:border-surface-800">
                      <p className="text-sm text-surface-500 mb-2">Notes</p>
                      <p className="text-sm text-surface-800 dark:text-surface-200 whitespace-pre-wrap">
                        {maintenance.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white dark:bg-surface-900 rounded-xl shadow-sm border border-surface-200 dark:border-surface-800 p-6">
                  <h3 className="text-lg font-medium text-surface-900 dark:text-white mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-surface-400" />
                    Timeline
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-surface-500">Created</span>
                      <span className="text-sm font-medium">{format(new Date(maintenance.createdAt), 'MMM d, yyyy')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-surface-500">Scheduled</span>
                      <span className="text-sm font-medium">{format(new Date(maintenance.scheduledDate), 'MMM d, yyyy')}</span>
                    </div>
                    {maintenance.startDate && (
                      <div className="flex justify-between">
                        <span className="text-sm text-surface-500">Started</span>
                        <span className="text-sm font-medium">{format(new Date(maintenance.startDate), 'MMM d, yyyy')}</span>
                      </div>
                    )}
                    {maintenance.completedDate && (
                      <div className="flex justify-between">
                        <span className="text-sm text-surface-500">Completed</span>
                        <span className="text-sm font-medium text-success-600">{format(new Date(maintenance.completedDate), 'MMM d, yyyy')}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white dark:bg-surface-900 rounded-xl shadow-sm border border-surface-200 dark:border-surface-800 p-6">
                  <h3 className="text-lg font-medium text-surface-900 dark:text-white mb-4">Cost Summary</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-4 border-b border-surface-100 dark:border-surface-800">
                      <span className="text-sm text-surface-500">Estimated Cost</span>
                      <span className="text-sm font-medium">{formatCurrency(maintenance.estimatedCost)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-surface-900 dark:text-white">Actual Total Cost</span>
                      <span className="text-lg font-bold text-surface-900 dark:text-white">
                        {formatCurrency(maintenance.actualCost)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: CHECKLIST */}
          {activeTab === 'checklist' && (
            <div className="bg-white dark:bg-surface-900 rounded-xl shadow-sm border border-surface-200 dark:border-surface-800 p-6">
              <ChecklistManager maintenance={maintenance} />
            </div>
          )}

          {/* TAB: PARTS */}
          {activeTab === 'parts' && (
            <div className="bg-white dark:bg-surface-900 rounded-xl shadow-sm border border-surface-200 dark:border-surface-800 p-6">
              <PartsList maintenance={maintenance} />
            </div>
          )}

          {/* TAB: DOCUMENTS */}
          {activeTab === 'documents' && (
            <div className="bg-white dark:bg-surface-900 rounded-xl shadow-sm border border-surface-200 dark:border-surface-800 p-6">
              <DocumentUploader maintenance={maintenance} />
            </div>
          )}
        </div>
      </div>

      <MaintenanceFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        editData={maintenance}
      />
    </div>
  );
}
