import React, { useState } from 'react';
import { Plus, Search, AlertTriangle, MoreHorizontal, Download } from 'lucide-react';

const STATUS: Record<string, { label: string; color: string; bg: string }> = {
  AVAILABLE: { label: 'Available', color: '#10B981', bg: 'hsl(160 40% 10%)' },
  ON_TRIP:   { label: 'On trip',   color: '#1a8fff', bg: 'hsl(211 50% 12%)' },
  OFF_DUTY:  { label: 'Off duty',  color: '#64748b', bg: 'hsl(222 47% 12%)' },
  SUSPENDED: { label: 'Suspended', color: '#ef4444', bg: 'hsl(0 40% 12%)' },
};

import { getDrivers, addDriver, type Driver } from '@/api/drivers.api';
import { AddDriverModal } from '../components/AddDriverModal';

export default function DriversPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  React.useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    const data = await getDrivers();
    setDrivers(data);
  };

  const handleAddDriver = async (driverData: Partial<Driver>) => {
    const newDriver = await addDriver(driverData);
    if (newDriver) {
      setDrivers(prev => [...prev, newDriver]);
    }
  };

  const filtered = drivers.filter(d =>
    (d.name.toLowerCase().includes(search.toLowerCase()) ||
     (d as any).empId?.toLowerCase().includes(search.toLowerCase())) &&
    (statusFilter === 'ALL' || d.status === statusFilter)
  );

  const isExpired  = (dt: string) => new Date(dt) < new Date();
  const isExpiring = (dt: string) => !isExpired(dt) && (new Date(dt).getTime() - Date.now()) < 120 * 86400000;

  return (
    <div className="space-y-5 pb-8">
      <section className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
        <div>
          <p className="mb-1 text-sm text-muted-foreground">Fleet Management</p>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">Drivers</h1>
        </div>
        <button onClick={() => setIsAddModalOpen(true)} className="inline-flex items-center gap-2 h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm">
          <Plus className="h-4 w-4" /> Add driver
        </button>
      </section>

      <div className="flex flex-wrap items-center gap-3">
        {[
          { label: 'All', value: '89', filter: 'ALL' },
          { label: 'Available', value: '45', filter: 'AVAILABLE' },
          { label: 'On Trip', value: '32', filter: 'ON_TRIP' },
          { label: 'Suspended', value: '2', filter: 'SUSPENDED' },
        ].map(c => (
          <button key={c.filter} onClick={() => setStatusFilter(c.filter)}
            className={`h-8 px-3.5 rounded-lg border text-xs font-semibold transition-colors ${
              statusFilter === c.filter
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
            placeholder="Search drivers..."
            className="h-8 w-[220px] pl-8 pr-3 text-sm bg-muted/50 border border-border rounded-lg outline-none focus:ring-2 focus:ring-ring/30 text-foreground placeholder:text-muted-foreground" />
        </div>
        <button className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-input bg-card text-xs font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors shadow-sm">
          <Download className="h-3.5 w-3.5" /> Export
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="bg-muted/60 text-[11px] uppercase text-muted-foreground">
              <tr>
                {['Driver', 'Employee ID', 'Contact', 'License', 'Category', 'License Expiry', 'Status', 'Trips', ''].map(h => (
                  <th key={h} className="px-5 py-3 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(d => {
                const s = STATUS[d.status];
                const exp  = isExpired(d.expiry ?? '');
                const soon = isExpiring(d.expiry ?? '');
                return (
                  <tr key={d.id} className="border-t border-border hover:bg-muted/30 transition-colors group">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                          {d.name.split(' ').map(n=>n[0]).join('')}
                        </span>
                        <span className="font-semibold">{d.name}</span>
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
                        {(d as any).expiry || 'N/A'}
                        {exp && <span className="ml-1 px-1 rounded bg-destructive/20 text-destructive text-[10px] font-bold">EXPIRED</span>}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1.5 rounded px-2 py-1 text-xs font-semibold"
                        style={{ color: s.color, background: s.bg }}>
                        <span className="size-1.5 rounded-full" style={{ background: s.color }} />
                        {s.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground font-semibold">{(d as any).trips || 0}</td>
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
      </div>
      <AddDriverModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSave={handleAddDriver} />
    </div>
  );
}
