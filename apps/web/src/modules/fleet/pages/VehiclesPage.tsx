import { useState, useEffect, useRef } from 'react';
import { Truck, Plus, Search, AlertTriangle, MoreHorizontal, Download, Ban, Power } from 'lucide-react';
import { getVehicles, addVehicle, updateVehicle, type Vehicle } from '@/api/vehicles.api';
import { AddVehicleModal } from '../components/AddVehicleModal';
import { useToast } from '@/components/ui/Toast';

const STATUS: Record<string, { label: string; color: string; bg: string }> = {
  AVAILABLE:         { label: 'Available',    color: '#10B981', bg: 'hsl(160 40% 10%)' },
  IN_TRANSIT:        { label: 'On Trip',      color: '#1a8fff', bg: 'hsl(211 50% 12%)' },
  UNDER_MAINTENANCE: { label: 'In Shop',      color: '#F59E0B', bg: 'hsl(38 50% 10%)' },
  OUT_OF_SERVICE:    { label: 'Out of Service',color: '#ef4444', bg: 'hsl(0 40% 12%)' },
  DECOMMISSIONED:    { label: 'Retired',      color: '#64748b', bg: 'hsl(222 47% 12%)' },
};

function VehicleActionMenu({ vehicle, onStatusChange }: { vehicle: Vehicle; onStatusChange: (id: string, status: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const status = vehicle.status;

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const canRetire = status !== 'DECOMMISSIONED' && status !== 'IN_TRANSIT' && status !== 'UNDER_MAINTENANCE';
  const canActivate = status === 'DECOMMISSIONED' || status === 'OUT_OF_SERVICE';

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(p => !p)}
        className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors opacity-0 group-hover:opacity-100"
        title="Vehicle actions"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-1 w-44 rounded-lg border border-border bg-card shadow-lg py-1 text-sm">
          {canActivate && (
            <button
              className="flex w-full items-center gap-2 px-4 py-2 text-left hover:bg-accent text-green-400"
              onClick={() => { onStatusChange(vehicle.id, 'AVAILABLE'); setOpen(false); }}
            >
              <Power className="h-3.5 w-3.5" /> Restore to Active
            </button>
          )}
          {canRetire && (
            <button
              className="flex w-full items-center gap-2 px-4 py-2 text-left hover:bg-accent text-red-400"
              onClick={() => { onStatusChange(vehicle.id, 'DECOMMISSIONED'); setOpen(false); }}
            >
              <Ban className="h-3.5 w-3.5" /> Retire Vehicle
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function VehiclesPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { success, error: toastError } = useToast();

  useEffect(() => { fetchVehicles(); }, []);

  const fetchVehicles = async () => {
    const data = await getVehicles();
    setVehicles(data);
  };

  const handleAddVehicle = async (vehicleData: Partial<Vehicle>) => {
    try {
      const newVehicle = await addVehicle(vehicleData);
      if (newVehicle) {
        setVehicles(prev => [newVehicle, ...prev]);
        success('Vehicle registered', 'The vehicle has been added to the fleet.');
      }
    } catch (err: any) {
      toastError('Registration failed', err?.message ?? 'Could not add vehicle.');
      throw err;
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateVehicle(id, { status } as any);
      setVehicles(prev => prev.map(v => v.id === id ? { ...v, status } : v));
      const msgs: Record<string, string> = { AVAILABLE: 'Vehicle restored to active.', DECOMMISSIONED: 'Vehicle has been retired.' };
      success('Status updated', msgs[status] ?? 'Vehicle status updated.');
    } catch (err: any) {
      toastError('Action failed', err?.message ?? 'Could not update vehicle.');
    }
  };

  const counts = vehicles.reduce((acc, v) => { acc[v.status] = (acc[v.status] || 0) + 1; return acc; }, {} as Record<string, number>);

  const filtered = vehicles.filter(v =>
    ((v.plate ?? v.plateNumber ?? '').toLowerCase().includes(search.toLowerCase()) ||
     v.make.toLowerCase().includes(search.toLowerCase()) ||
     v.model.toLowerCase().includes(search.toLowerCase())) &&
    (statusFilter === 'ALL' || v.status === statusFilter)
  );

  const expiringSoon = (d?: string) => !!d && (new Date(d).getTime() - Date.now()) < 90 * 86400000;

  const exportCSV = () => {
    const headers = ['Plate', 'Make', 'Model', 'Year', 'Type', 'Status', 'Odometer (km)', 'Max Load (kg)', 'Fuel', 'Insurance Exp.'];
    const rows = filtered.map(v => [
      v.plate ?? v.plateNumber, v.make, v.model, v.year, v.type, v.status,
      v.odometer ?? v.currentOdometer ?? 0, v.capacity ?? v.payloadCapacity ?? 0, v.fuel ?? v.fuelType, v.insurance ?? v.insuranceExpiry ?? '',
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'vehicles.csv'; a.click();
  };

  return (
    <div className="space-y-5 pb-8">
      <section className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
        <div>
          <p className="mb-1 text-sm text-muted-foreground">Fleet Management</p>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">Vehicles</h1>
        </div>
        <button onClick={() => setIsAddModalOpen(true)} className="inline-flex items-center gap-2 h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm">
          <Plus className="h-4 w-4" /> Add Vehicle
        </button>
      </section>

      <div className="flex flex-wrap items-center gap-3">
        {[
          { label: 'All', filter: 'ALL' },
          { label: 'Available', filter: 'AVAILABLE' },
          { label: 'On Trip', filter: 'IN_TRANSIT' },
          { label: 'In Shop', filter: 'UNDER_MAINTENANCE' },
          { label: 'Retired', filter: 'DECOMMISSIONED' },
        ].map(c => (
          <button key={c.filter} onClick={() => setStatusFilter(c.filter)}
            className={`h-8 px-3.5 rounded-lg border text-xs font-semibold transition-colors ${
              statusFilter === c.filter
                ? 'border-primary bg-secondary text-primary'
                : 'border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground'
            }`}>
            {c.label}
            <span className="ml-1.5 opacity-60">
              {c.filter === 'ALL' ? vehicles.length : (counts[c.filter] ?? 0)}
            </span>
          </button>
        ))}
        <div className="flex-1" />
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search vehicles..."
            className="h-8 w-[220px] pl-8 pr-3 text-sm bg-muted/50 border border-border rounded-lg outline-none focus:ring-2 focus:ring-ring/30 text-foreground placeholder:text-muted-foreground" />
        </div>
        <button onClick={exportCSV} className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-input bg-card text-xs font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors shadow-sm">
          <Download className="h-3.5 w-3.5" /> Export CSV
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="bg-muted/60 text-[11px] uppercase text-muted-foreground">
              <tr>
                {['Vehicle / Plate', 'Type', 'Status', 'Odometer', 'Max Load', 'Fuel', 'Insurance Exp.', ''].map(h => (
                  <th key={h} className="px-5 py-3 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(v => {
                const s = STATUS[v.status] ?? STATUS.AVAILABLE;
                const plate = v.plate ?? v.plateNumber ?? '—';
                const odometer = v.odometer ?? v.currentOdometer ?? 0;
                const capacity = v.capacity ?? v.payloadCapacity;
                const fuel = v.fuel ?? v.fuelType ?? '—';
                const insurance = v.insurance ?? (v.insuranceExpiry ? new Date(v.insuranceExpiry).toISOString().split('T')[0] : '—');
                const exp = expiringSoon(insurance === '—' ? undefined : insurance);
                return (
                  <tr key={v.id} className="border-t border-border hover:bg-muted/30 transition-colors group">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <span className="grid size-8 place-items-center rounded-lg bg-secondary shrink-0">
                          <Truck className="h-4 w-4 text-muted-foreground" />
                        </span>
                        <div>
                          <p className="font-semibold font-mono">{plate}</p>
                          <p className="text-xs text-muted-foreground">{v.year} {v.make} {v.model}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground text-xs">{v.type}</td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1.5 rounded px-2 py-1 text-xs font-semibold"
                        style={{ color: s.color, background: s.bg }}>
                        <span className="size-1.5 rounded-full" style={{ background: s.color }} />
                        {s.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground font-mono text-xs">{odometer.toLocaleString()} km</td>
                    <td className="px-5 py-3.5 text-muted-foreground text-xs">{capacity ? `${capacity} kg` : '—'}</td>
                    <td className="px-5 py-3.5">
                      <span className="px-2 py-0.5 rounded bg-secondary text-xs font-medium text-secondary-foreground">{fuel}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`flex items-center gap-1 text-xs font-medium ${exp ? 'text-warning' : 'text-muted-foreground'}`}>
                        {exp && <AlertTriangle className="h-3 w-3" />}{insurance}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <VehicleActionMenu vehicle={v} onStatusChange={handleStatusChange} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-16 text-center"><p className="text-muted-foreground text-sm">No vehicles found.</p></div>
        )}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-border text-xs text-muted-foreground">
          <span>{filtered.length} vehicle{filtered.length !== 1 ? 's' : ''}</span>
        </div>
      </div>
      <AddVehicleModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSave={handleAddVehicle} />
    </div>
  );
}
