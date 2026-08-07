import React, { useState } from 'react';
import { Route, Plus, Search, ChevronRight, MoreHorizontal, AlertCircle, Download } from 'lucide-react';

const STATUS: Record<string, { label: string; color: string; bg: string }> = {
  DRAFT:      { label: 'Draft',      color: '#64748b', bg: 'hsl(222 47% 12%)' },
  DISPATCHED: { label: 'Dispatched', color: '#1a8fff', bg: 'hsl(211 50% 12%)' },
  ON_TRIP:    { label: 'On Trip',    color: '#a78bfa', bg: 'hsl(258 40% 12%)' },
  COMPLETED:  { label: 'Completed',  color: '#10B981', bg: 'hsl(160 40% 10%)' },
  CANCELLED:  { label: 'Cancelled',  color: '#ef4444', bg: 'hsl(0 40% 12%)' },
};

const PRIORITY: Record<string, { label: string; color: string }> = {
  LOW:    { label: 'Low',    color: '#10B981' },
  MEDIUM: { label: 'Medium', color: '#F59E0B' },
  HIGH:   { label: 'High',   color: '#ef4444' },
  URGENT: { label: 'Urgent', color: '#a78bfa' },
};

import { getTrips, addTrip, type Trip } from '@/api/trips.api';
import { AddTripModal } from '../components/AddTripModal';

export default function TripsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  React.useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    const data = await getTrips();
    setTrips(data);
  };

  const handleAddTrip = async (tripData: Partial<Trip>) => {
    const newTrip = await addTrip(tripData);
    if (newTrip) {
      setTrips(prev => [...prev, newTrip]);
    }
  };

  const filtered = trips.filter(t =>
    ((t as any).tripId?.toLowerCase().includes(search.toLowerCase()) ||
     (t as any).driverName?.toLowerCase().includes(search.toLowerCase()) ||
     t.origin.toLowerCase().includes(search.toLowerCase()) ||
     t.destination.toLowerCase().includes(search.toLowerCase())) &&
    (statusFilter === 'ALL' || t.status === statusFilter)
  );

  return (
    <div className="space-y-5 pb-8">
      <section className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
        <div>
          <p className="mb-1 text-sm text-muted-foreground">Dispatch Engine</p>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">Trips & Dispatch</h1>
        </div>
        <button onClick={() => setIsAddModalOpen(true)} className="inline-flex items-center gap-2 h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm">
          <Plus className="h-4 w-4" /> Create Trip
        </button>
      </section>

      {/* Business rule banner */}
      <div className="flex items-start gap-3 rounded-lg border border-warning/20 bg-warning-soft p-4">
        <AlertCircle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
        <p className="text-sm text-warning">
          <strong>Business Rules:</strong> Vehicles in-shop or retired, and drivers with expired/suspended status cannot be dispatched.
        </p>
      </div>

      {/* Summary chips */}
      <div className="flex flex-wrap items-center gap-3">
        {[
          { label:'All', filter:'ALL' }, { label:'On Trip', filter:'ON_TRIP' },
          { label:'Dispatched', filter:'DISPATCHED' }, { label:'Completed', filter:'COMPLETED' },
          { label:'Draft', filter:'DRAFT' },
        ].map(c => (
          <button key={c.filter} onClick={() => setStatusFilter(c.filter)}
            className={`h-8 px-3.5 rounded-lg border text-xs font-semibold transition-colors ${
              statusFilter === c.filter
                ? 'border-primary bg-secondary text-primary'
                : 'border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground'
            }`}>{c.label}</button>
        ))}
        <div className="flex-1" />
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search trips..."
            className="h-8 w-[220px] pl-8 pr-3 text-sm bg-muted/50 border border-border rounded-lg outline-none focus:ring-2 focus:ring-ring/30 text-foreground placeholder:text-muted-foreground" />
        </div>
        <button className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-input bg-card text-xs font-medium text-muted-foreground hover:bg-accent transition-colors shadow-sm">
          <Download className="h-3.5 w-3.5" /> Export
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="bg-muted/60 text-[11px] uppercase text-muted-foreground">
              <tr>
                {['Trip ID', 'Route', 'Driver / Vehicle', 'Scheduled', 'Cargo', 'Priority', 'Status', ''].map(h => (
                  <th key={h} className="px-5 py-3 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => {
                const s = STATUS[t.status] || STATUS.DRAFT;
                const p = PRIORITY[(t as any).priority] || PRIORITY.LOW;
                return (
                  <tr key={t.id} className="border-t border-border hover:bg-muted/30 transition-colors group">
                    <td className="px-5 py-3.5 font-mono text-xs font-bold text-primary">{t.tripId || t.id.slice(0,8)}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5 text-sm">
                        <span className="font-semibold">{t.origin}</span>
                        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="font-semibold">{t.destination}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-xs">{t.driverName || t.driverId}</p>
                      <p className="font-mono text-[10px] text-muted-foreground">{t.vehiclePlate || t.vehicleId}</p>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">{t.startDate}</td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">{(t as any).weight > 0 ? `${(t as any).weight}T / ${(t as any).capacity}T` : '—'}</td>
                    <td className="px-5 py-3.5 text-xs font-bold" style={{ color: p.color }}>{p.label}</td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1.5 rounded px-2 py-1 text-xs font-semibold"
                        style={{ color: s.color, background: s.bg }}>
                        <span className="size-1.5 rounded-full" style={{ background: s.color }} />
                        {s.label}
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
          <div className="py-16 text-center"><p className="text-muted-foreground text-sm">No trips found.</p></div>
        )}
      </div>
      <AddTripModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSave={handleAddTrip} />
    </div>
  );
}
