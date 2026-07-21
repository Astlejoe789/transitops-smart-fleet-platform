import { useState, useEffect } from 'react';
import { X, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useCreateMaintenance, useUpdateMaintenance } from '../hooks/useMaintenance';
import { useQuery } from '@tanstack/react-query';
import { apiClient as api } from '@/api/client';
import type { MaintenanceLog } from '../types';

interface MaintenanceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editData: MaintenanceLog | null;
}

export function MaintenanceFormModal({ isOpen, onClose, editData }: MaintenanceFormModalProps) {
  const [formData, setFormData] = useState({
    vehicleId: '',
    vendorId: '',
    assignedTechnicianId: '',
    maintenanceType: 'PREVENTIVE',
    priority: 'MEDIUM',
    description: '',
    estimatedCost: 0,
    scheduledDate: new Date().toISOString().split('T')[0],
    estimatedDuration: 1,
    odometerReading: 0,
    notes: '',
  });

  const { data: vehiclesData } = useQuery({
    queryKey: ['vehicles', 'available'],
    queryFn: async () => {
      const { data } = await api.get('/fleet/vehicles');
      return data.data;
    },
  });

  const createMutation = useCreateMaintenance();
  const updateMutation = useUpdateMaintenance(editData?.id || null);

  useEffect(() => {
    if (editData) {
      setFormData({
        vehicleId: editData.vehicleId,
        vendorId: editData.vendorId || '',
        assignedTechnicianId: editData.assignedTechnicianId || '',
        maintenanceType: editData.maintenanceType,
        priority: editData.priority,
        description: editData.description,
        estimatedCost: editData.estimatedCost || 0,
        scheduledDate: editData.scheduledDate ? new Date(editData.scheduledDate).toISOString().split('T')[0] : '',
        estimatedDuration: editData.estimatedDuration || 1,
        odometerReading: editData.odometerReading || 0,
        notes: editData.notes || '',
      });
    } else {
      setFormData({
        vehicleId: '',
        vendorId: '',
        assignedTechnicianId: '',
        maintenanceType: 'PREVENTIVE',
        priority: 'MEDIUM',
        description: '',
        estimatedCost: 0,
        scheduledDate: new Date().toISOString().split('T')[0],
        estimatedDuration: 1,
        odometerReading: 0,
        notes: '',
      });
    }
  }, [editData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        vendorId: formData.vendorId || undefined,
        assignedTechnicianId: formData.assignedTechnicianId || undefined,
        scheduledDate: new Date(formData.scheduledDate).toISOString(),
      };
      
      if (editData) {
        await updateMutation.mutateAsync(payload);
      } else {
        await createMutation.mutateAsync(payload);
      }
      onClose();
    } catch (error) {
      console.error('Failed to save maintenance log', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-white dark:bg-surface-900 rounded-xl shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-surface-200 dark:border-surface-800">
          <h2 className="text-xl font-semibold text-surface-900 dark:text-white">
            {editData ? 'Edit Maintenance' : 'Schedule Maintenance'}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium text-surface-700 dark:text-surface-300">Vehicle</label>
              <select
                className="w-full h-10 px-3 bg-white dark:bg-surface-950 border border-surface-200 dark:border-surface-800 rounded-md"
                value={formData.vehicleId}
                onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
                required
              >
                <option value="">Select a vehicle...</option>
                {vehiclesData?.map((v: any) => (
                  <option key={v.id} value={v.id}>{v.plateNumber} - {v.make} {v.model}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-surface-700 dark:text-surface-300">Maintenance Type</label>
              <select
                className="w-full h-10 px-3 bg-white dark:bg-surface-950 border border-surface-200 dark:border-surface-800 rounded-md"
                value={formData.maintenanceType}
                onChange={(e) => setFormData({ ...formData, maintenanceType: e.target.value })}
                required
              >
                <option value="PREVENTIVE">Preventive</option>
                <option value="CORRECTIVE">Corrective</option>
                <option value="EMERGENCY">Emergency</option>
                <option value="INSPECTION">Inspection</option>
                <option value="WARRANTY">Warranty</option>
                <option value="SCHEDULED_SERVICE">Scheduled Service</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-surface-700 dark:text-surface-300">Priority</label>
              <select
                className="w-full h-10 px-3 bg-white dark:bg-surface-950 border border-surface-200 dark:border-surface-800 rounded-md"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                required
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>

            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium text-surface-700 dark:text-surface-300">Description</label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="What needs to be done?"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-surface-700 dark:text-surface-300">Scheduled Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" />
                <Input
                  type="date"
                  value={formData.scheduledDate}
                  onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-surface-700 dark:text-surface-300">Estimated Duration (Hrs)</label>
              <Input
                type="number"
                min="1"
                value={formData.estimatedDuration}
                onChange={(e) => setFormData({ ...formData, estimatedDuration: Number(e.target.value) })}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-surface-700 dark:text-surface-300">Estimated Cost ($)</label>
              <Input
                type="number"
                min="0"
                value={formData.estimatedCost}
                onChange={(e) => setFormData({ ...formData, estimatedCost: Number(e.target.value) })}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-surface-700 dark:text-surface-300">Odometer Reading</label>
              <Input
                type="number"
                min="0"
                value={formData.odometerReading}
                onChange={(e) => setFormData({ ...formData, odometerReading: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium text-surface-700 dark:text-surface-300">Notes (Optional)</label>
              <textarea
                className="w-full px-3 py-2 bg-white dark:bg-surface-950 border border-surface-200 dark:border-surface-800 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Any additional details..."
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" isLoading={createMutation.isPending || updateMutation.isPending}>
              {editData ? 'Update Maintenance' : 'Schedule Maintenance'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
