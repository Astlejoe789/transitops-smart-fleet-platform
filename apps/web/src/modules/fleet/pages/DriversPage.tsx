import { useState, useEffect, useRef } from 'react';
import { Plus, Search, AlertTriangle, MoreHorizontal, Download, Ban, UserCheck, ShieldOff } from 'lucide-react';
import { getDrivers, addDriver, updateDriverStatus, type Driver } from '@/api/drivers.api';
import { AddDriverModal } from '../components/AddDriverModal';
import { useToast } from '@/components/ui/Toast';

const STATUS: Record<string, { label: string; color: string; bg: string }> = {
  AVAILABLE:  { label: 'Available',  color: '#10B981', bg: 'hsl(160 40% 10%)' },
  ON_TRIP:    { label: 'On Trip',    color: '#1a8fff', bg: 'hsl(211 50% 12%)' },
  OFF_DUTY:   { label: 'Off Duty',   color: '#64748b', bg: 'hsl(222 47% 12%)' },
  SUSPENDED:  { label: 'Suspended',  color: '#ef4444', bg: 'hsl(0 40% 12%)' },
  ON_LEAVE:   { label: 'On Leave',   color: '#a78bfa', bg: 'hsl(258 40% 12%)' },
  INACTIVE:   { label: 'Inactive',   color: '#64748b', bg: 'hsl(222 47% 12%)' },
};

