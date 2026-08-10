import { useState, useEffect, useRef } from 'react';
import { Wrench, Plus, Search, AlertTriangle, Download, MoreHorizontal, Play, CheckCircle, XCircle } from 'lucide-react';
import { getMaintenanceLogs, addMaintenanceLog, updateMaintenanceStatus, type MaintenanceLog } from '@/api/maintenance.api';
import { AddMaintenanceModal } from '../components/AddMaintenanceModal';
import { useToast } from '@/components/ui/Toast';

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  SCHEDULED:          { label: 'Scheduled',          color: '#1a8fff', bg: 'hsl(211 50% 12%)' },
  TECHNICIAN_ASSIGNED:{ label: 'Tech Assigned',       color: '#a78bfa', bg: 'hsl(258 40% 12%)' },
  IN_PROGRESS:        { label: 'In Progress',         color: '#F59E0B', bg: 'hsl(38 50% 10%)' },
  WAITING_FOR_PARTS:  { label: 'Waiting for Parts',   color: '#f97316', bg: 'hsl(25 50% 10%)' },
  COMPLETED:          { label: 'Completed',           color: '#10B981', bg: 'hsl(160 40% 10%)' },
  VERIFIED:           { label: 'Verified',            color: '#10B981', bg: 'hsl(160 40% 10%)' },
  CANCELLED:          { label: 'Cancelled',           color: '#64748b', bg: 'hsl(222 47% 12%)' },
  CLOSED:             { label: 'Closed',              color: '#64748b', bg: 'hsl(222 47% 12%)' },
};

const TYPE_CONFIG: Record<string, { label: string; color: string }> = {
  PREVENTIVE: { label: 'Preventive', color: '#10B981' },
  CORRECTIVE: { label: 'Corrective', color: '#ef4444' },
  INSPECTION: { label: 'Inspection', color: '#1a8fff' },
  EMERGENCY:  { label: 'Emergency',  color: '#a78bfa' },
};

