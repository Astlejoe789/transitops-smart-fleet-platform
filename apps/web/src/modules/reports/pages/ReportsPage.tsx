import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Download, FileText, Fuel, Wrench, Receipt, Users, Truck, Loader2 } from 'lucide-react';
import { reportsApi, type ReportsSummary, type ReportItem } from '@/api/reports.api';
import { useToast } from '@/components/ui/Toast';

const REPORTS = [
  {
    id: 'fuel-efficiency',
    title: 'Fuel Efficiency Report',
    desc: 'Average km/L per vehicle, fuel cost per trip, and top/bottom performers.',
    icon: Fuel,
    colorClass: 'text-primary',
    bgClass: 'bg-primary/10',
    indicatorClass: 'bg-primary',
    metrics: ['Avg. Efficiency: 7.2 km/L', 'Best Vehicle: GJ-01-GH-3456 (9.1 km/L)', 'Total Fuel Cost: ₹24,500 MTD'],
  },
  {
    id: 'vehicle-roi',
    title: 'Vehicle ROI Report',
    desc: 'Revenue vs cost per vehicle — identify high-performers and underutilized assets.',
    icon: TrendingUp,
    colorClass: 'text-success',
    bgClass: 'bg-success/10',
    indicatorClass: 'bg-success',
    metrics: ['Top Earner: MH-12-AB-5678', 'Revenue/Cost Ratio: 2.8×', 'Retired Fleet Cost: ₹0'],
  },
  {
    id: 'operational-cost',
    title: 'Operational Cost Report',
    desc: 'Full breakdown of fuel, maintenance, tolls, and other expenses by category.',
    icon: Receipt,
    colorClass: 'text-destructive',
    bgClass: 'bg-destructive/10',
    indicatorClass: 'bg-destructive',
    metrics: ['Total Op Cost (MTD): ₹68,200', 'Fuel: 36%', 'Maintenance: 48%', 'Tolls & Others: 16%'],
  },
  {
    id: 'driver-performance',
    title: 'Driver Performance Report',
    desc: 'Trip completion rate, fuel efficiency, violations, and overall ratings per driver.',
    icon: Users,
    colorClass: 'text-[#8B5CF6]',
    bgClass: 'bg-[#8B5CF6]/10',
    indicatorClass: 'bg-[#8B5CF6]',
    metrics: ['Top Driver: Priya Nair (98% rating)', 'Avg. Trips/Driver: 14/month', 'Violations: 0'],
  },
  {
    id: 'maintenance-cost',
    title: 'Maintenance Cost Report',
    desc: 'Monthly and annual maintenance expenditure per vehicle, by type (preventive vs corrective).',
    icon: Wrench,
    colorClass: 'text-warning',
    bgClass: 'bg-warning/10',
    indicatorClass: 'bg-warning',
    metrics: ['Avg Maintenance/Vehicle: ₹8,200', 'Preventive vs Corrective: 68/32%', 'Total (MTD): ₹1,24,500'],
  },
  {
    id: 'fleet-utilization',
    title: 'Fleet Utilization Report',
    desc: 'Utilization rate, idle time, and availability trends across the entire fleet over time.',
    icon: Truck,
    colorClass: 'text-[#3B82F6]',
    bgClass: 'bg-[#3B82F6]/10',
    indicatorClass: 'bg-[#3B82F6]',
    metrics: ['Avg Utilization: 82%', 'Peak Day: Tuesday', 'Lowest: Sunday (41%)'],
  },
];