function DriverActionMenu({ driver, onStatusChange }: { driver: Driver; onStatusChange: (id: string, status: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const canSuspend = driver.status === 'AVAILABLE' || driver.status === 'OFF_DUTY';
  const canActivate = driver.status === 'SUSPENDED' || driver.status === 'INACTIVE' || driver.status === 'OFF_DUTY';

  if (!canSuspend && !canActivate) return null;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(p => !p)}
        className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors opacity-0 group-hover:opacity-100"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-1 w-44 rounded-lg border border-border bg-card shadow-lg py-1 text-sm">
          {canActivate && (
            <button
              className="flex w-full items-center gap-2 px-4 py-2 text-left hover:bg-accent text-green-400"
              onClick={() => { onStatusChange(driver.id, 'AVAILABLE'); setOpen(false); }}
            >
              <UserCheck className="h-3.5 w-3.5" /> Activate Driver
            </button>
          )}
          {canSuspend && (
            <button
              className="flex w-full items-center gap-2 px-4 py-2 text-left hover:bg-accent text-red-400"
              onClick={() => { onStatusChange(driver.id, 'SUSPENDED'); setOpen(false); }}
            >
              <Ban className="h-3.5 w-3.5" /> Suspend Driver
            </button>
          )}
          {driver.status === 'AVAILABLE' && (
            <button
              className="flex w-full items-center gap-2 px-4 py-2 text-left hover:bg-accent text-muted-foreground"
              onClick={() => { onStatusChange(driver.id, 'OFF_DUTY'); setOpen(false); }}
            >
              <ShieldOff className="h-3.5 w-3.5" /> Set Off Duty
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function DriversPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { success, error: toastError } = useToast();

  useEffect(() => { fetchDrivers(); }, []);

  const fetchDrivers = async () => {
    const data = await getDrivers();
    setDrivers(data);
  };

  const handleAddDriver = async (driverData: any) => {
    try {
      const newDriver = await addDriver(driverData);
      if (newDriver) {
        setDrivers(prev => [{ ...newDriver, name: driverData.firstName ? `${driverData.firstName} ${driverData.lastName}` : (newDriver.name ?? '') }, ...prev]);
        success('Driver added', 'The driver has been registered in the system.');
      }
    } catch (err: any) {
      toastError('Registration failed', err?.message ?? 'Could not add driver.');
      throw err;
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateDriverStatus(id, status);
      setDrivers(prev => prev.map(d => d.id === id ? { ...d, status } : d));
      const msgs: Record<string, string> = {
        AVAILABLE: 'Driver is now active and available.',
        SUSPENDED: 'Driver has been suspended and cannot be dispatched.',
        OFF_DUTY: 'Driver set to Off Duty.',
      };
      success('Status updated', msgs[status] ?? 'Driver status updated.');
    } catch (err: any) {
      toastError('Action failed', err?.message ?? 'Could not update driver status.');
    }
  };

  const counts = drivers.reduce((acc, d) => { acc[d.status] = (acc[d.status] || 0) + 1; return acc; }, {} as Record<string, number>);

  const filtered = drivers.filter(d =>
    (d.name.toLowerCase().includes(search.toLowerCase()) ||
     (d.empId ?? '').toLowerCase().includes(search.toLowerCase()) ||
     (d.license ?? '').toLowerCase().includes(search.toLowerCase())) &&
    (statusFilter === 'ALL' || d.status === statusFilter)
  );

  const isExpired  = (dt?: string) => !!dt && new Date(dt) < new Date();
  const isExpiring = (dt?: string) => !!dt && !isExpired(dt) && (new Date(dt).getTime() - Date.now()) < 120 * 86400000;

  const exportCSV = () => {
    const headers = ['Name', 'Employee ID', 'License', 'Category', 'License Expiry', 'Status', 'Phone'];
    const rows = filtered.map(d => [d.name, d.empId ?? '', d.license ?? '', d.category ?? '', d.expiry ?? '', d.status, d.phone ?? '']);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'drivers.csv'; a.click();
  };

  return (
    <div className="space-y-5 pb-8">
      <section className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
        <div>
          <p className="mb-1 text-sm text-muted-foreground">Fleet Management</p>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">Drivers</h1>
        </div>
        <button onClick={() => setIsAddModalOpen(true)} className="inline-flex items-center gap-2 h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm">
          <Plus className="h-4 w-4" /> Add Driver
        </button>
      </section>

      <div className="flex flex-wrap items-center gap-3">
        {[
          { label: 'All', filter: 'ALL' },
          { label: 'Available', filter: 'AVAILABLE' },
          { label: 'On Trip', filter: 'ON_TRIP' },
          { label: 'Off Duty', filter: 'OFF_DUTY' },
          { label: 'Suspended', filter: 'SUSPENDED' },
        ].map(c => (
          <button key={c.filter} onClick={() => setStatusFilter(c.filter)}
            className={`h-8 px-3.5 rounded-lg border text-xs font-semibold transition-colors ${
              statusFilter === c.filter
                ? 'border-primary bg-secondary text-primary'
                : 'border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground'
            }`}>
            {c.label}
            <span className="ml-1.5 opacity-60">
              {c.filter === 'ALL' ? drivers.length : (counts[c.filter] ?? 0)}
            </span>
          </button>
        ))}
        <div className="flex-1" />
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search drivers..."
            className="h-8 w-[220px] pl-8 pr-3 text-sm bg-muted/50 border border-border rounded-lg outline-none focus:ring-2 focus:ring-ring/30 text-foreground placeholder:text-muted-foreground" />
        </div>
        <button onClick={exportCSV} className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-input bg-card text-xs font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors shadow-sm">
          <Download className="h-3.5 w-3.5" /> Export CSV
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="bg-muted/60 text-[11px] uppercase text-muted-foreground">
              <tr>
                {['Driver', 'Employee ID', 'Contact', 'License', 'Category', 'License Expiry', 'Status', ''].map(h => (
                  <th key={h} className="px-5 py-3 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(d => {
                const s = STATUS[d.status] ?? STATUS.AVAILABLE;
                const exp  = isExpired(d.expiry);
                const soon = isExpiring(d.expiry);
                return (
                  <tr key={d.id} className="border-t border-border hover:bg-muted/30 transition-colors group">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                          {d.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </span>
                        <div>
                          <p className="font-semibold">{d.name}</p>
                          <p className="text-xs text-muted-foreground">{d.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground font-mono text-xs">{d.empId}</td>
                    <td className="px-5 py-3.5 text-muted-foreground text-xs">{d.phone}</td>
                    <td className="px-5 py-3.5 text-muted-foreground font-mono text-xs">{d.license}</td>
                    <td className="px-5 py-3.5">
                      <span className="px-2 py-0.5 rounded bg-secondary text-xs font-medium text-secondary-foreground">{d.category}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`flex items-center gap-1 text-xs font-medium ${exp ? 'text-destructive' : soon ? 'text-warning' : 'text-muted-foreground'}`}>
                        {(exp || soon) && <AlertTriangle className="h-3 w-3" />}
                        {d.expiry || 'N/A'}
                        {exp && <span className="ml-1 px-1 rounded bg-destructive/20 text-destructive text-[10px] font-bold">EXPIRED</span>}
                        {soon && !exp && <span className="ml-1 px-1 rounded bg-warning/20 text-warning text-[10px] font-bold">EXPIRING</span>}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1.5 rounded px-2 py-1 text-xs font-semibold"
                        style={{ color: s.color, background: s.bg }}>
                        <span className="size-1.5 rounded-full" style={{ background: s.color }} />
                        {s.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <DriverActionMenu driver={d} onStatusChange={handleStatusChange} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-16 text-center"><p className="text-muted-foreground text-sm">No drivers found.</p></div>
        )}
        <div className="px-5 py-3 border-t border-border text-xs text-muted-foreground">
          {filtered.length} driver{filtered.length !== 1 ? 's' : ''}
        </div>
      </div>
      <AddDriverModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSave={handleAddDriver} />
    </div>
  );
}
