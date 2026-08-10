import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface AddDriverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (driverData: any) => Promise<void>;
}

const SELECT_CLS = 'flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';
const LABEL_CLS = 'text-sm font-medium mb-1 block';

export function AddDriverModal({ isOpen, onClose, onSave }: AddDriverModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    employeeId: '',
    licenseNumber: '',
    licenseCategory: 'B' as string,
    licenseExpiry: '',
    licenseIssuedDate: '',
    safetyScore: '100',
    status: 'AVAILABLE' as string,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!formData.licenseExpiry) {
      setError('License expiry date is required.');
      return;
    }
    setLoading(true);
    try {
      await onSave({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        employeeId: formData.employeeId.trim(),
        licenseNumber: formData.licenseNumber.trim(),
        licenseCategory: formData.licenseCategory,
        licenseExpiry: new Date(formData.licenseExpiry).toISOString(),
        licenseIssuedDate: formData.licenseIssuedDate ? new Date(formData.licenseIssuedDate).toISOString() : null,
        status: formData.status,
      });
      onClose();
      setFormData({
        firstName: '', lastName: '', email: '', phone: '', employeeId: '',
        licenseNumber: '', licenseCategory: 'B', licenseExpiry: '', licenseIssuedDate: '',
        safetyScore: '100', status: 'AVAILABLE',
      });
    } catch (err: any) {
      setError(err?.message ?? 'Failed to add driver. Check all fields and try again.');
    } finally {
      setLoading(false);
    }
  };

  const footer = (
    <>
      <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
      <Button type="submit" form="add-driver-form" isLoading={loading}>Add Driver</Button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Driver" description="Enter the driver's details to register them in the system." footer={footer}>
      <form id="add-driver-form" onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Name */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={LABEL_CLS}>First Name *</label>
            <Input name="firstName" value={formData.firstName} onChange={handleChange} required placeholder="e.g. John" />
          </div>
          <div>
            <label className={LABEL_CLS}>Last Name *</label>
            <Input name="lastName" value={formData.lastName} onChange={handleChange} required placeholder="e.g. Doe" />
          </div>
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={LABEL_CLS}>Email *</label>
            <Input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="e.g. john@example.com" />
          </div>
          <div>
            <label className={LABEL_CLS}>Contact Number *</label>
            <Input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="e.g. +91 9876543210" />
          </div>
        </div>

        {/* Employee ID */}
        <div>
          <label className={LABEL_CLS}>Employee ID *</label>
          <Input name="employeeId" value={formData.employeeId} onChange={handleChange} required placeholder="e.g. EMP-001" />
        </div>

        {/* License */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={LABEL_CLS}>License Number *</label>
            <Input name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} required placeholder="e.g. DL-123456789" />
          </div>
          <div>
            <label className={LABEL_CLS}>License Category *</label>
            <select name="licenseCategory" value={formData.licenseCategory} onChange={handleChange} className={SELECT_CLS}>
              <option value="A">A — Motorcycle</option>
              <option value="B">B — Light Vehicle</option>
              <option value="C">C — Medium Truck</option>
              <option value="D">D — Bus</option>
              <option value="E">E — Heavy Truck / Articulated</option>
              <option value="EB">EB — Heavy Truck + Bus</option>
              <option value="EC">EC — Heavy Articulated</option>
            </select>
          </div>
        </div>

        {/* License Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={LABEL_CLS}>License Issue Date</label>
            <Input type="date" name="licenseIssuedDate" value={formData.licenseIssuedDate} onChange={handleChange} />
          </div>
          <div>
            <label className={LABEL_CLS}>License Expiry Date *</label>
            <Input type="date" name="licenseExpiry" value={formData.licenseExpiry} onChange={handleChange} required />
          </div>
        </div>

        {/* Safety Score & Status */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={LABEL_CLS}>Safety Score (0–100)</label>
            <Input type="number" name="safetyScore" value={formData.safetyScore} onChange={handleChange} min={0} max={100} placeholder="100" />
          </div>
          <div>
            <label className={LABEL_CLS}>Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className={SELECT_CLS}>
              <option value="AVAILABLE">Available</option>
              <option value="OFF_DUTY">Off Duty</option>
            </select>
          </div>
        </div>
      </form>
    </Modal>
  );
}
