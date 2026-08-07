import React, { useState } from 'react';
import {
  Truck, Plus, Search, AlertTriangle, MoreHorizontal, Download
} from 'lucide-react';

const STATUS: Record<string, { label: string; color: string; bg: string }> = {
  AVAILABLE: { label: 'Available', color: '#10B981', bg: 'hsl(160 40% 10%)' },
  ON_TRIP:   { label: 'On trip',   color: '#1a8fff', bg: 'hsl(211 50% 12%)' },
  IN_SHOP:   { label: 'In shop',   color: '#F59E0B', bg: 'hsl(38 50% 10%)' },
  RETIRED:   { label: 'Retired',   color: '#64748b', bg: 'hsl(222 47% 12%)' },
};

import { getVehicles, addVehicle, type Vehicle } from '@/api/vehicles.api';
import { AddVehicleModal } from '../components/AddVehicleModal';
const CHIPS = [
  { label: 'All', value: '124', filter: 'ALL' },
  { label: 'Available', value: '78', filter: 'AVAILABLE' },
  { label: 'On Trip', value: '32', filter: 'ON_TRIP' },
  { label: 'In Shop', value: '14', filter: 'IN_SHOP' },
];

export default function VehiclesPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('ALL');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  React.useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    const data = await getVehicles();
    setVehicles(data);
  };

  const handleAddVehicle = async (vehicleData: Partial<Vehicle>) => {
    const newVehicle = await addVehicle(vehicleData);
    if (newVehicle) {
      setVehicles(prev => [...prev, newVehicle]);
    }
  };

  const filtered = vehicles.filter(v =>
    (v.plate.toLowerCase().includes(search.toLowerCase()) ||
     v.make.toLowerCase().includes(search.toLowerCase()) ||
     v.model.toLowerCase().includes(search.toLowerCase())) &&
    (status === 'ALL' || v.status === status)
  );

  const expiringSoon = (d: string) =>
    (new Date(d).getTime() - Date.now()) < 90 * 86400000;

  return (
    <div className="space-y-5 pb-8">
      {/* Header */}
      <section className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
        <div>
          <p className="mb-1 text-sm text-muted-foreground">Fleet Management</p>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">Vehicles</h1>
        </div>
        <button onClick={() => setIsAddModalOpen(true)} className="inline-flex items-center gap-2 h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm">
          <Plus className="h-4 w-4" /> Add vehicle
        </button>
      </section>

      {/* Filter chips + search */}
      <div className="flex flex-wrap items-center gap-3">
        {CHIPS.map(c => (
          <button key={c.filter} onClick={() => setStatus(c.filter)}
            className={`h-8 px-3.5 rounded-lg border text-xs font-semibold transition-colors ${
              status === c.filter
                ? 'border-primary bg-secondary text-primary'
                : 'border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground'
            }`}>
            {c.label} <span className="opacity-60">{c.value}</span>
          </button>
        ))}
        <div className="flex-1" />
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search vehicles..."
            className="h-8 w-[220px] pl-8 pr-3 text-sm bg-muted/50 border border-border rounded-lg outline-none focus:ring-2 focus:ring-ring/30 text-foreground placeholder:text-muted-foreground" />
        </div>
        <button className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-input bg-card text-xs font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors shadow-sm">
          <Download className="h-3.5 w-3.5" /> Export
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="bg-muted/60 text-[11px] uppercase text-muted-foreground">
              <tr>
                {['Vehicle / Plate', 'Type', 'Status', 'Odometer', 'Capacity', 'Fuel', 'Insurance Exp.', ''].map(h => (
                  <th key={h} className="px-5 py-3 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(v => {
                const s = STATUS[v.status];
                const exp = expiringSoon(v.insurance);
                return (
                  <tr key={v.id} className="border-t border-border hover:bg-muted/30 transition-colors group">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <span className="grid size-8 place-items-center rounded-lg bg-secondary shrink-0">
                          <Truck className="h-4 w-4 text-muted-foreground" />
                        </span>
                        <div>
                          <p className="font-semibold font-mono">{v.plate}</p>
                          <p className="text-xs text-muted-foreground">{v.year} {v.make} {v.model}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground">{v.type}</td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1.5 rounded px-2 py-1 text-xs font-semibold"
                        style={{ color: s.color, background: s.bg }}>
                        <span className="size-1.5 rounded-full" style={{ background: s.color }} />
                        {s.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground font-mono">{v.odometer.toLocaleString()} km</td>
                    <td className="px-5 py-3.5 text-muted-foreground">{v.capacity} T</td>
                    <td className="px-5 py-3.5">
                      <span className="px-2 py-0.5 rounded bg-secondary text-xs font-medium text-secondary-foreground">{v.fuel}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`flex items-center gap-1 text-xs font-medium ${exp ? 'text-warning' : 'text-muted-foreground'}`}>
                        {exp && <AlertTriangle className="h-3 w-3" />}{v.insurance}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
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
          <span>{filtered.length} vehicles</span>
          <div className="flex items-center gap-1">
            {['1','2','3'].map(p => (
              <button key={p} className={`h-7 min-w-7 px-2 rounded text-xs font-medium transition-colors ${p==='1'?'bg-primary text-primary-foreground':'text-muted-foreground hover:bg-accent'}`}>{p}</button>
            ))}
          </div>
        </div>
      </div>
      <AddVehicleModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSave={handleAddVehicle} />
    </div>
  );
}
