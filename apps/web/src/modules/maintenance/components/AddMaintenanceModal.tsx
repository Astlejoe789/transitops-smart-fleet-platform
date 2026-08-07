import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface AddMaintenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (logData: any) => Promise<void>;
}

export function AddMaintenanceModal({ isOpen, onClose, onSave }: AddMaintenanceModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    vehicleId: '',
    type: 'Repair',
    description: '',
    cost: 0,
    date: new Date().toISOString().split('T')[0],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave({
        ...formData,
        cost: Number(formData.cost),
      });
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const footer = (
    <>
      <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
      <Button type="submit" form="add-maintenance-form" isLoading={loading}>Log Maintenance</Button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Log Maintenance" description="Add a new service or repair record." footer={footer}>
      <form id="add-maintenance-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium">Vehicle ID / Plate</label>
          <Input name="vehicleId" value={formData.vehicleId} onChange={handleChange} required placeholder="e.g. MH-12-AB-5678" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Type</label>
            <select name="type" value={formData.type} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
              <option value="Repair">Repair</option>
              <option value="Service">Service</option>
              <option value="Inspection">Inspection</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Date</label>
            <Input type="date" name="date" value={formData.date} onChange={handleChange} required />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Description</label>
          <Input name="description" value={formData.description} onChange={handleChange} required placeholder="e.g. Oil change and filter replacement" />
        </div>
        <div>
          <label className="text-sm font-medium">Cost ($)</label>
          <Input type="number" name="cost" value={formData.cost} onChange={handleChange} required />
        </div>
      </form>
    </Modal>
  );
}
