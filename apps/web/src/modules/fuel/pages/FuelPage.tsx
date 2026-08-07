import React, { useState } from 'react';
import { Fuel, Plus, Search, TrendingDown, TrendingUp, MoreHorizontal, Download } from 'lucide-react';

import { getFuelLogs, addFuelLog, type FuelLog } from '@/api/fuel.api';
import { AddFuelLogModal } from '../components/AddFuelLogModal';


export default function FuelPage() {
  const [search, setSearch] = useState('');
  const [logs, setLogs] = useState<FuelLog[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  React.useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    const data = await getFuelLogs();
    setLogs(data);
  };

  const handleAddLog = async (logData: Partial<FuelLog>) => {
    const newLog = await addFuelLog(logData);
    if (newLog) {
      setLogs(prev => [...prev, newLog]);
    }
  };

  const filtered = logs.filter(f =>
    f.id.toLowerCase().includes(search.toLowerCase()) ||
    f.vehicleId.toLowerCase().includes(search.toLowerCase()) ||
    f.driverId.toLowerCase().includes(search.toLowerCase())
  );

  const totalLiters = logs.reduce((a, f) => a + (f.gallons || 0), 0);
  const totalCost = logs.reduce((a, f) => a + f.cost, 0);
  const avgEfficiency = logs.length ? 7.2 : 0; // mocked efficiency for now

  return (
    <div className="space-y-5 pb-8">
      {/* Header */}
      <section className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
        <div>
          <p className="mb-1 text-sm text-muted-foreground">Finance</p>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">Fuel Logs</h1>
        </div>
        <button onClick={() => setIsAddModalOpen(true)} className="inline-flex items-center gap-2 h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm">
          <Plus className="h-4 w-4" /> Add Fuel Entry
        </button>
      </section>

      {/* KPIs */}
      <section className="grid gap-3 sm:grid-cols-3" aria-label="Fuel metrics">
        {[
          { label: 'Total Fuel (MTD)', value: `${totalLiters.toFixed(0)}L`, icon: Fuel, iconClass: 'bg-primary/10 text-primary', sub: `Across ${logs.length} fill-ups` },
          { label: 'Total Fuel Cost (MTD)', value: `₹${(totalCost/1000).toFixed(1)}K`, icon: TrendingUp, iconClass: 'bg-destructive/10 text-destructive', sub: 'vs ₹38K last month' },
          { label: 'Avg. Efficiency', value: `${avgEfficiency.toFixed(1)} km/L`, icon: TrendingDown, iconClass: 'bg-success/10 text-success', sub: '+0.3 km/L vs last month' },
        ].map(k => {
          const Icon = k.icon;
          return (
            <article key={k.label} className="rounded-lg border bg-card p-5 shadow-sm">
              <div className="mb-5 flex items-start justify-between">
                <span className={`grid size-10 place-items-center rounded-md ${k.iconClass}`}>
                  <Icon width={20} height={20} aria-hidden="true" />
                </span>
              </div>
              <p className="text-sm font-medium text-muted-foreground">{k.label}</p>
              <div className="mt-1 flex items-end justify-between gap-2">
                <p className="font-display text-2xl font-bold">{k.value}</p>
                <p className="text-right text-xs text-muted-foreground">{k.sub}</p>
              </div>
            </article>
          );
        })}
      </section>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by ID, vehicle, or driver..."
            className="w-full h-8 pl-8 pr-3 text-sm bg-muted/50 border border-border rounded-lg outline-none focus:ring-2 focus:ring-ring/30 text-foreground placeholder:text-muted-foreground" />
        </div>
        <div className="flex-1" />
        <button className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-input bg-card text-xs font-medium text-muted-foreground hover:bg-accent transition-colors shadow-sm">
          <Download className="h-3.5 w-3.5" /> Export
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-muted/60 text-[11px] uppercase text-muted-foreground">
              <tr>
                {['Log ID', 'Vehicle', 'Driver', 'Trip', 'Date', 'Liters', 'Total', 'Efficiency', 'Station', ''].map(h => (
                  <th key={h} className="px-5 py-3 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(f => (
                <tr key={f.id} className="border-t border-border hover:bg-muted/30 transition-colors group">
                  <td className="px-5 py-3.5 font-bold font-mono text-primary text-xs">{f.id.slice(0,8)}</td>
                  <td className="px-5 py-3.5 font-mono text-xs font-semibold">{f.vehicleId}</td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{f.driverId}</td>
                  <td className="px-5 py-3.5 font-mono text-xs">{(f as any).trip ? <span className="text-primary">{(f as any).trip}</span> : <span className="text-muted-foreground">—</span>}</td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{f.date}</td>
                  <td className="px-5 py-3.5 text-xs font-bold">{f.gallons}L</td>
                  <td className="px-5 py-3.5 text-xs font-bold">₹{f.cost.toLocaleString()}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-bold ${(f as any).efficiency >= 7.5 ? 'text-success' : (f as any).efficiency >= 6.5 ? 'text-warning' : 'text-muted-foreground'}`}>
                      {(f as any).efficiency || '-'} km/L
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground max-w-[150px] truncate">{f.location || (f as any).station}</td>
                  <td className="px-5 py-3.5">
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <Fuel className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground text-sm">No fuel logs found.</p>
          </div>
        )}
      </div>
      <AddFuelLogModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSave={handleAddLog} />
    </div>
  );
}