export default function ReportsPage() {
  const [summary, setSummary] = useState<ReportsSummary | null>(null);
  const [reportsData, setReportsData] = useState<ReportItem[] | null>(null);
  const [_loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState<string | null>(null);
  const { success, error: toastError } = useToast();

  useEffect(() => {
    setLoading(true);
    Promise.all([
      reportsApi.getSummary().then(setSummary),
      reportsApi.getReportsList().then(setReportsData),
    ]).finally(() => setLoading(false));
  }, []);

  const handleExport = async (format: 'csv' | 'pdf', id?: string) => {
    const key = id ?? 'all';
    setExporting(key);
    try {
      const blob = await reportsApi.exportReport(format, id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = id ? `report-${id}.${format}` : `reports-export.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      success('Export ready', `Your ${format.toUpperCase()} file has been downloaded.`);
    } catch {
      toastError('Export failed', 'Could not generate the export. Please try again.');
    } finally {
      setExporting(null);
    }
  };

  const iconMap: Record<string, any> = { Fuel, TrendingUp, Receipt, Users, Wrench, Truck };
  const currentReports = reportsData?.map(r => ({
    ...r,
    icon: iconMap[r.iconName] || FileText
  })) || REPORTS;


  return (
    <div className="space-y-5 pb-8">
      {/* Header */}
      <section className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
        <div>
          <p className="mb-1 text-sm text-muted-foreground">Analytics & Insights</p>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">Reports</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleExport('pdf')}
            disabled={!!exporting}
            className="inline-flex items-center gap-2 h-9 px-4 rounded-md border border-input bg-background shadow-sm hover:bg-accent text-sm font-semibold transition-colors disabled:opacity-60"
          >
            {exporting === 'all' ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
            Export PDF
          </button>
          <button
            onClick={() => handleExport('csv')}
            disabled={!!exporting}
            className="inline-flex items-center gap-2 h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 shadow-sm transition-opacity disabled:opacity-60"
          >
            {exporting === 'all' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            Export CSV
          </button>
        </div>
      </section>

      {/* Monthly KPI Strip */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-0 rounded-lg overflow-hidden border border-border bg-card shadow-sm divide-y md:divide-y-0 md:divide-x divide-border">
        <div className="p-6 text-center">
          <div className="text-3xl font-extrabold font-display">{summary?.operationalCost.value || '₹68,200'}</div>
          <div className="text-sm text-muted-foreground mt-1">Total Operational Cost (MTD)</div>
          <div className="text-xs text-muted-foreground/60 mt-0.5">{summary?.operationalCost.sub || '+12% vs last month'}</div>
        </div>
        <div className="p-6 text-center">
          <div className="text-3xl font-extrabold font-display">{summary?.utilizationRate.value || '82%'}</div>
          <div className="text-sm text-muted-foreground mt-1">Fleet Utilization Rate</div>
          <div className="text-xs text-muted-foreground/60 mt-0.5">{summary?.utilizationRate.sub || '+5% vs last month'}</div>
        </div>
        <div className="p-6 text-center">
          <div className="text-3xl font-extrabold font-display">{summary?.fuelEfficiency.value || '7.2 km/L'}</div>
          <div className="text-sm text-muted-foreground mt-1">Avg. Fuel Efficiency</div>
          <div className="text-xs text-muted-foreground/60 mt-0.5">{summary?.fuelEfficiency.sub || '+0.3 vs last month'}</div>
        </div>
      </section>

      {/* Report Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {currentReports.map(report => {
          const Icon = report.icon;
          return (
            <article key={report.id} className="group relative p-5 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors shadow-sm overflow-hidden flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${report.bgClass}`}>
                  <Icon className={`h-5 w-5 ${report.colorClass}`} aria-hidden="true" />
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleExport('csv', report.id)} className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors" title="Export CSV">
                    <Download className="h-4 w-4" />
                  </button>
                  <button className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors" title="View Report">
                    <BarChart3 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <h3 className="text-base font-bold mb-1">{report.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4 flex-1">{report.desc}</p>
              
              <div className="space-y-1.5 mb-5">
                {report.metrics.map(m => (
                  <div key={m} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${report.indicatorClass}`} />
                    {m}
                  </div>
                ))}
              </div>
              
              <div className="pt-4 border-t border-border flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground">Last generated: Today, 08:00</span>
                <button className="text-[11px] font-bold text-primary hover:underline">Generate Now →</button>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
