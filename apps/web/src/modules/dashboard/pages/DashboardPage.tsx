import { useState, useEffect } from 'react';
import {
  Truck, Activity, Wrench, Fuel,
  Ellipsis, Map, CalendarDays, ChevronDown,
  Clock3, Download, AlertTriangle, Shield, RefreshCw,
  Users, BarChart3, SendHorizonal, CheckCircle
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  ResponsiveContainer, Tooltip
} from 'recharts';
import { dashboardApi, type DashboardSummary, type DashboardFleetData } from '@/api/dashboard.api';

// ── Skeleton component ──────────────────────────────────────────────────
function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-muted ${className}`} />;
}

// ── Chart data ──────────────────────────────────────────────────
const utilData = [
  { day: 'Mon', value: 72 },
  { day: 'Tue', value: 78 },
  { day: 'Wed', value: 75 },
  { day: 'Thu', value: 88 },
  { day: 'Fri', value: 85 },
  { day: 'Sat', value: 74 },
  { day: 'Sun', value: 79 },
];

// ── KPI Cards (static fallback) ─────────────────────────────────────────
const KPI_CARDS_FALLBACK = [
  { icon: Truck,         iconClass: 'bg-secondary text-foreground',    label: 'Total Vehicles',     value: '248',       sub: '+6 this month' },
  { icon: CheckCircle,   iconClass: 'bg-success-soft text-success',    label: 'Available Vehicles', value: '187',       sub: 'ready for dispatch' },
  { icon: Activity,      iconClass: 'bg-primary/10 text-primary',      label: 'Active Trips',       value: '28',        sub: 'dispatched or in progress' },
  { icon: SendHorizonal, iconClass: 'bg-warning-soft text-warning',    label: 'Pending Trips',      value: '14',        sub: 'awaiting dispatch' },
  { icon: Users,         iconClass: 'bg-[#8B5CF6]/10 text-[#8B5CF6]', label: 'Drivers On Duty',    value: '32',        sub: 'of 89 total drivers' },
  { icon: Wrench,        iconClass: 'bg-warning-soft text-warning',    label: 'In Maintenance',     value: '12',        sub: '3 need attention' },
  { icon: Fuel,          iconClass: 'bg-secondary text-foreground',    label: 'Fuel Efficiency',    value: '8.4 km/L',  sub: '+2.1% vs last week' },
  { icon: BarChart3,     iconClass: 'bg-success-soft text-success',    label: 'Fleet Utilization',  value: '75.4%',     sub: 'active vehicles' },
];

// ── Vehicle activity ─────────────────────────────────────────────
const VEHICLES = [
  { id: 'FT-2048', driver: 'Maya Chen', status: 'On route', statusClass: 'bg-success-soft text-success', location: 'I-80 · Oakland', next: '14 min' },
  { id: 'FT-1832', driver: 'Jon Bell', status: 'Idle', statusClass: 'bg-warning-soft text-warning', location: 'Depot 04 · Fremont', next: '42 min' },
  { id: 'FT-2175', driver: 'A. Rivera', status: 'On route', statusClass: 'bg-success-soft text-success', location: 'US-101 · San Jose', next: '26 min' },
  { id: 'FT-1951', driver: 'Sam Okafor', status: 'Service due', statusClass: 'bg-destructive text-destructive-foreground', location: 'Depot 02 · Richmond', next: '—' },
];

// ── Attention alerts ─────────────────────────────────────────────
const ALERTS = [
  { icon: Wrench, title: 'FT-1951 service overdue', body: 'Oil service exceeded by 240 mi', level: 'High', levelClass: 'bg-destructive text-destructive-foreground' },
  { icon: Fuel, title: 'Unusual fuel consumption', body: 'FT-1784 used 18% above baseline', level: 'Medium', levelClass: 'bg-warning text-foreground' },
  { icon: Shield, title: 'Driver document expiring', body: 'Maya Chen · license in 12 days', level: 'Review', levelClass: 'bg-success-soft text-success' },
];

// ── Map vehicle pins ──────────────────────────────────────────────
const MAP_PINS = [
  { left: '18%', top: '35%', warn: false },
  { left: '43%', top: '48%', warn: false },
  { left: '71%', top: '29%', warn: false },
  { left: '77%', top: '68%', warn: true  },
  { left: '31%', top: '73%', warn: false },
];

function getDayLabel() {
  return new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [fleet, setFleet] = useState<DashboardFleetData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = () => {
    setLoading(true);
    setError(null);
    Promise.all([
      dashboardApi.getSummary().then(setSummary),
      dashboardApi.getFleet().then(setFleet),
    ])
      .catch(() => setError('Failed to load dashboard data. Showing demo data.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const currentKpiCards = summary ? [
    { ...KPI_CARDS_FALLBACK[0], value: String(summary.totalVehicles.value), sub: summary.totalVehicles.sub },
    { ...KPI_CARDS_FALLBACK[1], value: String(summary.availableVehicles?.value ?? summary.activeVehicles.value), sub: summary.availableVehicles?.sub ?? summary.activeVehicles.sub },
    { ...KPI_CARDS_FALLBACK[2], value: String(summary.activeTrips?.value ?? '—'), sub: summary.activeTrips?.sub ?? 'dispatched or in progress' },
    { ...KPI_CARDS_FALLBACK[3], value: String(summary.pendingTrips?.value ?? '—'), sub: summary.pendingTrips?.sub ?? 'awaiting dispatch' },
    { ...KPI_CARDS_FALLBACK[4], value: String(summary.driversOnDuty?.value ?? '—'), sub: summary.driversOnDuty?.sub ?? 'drivers on trip' },
    { ...KPI_CARDS_FALLBACK[5], value: String(summary.inMaintenance.value), sub: summary.inMaintenance.sub },
    { ...KPI_CARDS_FALLBACK[6], value: String(summary.fuelEfficiency.value), sub: summary.fuelEfficiency.sub },
    { ...KPI_CARDS_FALLBACK[7], value: String(summary.fleetUtilization?.value ?? '—'), sub: summary.fleetUtilization?.sub ?? 'active vehicles' },
  ] : KPI_CARDS_FALLBACK;

  const currentUtilData = fleet?.utilizationData || utilData;
  const currentVehicles = fleet?.vehicles || VEHICLES;
  
  const iconMap: any = { Wrench, Fuel, Shield, AlertTriangle };
  const currentAlerts = fleet?.alerts.map(a => ({
    ...a,
    icon: iconMap[a.iconName] || AlertTriangle
  })) || ALERTS;

  return (
    <>
      {/* ── Page heading ─────────────────────────────────────── */}
      <section className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
        <div className="min-w-0">
          <p className="mb-1 text-sm text-muted-foreground">{getDayLabel()}</p>
          <h1 className="truncate font-display text-2xl font-bold sm:text-3xl">Fleet overview</h1>
        </div>
        <div className="flex items-center gap-2">
          {error && (
            <span className="text-xs text-warning bg-warning-soft px-2 py-1 rounded-md">{error}</span>
          )}
          <button
            onClick={fetchData}
            disabled={loading}
            title="Refresh data"
            className="inline-flex items-center gap-2 h-9 px-3 rounded-md border border-input bg-background shadow-sm hover:bg-accent text-sm font-medium transition-colors disabled:opacity-50"
            type="button"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} aria-hidden="true" />
          </button>
          <button
            className="inline-flex items-center gap-2 h-9 px-4 py-2 rounded-md border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground text-sm font-medium transition-colors"
            type="button"
          >
            <CalendarDays className="h-4 w-4" aria-hidden="true" />
            This week
            <ChevronDown className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </section>

      {/* ── KPI Cards ────────────────────────────────────────── */}
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="Fleet metrics">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <article key={i} className="rounded-lg border bg-card p-5 shadow-sm">
                <div className="mb-5 flex items-start justify-between">
                  <Skeleton className="size-10 rounded-md" />
                  <Skeleton className="h-4 w-4" />
                </div>
                <Skeleton className="h-4 w-24 mb-2" />
                <div className="flex items-end justify-between gap-2">
                  <Skeleton className="h-7 w-16" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </article>
            ))
          : currentKpiCards.map((card) => {
          const Icon = card.icon;
          return (
            <article key={card.label} className="rounded-lg border bg-card p-5 shadow-sm hover:border-primary/30 transition-colors">
              <div className="mb-5 flex items-start justify-between">
                <span className={`grid size-10 place-items-center rounded-md ${card.iconClass}`}>
                  <Icon width={20} height={20} aria-hidden="true" />
                </span>
                <Ellipsis width={18} height={18} className="text-muted-foreground" aria-hidden="true" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">{card.label}</p>
              <div className="mt-1 flex items-end justify-between gap-2">
                <p className="font-display text-2xl font-bold">{card.value}</p>
                <p className="text-right text-xs text-muted-foreground">{card.sub}</p>
              </div>
            </article>
          );
        })}
      </section>

      {/* ── Chart + Map ──────────────────────────────────────── */}
      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.5fr)_minmax(330px,1fr)]">

        {/* Fleet utilization chart */}
        <article className="rounded-lg border bg-card p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-display font-semibold">Fleet utilization</h2>
              <p className="mt-1 text-xs text-muted-foreground">Active vehicle rate across the week</p>
            </div>
            <span className="rounded-md bg-success-soft px-2 py-1 text-xs font-bold text-success">+4.2%</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={currentUtilData} margin={{ top: 0, right: 0, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="utilFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary, #0066B3)" stopOpacity={0.28} />
                    <stop offset="100%" stopColor="var(--color-primary, #0066B3)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--recharts-grid, rgba(100,116,139,0.15))" vertical={false} />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 11, fill: 'var(--recharts-axis, #64748b)' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[50, 100]}
                  tickFormatter={(v) => `${v}%`}
                  tick={{ fontSize: 11, fill: 'var(--recharts-axis, #64748b)' }}
                  axisLine={false}
                  tickLine={false}
                  ticks={[50, 65, 80, 100]}
                />
                <Tooltip
                  contentStyle={{
                    background: 'var(--recharts-tooltip-bg, #1e293b)',
                    border: '1px solid var(--recharts-tooltip-border, rgba(100,116,139,0.2))',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: 'var(--recharts-tooltip-color, #f8fafc)',
                  }}
                  formatter={(v: any) => [`${v}%`, 'Utilization']}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(211 100% 45%)"
                  strokeWidth={2.5}
                  fill="url(#utilFill)"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </article>

        {/* Live fleet map */}
        <article className="overflow-hidden rounded-lg border bg-card shadow-sm">
          <div className="flex items-center justify-between border-b p-5">
            <div>
              <h2 className="font-display font-semibold">Live fleet</h2>
              <p className="mt-1 text-xs text-muted-foreground">187 vehicles currently active</p>
            </div>
            <button className="inline-flex items-center gap-2 h-8 rounded-md px-3 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground text-xs font-medium transition-colors">
              <Map className="h-4 w-4" aria-hidden="true" />
              View map
            </button>
          </div>
          <div className="map-grid relative h-64 overflow-hidden bg-map">
            {/* Road lines */}
            <div className="absolute left-[8%] top-[28%] h-1 w-[85%] rotate-12 rounded-full bg-card/90" />
            <div className="absolute left-[35%] top-[5%] h-[92%] w-1 -rotate-12 rounded-full bg-card/90" />
            <div className="absolute right-[8%] top-[55%] h-1 w-[60%] rounded-full bg-card/90" style={{ transform: 'rotate(-25deg)' }} />
            {/* Vehicle pins */}
            {MAP_PINS.map((pin, i) => (
              <span
                key={i}
                className={`absolute grid size-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-card shadow-md ${
                  pin.warn ? 'bg-warning text-foreground' : 'bg-primary text-primary-foreground'
                }`}
                style={{ left: pin.left, top: pin.top }}
              >
                <Truck width={14} height={14} aria-hidden="true" />
              </span>
            ))}
            {/* Live badge */}
            <span className="absolute bottom-3 left-3 flex items-center gap-2 rounded-md bg-card px-2.5 py-1.5 text-[10px] font-semibold shadow">
              <span className="size-2 rounded-full bg-success animate-pulse-dot" />
              Updated just now
            </span>
          </div>
        </article>
      </section>

      {/* ── Vehicle Activity + Attention Needed ──────────────── */}
      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.5fr)_minmax(330px,1fr)]">

        {/* Vehicle activity table */}
        <article className="overflow-hidden rounded-lg border bg-card shadow-sm">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b p-5">
            <div>
              <h2 className="font-display font-semibold">Vehicle activity</h2>
              <p className="mt-1 text-xs text-muted-foreground">Latest status across your fleet</p>
            </div>
            <button className="inline-flex items-center gap-2 h-8 rounded-md px-3 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground text-xs font-medium transition-colors">
              <Download className="h-4 w-4" aria-hidden="true" />
              Export
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="bg-muted/60 text-[11px] uppercase text-muted-foreground">
                <tr>
                  {['Vehicle / driver', 'Status', 'Location', 'Next stop', ''].map(h => (
                    <th key={h} className="px-5 py-3 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentVehicles.map((v) => (
                  <tr key={v.id} className="border-t hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-semibold">{v.id}</p>
                      <p className="text-xs text-muted-foreground">{v.driver}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 rounded px-2 py-1 text-xs font-semibold ${v.statusClass}`}>
                        <span className="size-1.5 rounded-full bg-current" />
                        {v.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground">{v.location}</td>
                    <td className="px-5 py-3.5">
                      <span className="flex items-center gap-1.5">
                        <Clock3 width={14} height={14} className="text-muted-foreground" aria-hidden="true" />
                        {v.next}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        className="inline-flex items-center justify-center h-9 w-9 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                        aria-label={`Actions for ${v.id}`}
                      >
                        <Ellipsis width={18} height={18} aria-hidden="true" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        {/* Attention needed */}
        <article className="overflow-hidden rounded-lg border bg-card shadow-sm">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b p-5">
            <div>
              <h2 className="font-display font-semibold">Attention needed</h2>
              <p className="mt-1 text-xs text-muted-foreground">3 items require review</p>
            </div>
            <span className="grid size-9 place-items-center rounded-lg bg-warning-soft">
              <AlertTriangle width={18} height={18} className="text-warning" aria-hidden="true" />
            </span>
          </div>
          <ul className="divide-y divide-border">
            {currentAlerts.map((alert, i) => {
              const Icon = alert.icon;
              return (
                <li key={i} className="flex items-center gap-3 p-5 hover:bg-muted/30 transition-colors">
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-muted">
                    <Icon width={16} height={16} className="text-muted-foreground" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold truncate">{alert.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{alert.body}</p>
                  </div>
                  <span className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold ${alert.levelClass}`}>
                    {alert.level}
                  </span>
                </li>
              );
            })}
          </ul>
          <div className="p-5 pt-0">
            <button className="mt-4 w-full rounded-md border border-input bg-background py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors shadow-sm">
              View all alerts
            </button>
          </div>
        </article>
      </section>
    </>
  );
}
