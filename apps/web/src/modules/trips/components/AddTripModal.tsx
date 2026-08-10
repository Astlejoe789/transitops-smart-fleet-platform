import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { AlertTriangle, Truck, User } from 'lucide-react';
import { getAvailableVehicles, getAvailableDrivers, type AvailableVehicle, type AvailableDriver } from '@/api/trips.api';

interface AddTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tripData: any) => Promise<void>;
}

const SELECT_CLS = 'flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50';
const LABEL_CLS = 'text-sm font-medium mb-1 block';

export function AddTripModal({ isOpen, onClose, onSave }: AddTripModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [vehicles, setVehicles] = useState<AvailableVehicle[]>([]);
  const [drivers, setDrivers] = useState<AvailableDriver[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<AvailableVehicle | null>(null);
  const [cargoWeightWarning, setCargoWeightWarning] = useState('');

  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    vehicleId: '',
    driverId: '',
    cargoWeight: '' as string | number,
    cargoDescription: '',
    estimatedDistance: '' as string | number,
    scheduledStart: new Date().toISOString().slice(0, 16),
    scheduledEnd: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
    priority: 'MEDIUM',
    notes: '',
  });

  useEffect(() => {
    if (isOpen) {
      getAvailableVehicles().then(setVehicles);
      getAvailableDrivers().then(setDrivers);
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'vehicleId') {
      const v = vehicles.find(vh => vh.id === value) ?? null;
      setSelectedVehicle(v);
      setCargoWeightWarning('');
    }

    if (name === 'cargoWeight' && selectedVehicle?.payloadCapacity) {
      const w = Number(value);
      if (w > selectedVehicle.payloadCapacity) {
        setCargoWeightWarning(
          `⚠ Cargo weight (${w} kg) exceeds vehicle capacity (${selectedVehicle.payloadCapacity} kg). Dispatch will be blocked.`
        );
      } else {
        setCargoWeightWarning('');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Client-side cargo weight validation
    if (formData.cargoWeight && selectedVehicle?.payloadCapacity) {
      const w = Number(formData.cargoWeight);
      if (w > selectedVehicle.payloadCapacity) {
        setError(`Cargo weight (${w} kg) exceeds vehicle maximum load capacity (${selectedVehicle.payloadCapacity} kg)`);
        return;
      }
    }

    setLoading(true);
    try {
      await onSave({
        origin: formData.origin.trim(),
        destination: formData.destination.trim(),
        vehicleId: formData.vehicleId || undefined,
        driverId: formData.driverId || undefined,
        cargoWeight: formData.cargoWeight !== '' ? Number(formData.cargoWeight) : undefined,
        cargoDescription: formData.cargoDescription || undefined,
        estimatedDistance: formData.estimatedDistance !== '' ? Number(formData.estimatedDistance) : undefined,
        scheduledStart: new Date(formData.scheduledStart).toISOString(),
        scheduledEnd: new Date(formData.scheduledEnd).toISOString(),
        priority: formData.priority,
        notes: formData.notes || undefined,
      });
      onClose();
      setFormData({
        origin: '', destination: '', vehicleId: '', driverId: '',
        cargoWeight: '', cargoDescription: '', estimatedDistance: '',
        scheduledStart: new Date().toISOString().slice(0, 16),
        scheduledEnd: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
        priority: 'MEDIUM', notes: '',
      });
      setSelectedVehicle(null);
      setCargoWeightWarning('');
    } catch (err: any) {
      setError(err?.message ?? 'Failed to create trip. Please check all fields.');
    } finally {
      setLoading(false);
    }
  };

  const footer = (
    <>
      <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
      <Button type="submit" form="add-trip-form" isLoading={loading}>Create Trip</Button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Trip" description="Fill in the route, assign a vehicle and driver, and set cargo details." footer={footer}>
      <form id="add-trip-form" onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm text-destructive">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
            {error}
          </div>
        )}

        {/* Route */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={LABEL_CLS}>Origin / Source *</label>
            <Input name="origin" value={formData.origin} onChange={handleChange} required placeholder="e.g. Mumbai" />
          </div>
          <div>
            <label className={LABEL_CLS}>Destination *</label>
            <Input name="destination" value={formData.destination} onChange={handleChange} required placeholder="e.g. Delhi" />
          </div>
        </div>

        {/* Vehicle Selection */}
        <div>
          <label className={LABEL_CLS}>
            <Truck className="inline h-3.5 w-3.5 mr-1" />
            Vehicle (Available Only)
          </label>
          <select name="vehicleId" value={formData.vehicleId} onChange={handleChange} className={SELECT_CLS}>
            <option value="">— Select Available Vehicle —</option>
            {vehicles.map(v => (
              <option key={v.id} value={v.id}>
                {v.plateNumber} — {v.make} {v.model} ({v.year})
                {v.payloadCapacity ? ` · Max ${v.payloadCapacity} kg` : ''}
              </option>
            ))}
          </select>
          {vehicles.length === 0 && <p className="text-xs text-muted-foreground mt-1">No available vehicles at this time.</p>}
          {selectedVehicle?.payloadCapacity && (
            <p className="text-xs text-muted-foreground mt-1">
              Max load capacity: <strong>{selectedVehicle.payloadCapacity} kg</strong>
            </p>
          )}
        </div>

        {/* Driver Selection */}
        <div>
          <label className={LABEL_CLS}>
            <User className="inline h-3.5 w-3.5 mr-1" />
            Driver (Available + Valid License Only)
          </label>
          <select name="driverId" value={formData.driverId} onChange={handleChange} className={SELECT_CLS}>
            <option value="">— Select Available Driver —</option>
            {drivers.map(d => (
              <option key={d.id} value={d.id}>
                {d.user.firstName} {d.user.lastName} · {d.licenseCategory}
              </option>
            ))}
          </select>
          {drivers.length === 0 && <p className="text-xs text-muted-foreground mt-1">No available drivers with valid licenses.</p>}
        </div>

        {/* Cargo */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={LABEL_CLS}>Cargo Weight (kg)</label>
            <Input
              type="number"
              name="cargoWeight"
              value={formData.cargoWeight}
              onChange={handleChange}
              placeholder="e.g. 450"
              min={0}
            />
            {cargoWeightWarning && (
              <p className="text-xs text-warning mt-1 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                {cargoWeightWarning}
              </p>
            )}
          </div>
          <div>
            <label className={LABEL_CLS}>Planned Distance (km)</label>
            <Input type="number" name="estimatedDistance" value={formData.estimatedDistance} onChange={handleChange} placeholder="e.g. 800" min={0} />
          </div>
        </div>

        {/* Cargo Description */}
        <div>
          <label className={LABEL_CLS}>Cargo Description</label>
          <Input name="cargoDescription" value={formData.cargoDescription} onChange={handleChange} placeholder="e.g. Electronic equipment" />
        </div>

        {/* Schedule */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={LABEL_CLS}>Scheduled Start *</label>
            <Input type="datetime-local" name="scheduledStart" value={formData.scheduledStart} onChange={handleChange} required />
          </div>
          <div>
            <label className={LABEL_CLS}>Scheduled End *</label>
            <Input type="datetime-local" name="scheduledEnd" value={formData.scheduledEnd} onChange={handleChange} required />
          </div>
        </div>

        {/* Priority */}
        <div>
          <label className={LABEL_CLS}>Priority</label>
          <select name="priority" value={formData.priority} onChange={handleChange} className={SELECT_CLS}>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
        </div>
      </form>
    </Modal>
  );
}
