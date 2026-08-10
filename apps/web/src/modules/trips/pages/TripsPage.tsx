import { useState, useEffect, useRef } from 'react';
import { Plus, Search, ChevronRight, AlertCircle, Download, CheckCircle, XCircle, SendHorizonal, MoreHorizontal } from 'lucide-react';
import { getTrips, addTrip, updateTripStatus, type Trip } from '@/api/trips.api';
import { AddTripModal } from '../components/AddTripModal';
import { useToast } from '@/components/ui/Toast';

const STATUS: Record<string, { label: string; color: string; bg: string }> = {
  DRAFT:      { label: 'Draft',      color: '#64748b', bg: 'hsl(222 47% 12%)' },
  DISPATCHED: { label: 'Dispatched', color: '#1a8fff', bg: 'hsl(211 50% 12%)' },
  IN_PROGRESS:{ label: 'On Trip',    color: '#a78bfa', bg: 'hsl(258 40% 12%)' },
  COMPLETED:  { label: 'Completed',  color: '#10B981', bg: 'hsl(160 40% 10%)' },
  CANCELLED:  { label: 'Cancelled',  color: '#ef4444', bg: 'hsl(0 40% 12%)' },
};

const PRIORITY: Record<string, { label: string; color: string }> = {
  LOW:    { label: 'Low',    color: '#10B981' },
  MEDIUM: { label: 'Medium', color: '#F59E0B' },
  HIGH:   { label: 'High',   color: '#ef4444' },
  URGENT: { label: 'Urgent', color: '#a78bfa' },
};

