import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface AddFuelLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (logData: any) => Promise<void>;
}

export function AddFuelLogModal({ isOpen, onClose, onSave }: AddFuelLogModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    vehicleId: '',
    driverId: '',
    gallons: 0,
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
        gallons: Number(formData.gallons),
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
      <Button type="submit" form="add-fuel-form" isLoading={loading}>Add Log</Button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Fuel Log" description="Log a new refueling event." footer={footer}>
      <form id="add-fuel-form" onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Vehicle ID / Plate</label>
            <Input name="vehicleId" value={formData.vehicleId} onChange={handleChange} required placeholder="e.g. MH-12-AB-5678" />
          </div>
          <div>
            <label className="text-sm font-medium">Driver ID</label>
            <Input name="driverId" value={formData.driverId} onChange={handleChange} required placeholder="e.g. EMP-001" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Volume (Gallons/Liters)</label>
            <Input type="number" name="gallons" value={formData.gallons} onChange={handleChange} required />
          </div>
          <div>
            <label className="text-sm font-medium">Total Cost ($)</label>
            <Input type="number" name="cost" value={formData.cost} onChange={handleChange} required />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Date</label>
          <Input type="date" name="date" value={formData.date} onChange={handleChange} required />
        </div>
      </form>
    </Modal>
  );
}