function ActionMenu({ log, onStatusChange }: { log: MaintenanceLog; onStatusChange: (id: string, status: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const status = (log as any).status ?? 'SCHEDULED';

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const canStart = status === 'SCHEDULED' || status === 'TECHNICIAN_ASSIGNED';
  const canComplete = status === 'IN_PROGRESS' || status === 'WAITING_FOR_PARTS';
  const canCancel = !['COMPLETED', 'VERIFIED', 'CANCELLED', 'CLOSED'].includes(status);

  if (!canStart && !canComplete && !canCancel) return <span className="text-xs text-muted-foreground">—</span>;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(p => !p)}
        className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-1 w-44 rounded-lg border border-border bg-card shadow-lg py-1 text-sm">
          {canStart && (
            <button
              className="flex w-full items-center gap-2 px-4 py-2 text-left hover:bg-accent text-blue-400"
              onClick={() => { onStatusChange(log.id, 'IN_PROGRESS'); setOpen(false); }}
            >
              <Play className="h-3.5 w-3.5" /> Start Work
            </button>
          )}
          {canComplete && (
            <button
              className="flex w-full items-center gap-2 px-4 py-2 text-left hover:bg-accent text-green-400"
              onClick={() => { onStatusChange(log.id, 'COMPLETED'); setOpen(false); }}
            >
              <CheckCircle className="h-3.5 w-3.5" /> Mark Completed
            </button>
          )}
          {canCancel && (
            <button
              className="flex w-full items-center gap-2 px-4 py-2 text-left hover:bg-accent text-red-400"
              onClick={() => { onStatusChange(log.id, 'CANCELLED'); setOpen(false); }}
            >
              <XCircle className="h-3.5 w-3.5" /> Cancel
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function MaintenancePage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [logs, setLogs] = useState<MaintenanceLog[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const { success, error: toastError } = useToast();

  useEffect(() => { fetchLogs(); }, []);

  const fetchLogs = async () => {
    const data = await getMaintenanceLogs();
    setLogs(data);
  };

  const handleAddLog = async (logData: Partial<MaintenanceLog>) => {
    const newLog = await addMaintenanceLog(logData);
    if (newLog) {
      setLogs(prev => [{ ...newLog, status: 'SCHEDULED', cost: (newLog as any).estimatedCost ?? 0 }, ...prev]);
      success('Maintenance record created', 'Vehicle status has been set to In Shop.');
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    setActionLoading(id);
    try {
      await updateMaintenanceStatus(id, status);
      setLogs(prev => prev.map(m => m.id === id ? { ...m, status } : m));
      const msg: Record<string, string> = { IN_PROGRESS: 'Maintenance started.', COMPLETED: 'Maintenance completed. Vehicle restored to Available.', CANCELLED: 'Maintenance cancelled. Vehicle restored to Available.' };
      success('Status updated', msg[status] ?? 'Status changed.');
    } catch (err: any) {
      toastError('Action failed', err?.message ?? 'Could not update maintenance status.');
    } finally {
      setActionLoading(null);
    }
  };

  const inShopCount = logs.filter(m => !['COMPLETED', 'VERIFIED', 'CANCELLED', 'CLOSED'].includes((m as any).status ?? '')).length;
  const counts = logs.reduce((acc, m) => { const s = (m as any).status ?? 'SCHEDULED'; acc[s] = (acc[s] || 0) + 1; return acc; }, {} as Record<string, number>);

  const filtered = logs.filter(m =>
    (m.id.toLowerCase().includes(search.toLowerCase()) ||
     m.vehicleId.toLowerCase().includes(search.toLowerCase()) ||
     m.description.toLowerCase().includes(search.toLowerCase())) &&
    (statusFilter === 'ALL' || (m as any).status === statusFilter)
  );

  const exportCSV = () => {
    const headers = ['ID', 'Vehicle', 'Type', 'Description', 'Status', 'Scheduled Date', 'Cost'];
    const rows = filtered.map(m => [
      (m as any).maintenanceId ?? m.id.slice(0, 8),
      m.vehicleId,
      (m as any).type ?? '',
      m.description,
      (m as any).status ?? '',
      m.date ?? '',
      m.cost,
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'maintenance.csv'; a.click();
  };

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

      {inShopCount > 0 && (
        <div className="flex items-start gap-3 rounded-lg border border-warning/20 bg-warning-soft p-4">
          <AlertTriangle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
          <p className="text-sm text-warning">
            <strong>{inShopCount} vehicle{inShopCount > 1 ? 's' : ''} currently In Shop</strong> — they cannot be dispatched until maintenance is marked complete.
          </p>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        {[
          { label: 'All', filter: 'ALL' },
          { label: 'Scheduled', filter: 'SCHEDULED' },
          { label: 'In Progress', filter: 'IN_PROGRESS' },
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
            {c.filter !== 'ALL' && counts[c.filter] != null && <span className="ml-1.5 opacity-60">{counts[c.filter]}</span>}
            {c.filter === 'ALL' && <span className="ml-1.5 opacity-60">{logs.length}</span>}
          </button>
        ))}
        <div className="flex-1" />
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search records..."
            className="h-8 w-[220px] pl-8 pr-3 text-sm bg-muted/50 border border-border rounded-lg outline-none focus:ring-2 focus:ring-ring/30 text-foreground placeholder:text-muted-foreground" />
        </div>
        <button onClick={exportCSV} className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-input bg-card text-xs font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors shadow-sm">
          <Download className="h-3.5 w-3.5" /> Export CSV
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-muted/60 text-[11px] uppercase text-muted-foreground">
              <tr>
                {['Record ID', 'Vehicle', 'Type', 'Description', 'Scheduled Date', 'Est. Cost', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(m => {
                const s = STATUS_CONFIG[(m as any).status] || STATUS_CONFIG.SCHEDULED;
                const t = TYPE_CONFIG[(m as any).type] || TYPE_CONFIG.PREVENTIVE;
                const isUpdating = actionLoading === m.id;
                return (
                  <tr key={m.id} className={`border-t border-border transition-colors ${isUpdating ? 'opacity-50' : 'hover:bg-muted/30'}`}>
                    <td className="px-5 py-3.5 font-bold font-mono text-primary text-xs">{(m as any).maintenanceId ?? m.id.slice(0, 8)}</td>
                    <td className="px-5 py-3.5 font-mono text-xs font-semibold">{m.vehicleId}</td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs font-bold" style={{ color: t.color }}>{t.label}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-xs text-muted-foreground max-w-[250px] truncate">{m.description}</p>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">{m.date}</td>
                    <td className="px-5 py-3.5 text-xs font-bold">₹{(m.cost || 0).toLocaleString()}</td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1.5 rounded px-2 py-1 text-xs font-semibold"
                        style={{ color: s.color, background: s.bg }}>
                        <span className="size-1.5 rounded-full" style={{ background: s.color }} />
                        {s.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <ActionMenu log={m} onStatusChange={handleStatusChange} />
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
        <div className="px-5 py-3 border-t border-border text-xs text-muted-foreground">
          {filtered.length} record{filtered.length !== 1 ? 's' : ''}
        </div>
      </div>
      <AddMaintenanceModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSave={handleAddLog} />
    </div>
  );
}