function ActionMenu({ trip, onStatusChange }: { trip: Trip; onStatusChange: (id: string, status: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const status = trip.status;

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const canDispatch = status === 'DRAFT';
  const canComplete = status === 'DISPATCHED' || status === 'IN_PROGRESS';
  const canCancel = status === 'DRAFT' || status === 'DISPATCHED' || status === 'IN_PROGRESS';

  if (!canDispatch && !canComplete && !canCancel) return null;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(p => !p)}
        className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
        title="Actions"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-1 w-44 rounded-lg border border-border bg-card shadow-lg py-1 text-sm">
          {canDispatch && (
            <button
              className="flex w-full items-center gap-2 px-4 py-2 text-left hover:bg-accent text-blue-400 hover:text-blue-300"
              onClick={() => { onStatusChange(trip.id, 'DISPATCHED'); setOpen(false); }}
            >
              <SendHorizonal className="h-3.5 w-3.5" /> Dispatch Trip
            </button>
          )}
          {canComplete && (
            <button
              className="flex w-full items-center gap-2 px-4 py-2 text-left hover:bg-accent text-green-400 hover:text-green-300"
              onClick={() => { onStatusChange(trip.id, 'COMPLETED'); setOpen(false); }}
            >
              <CheckCircle className="h-3.5 w-3.5" /> Mark Complete
            </button>
          )}
          {canCancel && (
            <button
              className="flex w-full items-center gap-2 px-4 py-2 text-left hover:bg-accent text-red-400 hover:text-red-300"
              onClick={() => { onStatusChange(trip.id, 'CANCELLED'); setOpen(false); }}
            >
              <XCircle className="h-3.5 w-3.5" /> Cancel Trip
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function TripsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const { success, error: toastError } = useToast();

  useEffect(() => { fetchTrips(); }, []);

  const fetchTrips = async () => {
    const data = await getTrips();
    setTrips(data);
  };

  const handleAddTrip = async (tripData: Partial<Trip>) => {
    const newTrip = await addTrip(tripData);
    if (newTrip) {
      setTrips(prev => [newTrip, ...prev]);
      success('Trip created', 'The trip has been created as Draft.');
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    const labels: Record<string, string> = { DISPATCHED: 'dispatched', COMPLETED: 'completed', CANCELLED: 'cancelled' };
    setActionLoading(id);
    try {
      await updateTripStatus(id, status);
      setTrips(prev => prev.map(t => t.id === id ? { ...t, status } : t));
      success('Status updated', `Trip has been ${labels[status] ?? status}.`);
    } catch (err: any) {
      toastError('Action failed', err?.message ?? 'Could not update trip status.');
    } finally {
      setActionLoading(null);
    }
  };

  // Count by status
  const counts = trips.reduce((acc, t) => { acc[t.status] = (acc[t.status] || 0) + 1; return acc; }, {} as Record<string, number>);

  const filtered = trips.filter(t =>
    ((t.tripNumber?.toLowerCase().includes(search.toLowerCase()) ||
      t.origin.toLowerCase().includes(search.toLowerCase()) ||
      t.destination.toLowerCase().includes(search.toLowerCase()) ||
      t.driver?.user?.firstName?.toLowerCase().includes(search.toLowerCase()) ||
      t.vehicle?.plateNumber?.toLowerCase().includes(search.toLowerCase()))) &&
    (statusFilter === 'ALL' || t.status === statusFilter)
  );

  const exportCSV = () => {
    const headers = ['Trip #', 'Origin', 'Destination', 'Driver', 'Vehicle', 'Cargo (kg)', 'Status', 'Priority', 'Scheduled Start'];
    const rows = filtered.map(t => [
      t.tripNumber ?? t.id.slice(0, 8),
      t.origin,
      t.destination,
      t.driver ? `${t.driver.user.firstName} ${t.driver.user.lastName}` : '—',
      t.vehicle?.plateNumber ?? '—',
      t.cargoWeight ?? '',
      t.status,
      t.priority ?? '',
      t.scheduledStart ? new Date(t.scheduledStart).toLocaleDateString() : '',
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'trips.csv'; a.click();
  };

  return (
    <div className="space-y-5 pb-8">
      <section className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
        <div>
          <p className="mb-1 text-sm text-muted-foreground">Dispatch Engine</p>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">Trips &amp; Dispatch</h1>
        </div>
        <button onClick={() => setIsAddModalOpen(true)} className="inline-flex items-center gap-2 h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm">
          <Plus className="h-4 w-4" /> Create Trip
        </button>
      </section>

      {/* Business rule banner */}
      <div className="flex items-start gap-3 rounded-lg border border-warning/20 bg-warning-soft p-4">
        <AlertCircle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
        <p className="text-sm text-warning">
          <strong>Business Rules:</strong> Retired/In-Shop vehicles and Suspended/Expired-License drivers cannot be dispatched.
          Cargo weight must not exceed vehicle max load capacity.
        </p>
      </div>

      {/* Status chips */}
      <div className="flex flex-wrap items-center gap-3">
        {[
          { label: 'All', filter: 'ALL' },
          { label: 'Draft', filter: 'DRAFT' },
          { label: 'Dispatched', filter: 'DISPATCHED' },
          { label: 'On Trip', filter: 'IN_PROGRESS' },
          { label: 'Completed', filter: 'COMPLETED' },
          { label: 'Cancelled', filter: 'CANCELLED' },
        ].map(c => (
          <button key={c.filter} onClick={() => setStatusFilter(c.filter)}
            className={`h-8 px-3.5 rounded-lg border text-xs font-semibold transition-colors ${
              statusFilter === c.filter
                ? 'border-primary bg-secondary text-primary'
                : 'border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground'
            }`}>
            {c.label}
            {c.filter !== 'ALL' && counts[c.filter] != null && (
              <span className="ml-1.5 opacity-60">{counts[c.filter]}</span>
            )}
            {c.filter === 'ALL' && <span className="ml-1.5 opacity-60">{trips.length}</span>}
          </button>
        ))}
        <div className="flex-1" />
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search trips..."
            className="h-8 w-[220px] pl-8 pr-3 text-sm bg-muted/50 border border-border rounded-lg outline-none focus:ring-2 focus:ring-ring/30 text-foreground placeholder:text-muted-foreground" />
        </div>
        <button onClick={exportCSV} className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-input bg-card text-xs font-medium text-muted-foreground hover:bg-accent transition-colors shadow-sm">
          <Download className="h-3.5 w-3.5" /> Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-muted/60 text-[11px] uppercase text-muted-foreground">
              <tr>
                {['Trip #', 'Route', 'Driver / Vehicle', 'Cargo', 'Priority', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => {
                const s = STATUS[t.status] || STATUS.DRAFT;
                const p = PRIORITY[t.priority ?? 'MEDIUM'] || PRIORITY.MEDIUM;
                const isUpdating = actionLoading === t.id;
                const driverName = t.driver ? `${t.driver.user.firstName} ${t.driver.user.lastName}` : (t.driverId ?? '—');
                const vehiclePlate = t.vehicle?.plateNumber ?? t.vehiclePlate ?? t.vehicleId ?? '—';
                return (
                  <tr key={t.id} className={`border-t border-border transition-colors ${isUpdating ? 'opacity-50' : 'hover:bg-muted/30'}`}>
                    <td className="px-5 py-3.5 font-mono text-xs font-bold text-primary">{t.tripNumber ?? t.id.slice(0, 8)}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5 text-sm">
                        <span className="font-semibold">{t.origin}</span>
                        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="font-semibold">{t.destination}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-xs">{driverName}</p>
                      <p className="font-mono text-[10px] text-muted-foreground">{vehiclePlate}</p>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">
                      {t.cargoWeight ? `${t.cargoWeight} kg` : '—'}
                      {t.vehicle?.payloadCapacity && t.cargoWeight ? (
                        <span className="text-[10px] opacity-60"> / {t.vehicle.payloadCapacity} kg</span>
                      ) : null}
                    </td>
                    <td className="px-5 py-3.5 text-xs font-bold" style={{ color: p.color }}>{p.label}</td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1.5 rounded px-2 py-1 text-xs font-semibold"
                        style={{ color: s.color, background: s.bg }}>
                        <span className="size-1.5 rounded-full" style={{ background: s.color }} />
                        {s.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <ActionMenu trip={t} onStatusChange={handleStatusChange} />
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
        <div className="px-5 py-3 border-t border-border text-xs text-muted-foreground">
          {filtered.length} trip{filtered.length !== 1 ? 's' : ''}
        </div>
      </div>
      <AddTripModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSave={handleAddTrip} />
    </div>
  );
}
