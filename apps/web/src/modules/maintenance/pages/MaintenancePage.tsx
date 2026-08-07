import React, { useState } from 'react';
import { Wrench, Plus, Search, Eye, Edit3, AlertTriangle, Download, MoreHorizontal } from 'lucide-react';

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  SCHEDULED:   { label: 'Scheduled',   color: '#1a8fff', bg: 'hsl(211 50% 12%)' },
  IN_PROGRESS: { label: 'In Progress', color: '#F59E0B', bg: 'hsl(38 50% 10%)' },
  COMPLETED:   { label: 'Completed',   color: '#10B981', bg: 'hsl(160 40% 10%)' },
  CANCELLED:   { label: 'Cancelled',   color: '#64748b', bg: 'hsl(222 47% 12%)' },
};

const TYPE_CONFIG: Record<string, { label: string; color: string }> = {
  PREVENTIVE: { label: 'Preventive', color: '#10B981' },
  CORRECTIVE: { label: 'Corrective', color: '#ef4444' },
  INSPECTION: { label: 'Inspection', color: '#1a8fff' },
  EMERGENCY:  { label: 'Emergency',  color: '#a78bfa' },
};

import { getMaintenanceLogs, addMaintenanceLog, type MaintenanceLog } from '@/api/maintenance.api';
import { AddMaintenanceModal } from '../components/AddMaintenanceModal';


export default function MaintenancePage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [logs, setLogs] = useState<MaintenanceLog[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  React.useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    const data = await getMaintenanceLogs();
    setLogs(data);
  };

  const handleAddLog = async (logData: Partial<MaintenanceLog>) => {
    const newLog = await addMaintenanceLog(logData);
    if (newLog) {
      setLogs(prev => [...prev, newLog]);
    }
  };

  const filtered = logs.filter(m =>
    (m.id.toLowerCase().includes(search.toLowerCase()) ||
     m.vehicleId.toLowerCase().includes(search.toLowerCase()) ||
     m.description.toLowerCase().includes(search.toLowerCase())) &&
    (statusFilter === 'ALL' || (m as any).status === statusFilter)
  );

  return (
    <div className="space-y-5 pb-8">
      <section className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
        <div>
          <p className="mb-1 text-sm text-muted-foreground">Fleet Management</p>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">Maintenance</h1>
        </div>
        <button onClick={() => setIsAddModalOpen(true)} className="inline-flex items-center gap-2 h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm">
          <Plus className="h-4 w-4" /> Create Record
        </button>
      </section>

      {/* Alert */}
      <div className="flex items-start gap-3 rounded-lg border border-warning/20 bg-warning-soft p-4">
        <AlertTriangle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
        <p className="text-sm text-warning">
          <strong>2 vehicles currently In Shop</strong> — they cannot be dispatched until maintenance is marked complete.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {[
          { label: 'All', filter: 'ALL' },
          { label: 'Scheduled', filter: 'SCHEDULED' },
          { label: 'In Progress', filter: 'IN_PROGRESS' },
          { label: 'Completed', filter: 'COMPLETED' },
        ].map(c => (
          <button key={c.filter} onClick={() => setStatusFilter(c.filter)}
            className={`h-8 px-3.5 rounded-lg border text-xs font-semibold transition-colors ${
              statusFilter === c.filter
                ? 'border-primary bg-secondary text-primary'
                : 'border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground'
            }`}>
            {c.label}
          </button>
        ))}
        <div className="flex-1" />
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search records..."
            className="h-8 w-[220px] pl-8 pr-3 text-sm bg-muted/50 border border-border rounded-lg outline-none focus:ring-2 focus:ring-ring/30 text-foreground placeholder:text-muted-foreground" />
        </div>
        <button className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-input bg-card text-xs font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors shadow-sm">
          <Download className="h-3.5 w-3.5" /> Export
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-muted/60 text-[11px] uppercase text-muted-foreground">
              <tr>
                {['Record ID', 'Vehicle', 'Type', 'Description', 'Scheduled Date', 'Est. Cost', 'Status', ''].map(h => (
                  <th key={h} className="px-5 py-3 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(m => {
                const s = STATUS_CONFIG[(m as any).status] || STATUS_CONFIG.SCHEDULED;
                const t = TYPE_CONFIG[(m as any).type] || TYPE_CONFIG.PREVENTIVE;
                return (
                  <tr key={m.id} className="border-t border-border hover:bg-muted/30 transition-colors group">
                    <td className="px-5 py-3.5 font-bold font-mono text-primary text-xs">{m.id.slice(0,8)}</td>
                    <td className="px-5 py-3.5 font-mono text-xs font-semibold">{m.vehicleId}</td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs font-bold" style={{ color: t.color }}>{t.label}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-xs text-muted-foreground max-w-[250px] truncate">{m.description}</p>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">{m.date}</td>
                    <td className="px-5 py-3.5 text-xs font-bold">₹{m.cost.toLocaleString()}</td>
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
          <div className="py-16 text-center">
            <Wrench className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground text-sm">No maintenance records found.</p>
          </div>
        )}
      </div>
      <AddMaintenanceModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSave={handleAddLog} />
    </div>
  );
}
