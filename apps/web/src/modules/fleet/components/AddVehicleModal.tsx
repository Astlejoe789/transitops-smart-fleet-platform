import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface AddVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (vehicleData: any) => Promise<void>;
}

const SELECT_CLS = 'flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';
const LABEL_CLS = 'text-sm font-medium mb-1 block';

export function AddVehicleModal({ isOpen, onClose, onSave }: AddVehicleModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    plateNumber: '',
    vin: '',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    type: 'TRUCK' as string,
    fuelType: 'DIESEL' as string,
    payloadCapacity: '' as string | number,
    currentOdometer: 0,
    purchaseDate: '',
    insuranceExpiry: '',
    acquisitionCost: '' as string | number,
    color: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onSave({
        plateNumber: formData.plateNumber.trim().toUpperCase(),
        vin: formData.vin.trim().toUpperCase(),
        make: formData.make.trim(),
        model: formData.model.trim(),
        year: Number(formData.year),
        type: formData.type,
        fuelType: formData.fuelType,
        payloadCapacity: formData.payloadCapacity !== '' ? Number(formData.payloadCapacity) : null,
        currentOdometer: Number(formData.currentOdometer),
        purchaseDate: formData.purchaseDate ? new Date(formData.purchaseDate).toISOString() : null,
        insuranceExpiry: formData.insuranceExpiry ? new Date(formData.insuranceExpiry).toISOString() : null,
        color: formData.color || null,
        status: 'AVAILABLE',
      });
      onClose();
      setFormData({
        plateNumber: '', vin: '', make: '', model: '',
        year: new Date().getFullYear(), type: 'TRUCK', fuelType: 'DIESEL',
        payloadCapacity: '', currentOdometer: 0, purchaseDate: '', insuranceExpiry: '', acquisitionCost: '', color: '',
      });
    } catch (err: any) {
      setError(err?.message ?? 'Failed to add vehicle. Check all fields and try again.');
    } finally {
      setLoading(false);
    }
  };

  const footer = (
    <>
      <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
      <Button type="submit" form="add-vehicle-form" isLoading={loading}>Add Vehicle</Button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Register New Vehicle" description="Enter the vehicle details to add it to the fleet." footer={footer}>
      <form id="add-vehicle-form" onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Registration & VIN */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={LABEL_CLS}>Registration / Plate Number *</label>
            <Input name="plateNumber" value={formData.plateNumber} onChange={handleChange} required placeholder="e.g. MH-12-AB-5678" />
          </div>
          <div>
            <label className={LABEL_CLS}>VIN *</label>
            <Input name="vin" value={formData.vin} onChange={handleChange} required placeholder="e.g. 1HGCM82633A004352" />
          </div>
        </div>

        {/* Make & Model */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={LABEL_CLS}>Make *</label>
            <Input name="make" value={formData.make} onChange={handleChange} required placeholder="e.g. Tata" />
          </div>
          <div>
            <label className={LABEL_CLS}>Model *</label>
            <Input name="model" value={formData.model} onChange={handleChange} required placeholder="e.g. LPT 1613" />
          </div>
        </div>

        {/* Year & Color */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={LABEL_CLS}>Year *</label>
            <Input type="number" name="year" value={formData.year} onChange={handleChange} required min={1980} max={new Date().getFullYear() + 1} />
          </div>
          <div>
            <label className={LABEL_CLS}>Color</label>
            <Input name="color" value={formData.color} onChange={handleChange} placeholder="e.g. White" />
          </div>
        </div>

        {/* Type & Fuel */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={LABEL_CLS}>Vehicle Type *</label>
            <select name="type" value={formData.type} onChange={handleChange} className={SELECT_CLS}>
              <option value="TRUCK">Truck</option>
              <option value="VAN">Van</option>
              <option value="PICKUP">Pickup</option>
              <option value="MINI_TRUCK">Mini Truck</option>
              <option value="BUS">Bus</option>
              <option value="TANKER">Tanker</option>
              <option value="TRAILER">Trailer</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          <div>
            <label className={LABEL_CLS}>Fuel Type *</label>
            <select name="fuelType" value={formData.fuelType} onChange={handleChange} className={SELECT_CLS}>
              <option value="DIESEL">Diesel</option>
              <option value="PETROL">Petrol</option>
              <option value="CNG">CNG</option>
              <option value="ELECTRIC">Electric</option>
              <option value="HYBRID">Hybrid</option>
            </select>
          </div>
        </div>

        {/* Max Load Capacity & Odometer */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={LABEL_CLS}>Max Load Capacity (kg)</label>
            <Input type="number" name="payloadCapacity" value={formData.payloadCapacity} onChange={handleChange} placeholder="e.g. 5000" min={0} />
          </div>
          <div>
            <label className={LABEL_CLS}>Current Odometer (km)</label>
            <Input type="number" name="currentOdometer" value={formData.currentOdometer} onChange={handleChange} min={0} />
          </div>
        </div>

        {/* Insurance Expiry & Purchase Date */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={LABEL_CLS}>Insurance Expiry</label>
            <Input type="date" name="insuranceExpiry" value={formData.insuranceExpiry} onChange={handleChange} />
          </div>
          <div>
            <label className={LABEL_CLS}>Purchase Date</label>
            <Input type="date" name="purchaseDate" value={formData.purchaseDate} onChange={handleChange} />
          </div>
        </div>
      </form>
    </Modal>
  );
}
