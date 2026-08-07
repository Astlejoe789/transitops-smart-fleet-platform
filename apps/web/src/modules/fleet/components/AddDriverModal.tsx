import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface AddDriverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (driverData: any) => Promise<void>;
}

export function AddDriverModal({ isOpen, onClose, onSave }: AddDriverModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    licenseNumber: '',
    status: 'ACTIVE',
    phone: '',
    email: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(formData);
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
      <Button type="submit" form="add-driver-form" isLoading={loading}>Add Driver</Button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Driver" description="Enter the driver's details to add them to the fleet." footer={footer}>
      <form id="add-driver-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium">Full Name</label>
          <Input name="name" value={formData.name} onChange={handleChange} required placeholder="e.g. John Doe" />
        </div>
        <div>
          <label className="text-sm font-medium">License Number</label>
          <Input name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} required placeholder="e.g. DL-123456789" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Phone</label>
            <Input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="e.g. +1 555-0123" />
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <Input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="e.g. john@example.com" />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Status</label>
          <select name="status" value={formData.status} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="ON_LEAVE">On Leave</option>
          </select>
        </div>
      </form>
    </Modal>
  );
}
