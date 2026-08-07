import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface AddVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (vehicleData: any) => Promise<void>;
}

export function AddVehicleModal({ isOpen, onClose, onSave }: AddVehicleModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    plate: '',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    type: 'Truck',
    capacity: 0,
    fuel: 'Diesel',
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
        year: Number(formData.year),
        capacity: Number(formData.capacity),
        status: 'AVAILABLE',
        odometer: 0,
        insurance: new Date().toISOString().split('T')[0] // default placeholder
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
      <Button type="submit" form="add-vehicle-form" isLoading={loading}>Add Vehicle</Button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Vehicle" description="Enter the vehicle details to add it to the fleet." footer={footer}>
      <form id="add-vehicle-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium">License Plate</label>
          <Input name="plate" value={formData.plate} onChange={handleChange} required placeholder="e.g. MH-12-AB-5678" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Make</label>
            <Input name="make" value={formData.make} onChange={handleChange} required placeholder="e.g. Tata" />
          </div>
          <div>
            <label className="text-sm font-medium">Model</label>
            <Input name="model" value={formData.model} onChange={handleChange} required placeholder="e.g. LPT 1613" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Year</label>
            <Input type="number" name="year" value={formData.year} onChange={handleChange} required />
          </div>
          <div>
            <label className="text-sm font-medium">Type</label>
            <select name="type" value={formData.type} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
              <option value="Truck">Truck</option>
              <option value="Pickup">Pickup</option>
              <option value="Mini Truck">Mini Truck</option>
              <option value="Van">Van</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Capacity (Tons)</label>
            <Input type="number" name="capacity" value={formData.capacity} onChange={handleChange} required />
          </div>
          <div>
            <label className="text-sm font-medium">Fuel Type</label>
            <select name="fuel" value={formData.fuel} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
              <option value="Diesel">Diesel</option>
              <option value="Petrol">Petrol</option>
              <option value="CNG">CNG</option>
              <option value="Electric">Electric</option>
            </select>
          </div>
        </div>
      </form>
    </Modal>
  );
}
