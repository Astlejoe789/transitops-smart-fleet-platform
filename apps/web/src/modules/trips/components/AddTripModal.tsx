import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface AddTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tripData: any) => Promise<void>;
}

export function AddTripModal({ isOpen, onClose, onSave }: AddTripModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    driverId: '',
    vehicleId: '',
    distance: 0,
    startDate: new Date().toISOString().split('T')[0],
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
        distance: Number(formData.distance),
        status: 'PLANNED',
        estimatedArrival: new Date(Date.now() + 86400000).toISOString().split('T')[0] // +1 day mock
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
      <Button type="submit" form="add-trip-form" isLoading={loading}>Create Trip</Button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Trip" description="Enter the trip details to schedule it." footer={footer}>
      <form id="add-trip-form" onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Origin</label>
            <Input name="origin" value={formData.origin} onChange={handleChange} required placeholder="e.g. Mumbai" />
          </div>
          <div>
            <label className="text-sm font-medium">Destination</label>
            <Input name="destination" value={formData.destination} onChange={handleChange} required placeholder="e.g. Delhi" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Driver ID</label>
            <Input name="driverId" value={formData.driverId} onChange={handleChange} required placeholder="e.g. EMP-001" />
          </div>
          <div>
            <label className="text-sm font-medium">Vehicle Plate</label>
            <Input name="vehicleId" value={formData.vehicleId} onChange={handleChange} required placeholder="e.g. MH-12-AB-5678" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Distance (km)</label>
            <Input type="number" name="distance" value={formData.distance} onChange={handleChange} required />
          </div>
          <div>
            <label className="text-sm font-medium">Start Date</label>
            <Input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />
          </div>
        </div>
      </form>
    </Modal>
  );
}
