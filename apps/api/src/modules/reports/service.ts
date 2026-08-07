/**
 * Reports Service
 *
 * Business logic for the reports module.
 */
import { prisma } from '../../database/index.js';
import type { Prisma } from '@prisma/client';

// ── CSV helpers ─────────────────────────────────────────────────────────────
function toCsv(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return '';
  const headers = Object.keys(rows[0]);
  const lines = [headers.join(',')];
  for (const row of rows) {
    lines.push(headers.map((h) => JSON.stringify(row[h] ?? '')).join(','));
  }
  return lines.join('\n');
}

export class ReportsService {
  /**
   * Fleet Report
   */
  async getFleetReport(companyId: string, filters: any = {}) {
    const where: Prisma.VehicleWhereInput = { companyId, deletedAt: null };
    if (filters.branchId) where.branchId = filters.branchId;
    if (filters.status) where.status = filters.status;
    
    return prisma.vehicle.findMany({
      where,
      include: {
        branch: { select: { name: true } },
      },
      orderBy: { plateNumber: 'asc' },
    });
  }

  /**
   * Drivers Report
   */
  async getDriversReport(companyId: string, filters: any = {}) {
    const where: Prisma.DriverWhereInput = { companyId, deletedAt: null };
    if (filters.branchId) where.branchId = filters.branchId;
    if (filters.status) where.status = filters.status;

    return prisma.driver.findMany({
      where,
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Trips Report
   */
  async getTripsReport(companyId: string, filters: any = {}) {
    const where: Prisma.TripWhereInput = { companyId, deletedAt: null };
    if (filters.branchId) where.branchId = filters.branchId;
    if (filters.status) where.status = filters.status;
    if (filters.startDate && filters.endDate) {
      where.scheduledStart = {
        gte: new Date(filters.startDate),
        lte: new Date(filters.endDate),
      };
    }

    return prisma.trip.findMany({
      where,
      include: {
        driver: { include: { user: { select: { firstName: true, lastName: true } } } },
        vehicle: { select: { plateNumber: true, make: true, model: true } },
        customer: { select: { name: true } }
      },
      orderBy: { scheduledStart: 'desc' },
    });
  }

  /**
   * Fuel Report
   */
  async getFuelReport(companyId: string, filters: any = {}) {
    const where: Prisma.FuelLogWhereInput = { companyId, deletedAt: null };
    if (filters.vehicleId) where.vehicleId = filters.vehicleId;
    if (filters.startDate && filters.endDate) {
      where.fuelDate = {
        gte: new Date(filters.startDate),
        lte: new Date(filters.endDate),
      };
    }

    return prisma.fuelLog.findMany({
      where,
      include: {
        vehicle: { select: { plateNumber: true } },
        driver: { include: { user: { select: { firstName: true, lastName: true } } } },
      },
      orderBy: { fuelDate: 'desc' },
    });
  }

  /**
   * Maintenance Report
   */
  async getMaintenanceReport(companyId: string, filters: any = {}) {
    const where: Prisma.MaintenanceLogWhereInput = { companyId, deletedAt: null };
    if (filters.vehicleId) where.vehicleId = filters.vehicleId;
    if (filters.status) where.status = filters.status;
    if (filters.startDate && filters.endDate) {
      where.scheduledDate = {
        gte: new Date(filters.startDate),
        lte: new Date(filters.endDate),
      };
    }

    return prisma.maintenanceLog.findMany({
      where,
      include: {
        vehicle: { select: { plateNumber: true } },
        vendor: { select: { name: true } },
      },
      orderBy: { scheduledDate: 'desc' },
    });
  }

  /**
   * Expense Report
   */
  async getExpenseReport(companyId: string, filters: any = {}) {
    const where: Prisma.ExpenseWhereInput = { companyId, deletedAt: null };
    if (filters.category) where.category = filters.category;
    if (filters.status) where.status = filters.status;
    if (filters.startDate && filters.endDate) {
      where.expenseDate = {
        gte: new Date(filters.startDate),
        lte: new Date(filters.endDate),
      };
    }

    return prisma.expense.findMany({
      where,
      include: {
        vehicle: { select: { plateNumber: true } },
      },
      orderBy: { expenseDate: 'desc' },
    });
  }

  /**
   * Customers Report
   */
  async getCustomersReport(companyId: string, filters: any = {}) {
    const where: Prisma.CustomerWhereInput = { companyId, deletedAt: null };
    if (filters.status) where.status = filters.status;

    return prisma.customer.findMany({
      where,
      orderBy: { name: 'asc' },
    });
  }

  /**
   * Vendors Report
   */
  async getVendorsReport(companyId: string, filters: any = {}) {
    const where: Prisma.VendorWhereInput = { companyId, deletedAt: null };
    if (filters.status) where.status = filters.status;

    return prisma.vendor.findMany({
      where,
      orderBy: { name: 'asc' },
    });
  }

  /**
   * Billing Report
   */
  async getBillingReport(companyId: string, filters: any = {}) {
    const where: Prisma.InvoiceWhereInput = { companyId, deletedAt: null };
    if (filters.status) where.status = filters.status;
    if (filters.customerId) where.customerId = filters.customerId;
    if (filters.startDate && filters.endDate) {
      where.issueDate = {
        gte: new Date(filters.startDate),
        lte: new Date(filters.endDate),
      };
    }

    return prisma.invoice.findMany({
      where,
      include: {
        customer: { select: { name: true } },
      },
      orderBy: { issueDate: 'desc' },
    });
  }

  /**
   * Summary KPI strip for the Reports page header.
   * Falls back to demo data when DB records are sparse.
   */
  async getSummary(companyId: string) {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [expenseAgg, fuelAgg, vehicleCount, activeCount] = await Promise.all([
      prisma.expense.aggregate({
        _sum: { amount: true },
        where: { companyId, deletedAt: null, expenseDate: { gte: monthStart } },
      }),
      prisma.fuelLog.aggregate({
        _avg: { efficiency: true },
        where: { companyId, deletedAt: null },
      }),
      prisma.vehicle.count({ where: { companyId, deletedAt: null } }),
      prisma.vehicle.count({ where: { companyId, status: 'IN_TRANSIT', deletedAt: null } }),
    ]);

    const opCost = expenseAgg._sum.amount ?? 0;
    const utilPct = vehicleCount > 0 ? Math.round((activeCount / vehicleCount) * 100) : 82;
    const avgFuel = fuelAgg._avg?.efficiency ?? 7.2;

    // Use demo data if everything is zero (empty DB)
    if (opCost === 0 && vehicleCount === 0) {
      return {
        operationalCost: { value: '₹68,200', sub: '+12% vs last month' },
        utilizationRate: { value: '82%', sub: '+5% vs last month' },
        fuelEfficiency: { value: '7.2 km/L', sub: '+0.3 vs last month' },
      };
    }

    return {
      operationalCost: {
        value: `₹${opCost.toLocaleString('en-IN')}`,
        sub: 'Month-to-date expenses',
      },
      utilizationRate: {
        value: `${utilPct}%`,
        sub: `${activeCount} of ${vehicleCount} vehicles active`,
      },
      fuelEfficiency: {
        value: `${avgFuel.toFixed(1)} km/L`,
        sub: 'Average across all vehicles',
      },
    };
  }

  /**
   * Report card list for the Reports page grid.
   * Returns static metadata — metrics are the descriptive defaults.
   */
  async getReportsList(_companyId: string) {
    return [
      {
        id: 'fuel-efficiency',
        title: 'Fuel Efficiency Report',
        desc: 'Average km/L per vehicle, fuel cost per trip, and top/bottom performers.',
        iconName: 'Fuel',
        colorClass: 'text-primary',
        bgClass: 'bg-primary/10',
        indicatorClass: 'bg-primary',
        metrics: ['Avg. Efficiency: 7.2 km/L', 'Best Vehicle: GJ-01-GH-3456 (9.1 km/L)', 'Total Fuel Cost: ₹24,500 MTD'],
      },
      {
        id: 'vehicle-roi',
        title: 'Vehicle ROI Report',
        desc: 'Revenue vs cost per vehicle — identify high-performers and underutilized assets.',
        iconName: 'TrendingUp',
        colorClass: 'text-success',
        bgClass: 'bg-success/10',
        indicatorClass: 'bg-success',
        metrics: ['Top Earner: MH-12-AB-5678', 'Revenue/Cost Ratio: 2.8×', 'Retired Fleet Cost: ₹0'],
      },
      {
        id: 'operational-cost',
        title: 'Operational Cost Report',
        desc: 'Full breakdown of fuel, maintenance, tolls, and other expenses by category.',
        iconName: 'Receipt',
        colorClass: 'text-destructive',
        bgClass: 'bg-destructive/10',
        indicatorClass: 'bg-destructive',
        metrics: ['Total Op Cost (MTD): ₹68,200', 'Fuel: 36%', 'Maintenance: 48%', 'Tolls & Others: 16%'],
      },
      {
        id: 'driver-performance',
        title: 'Driver Performance Report',
        desc: 'Trip completion rate, fuel efficiency, violations, and overall ratings per driver.',
        iconName: 'Users',
        colorClass: 'text-[#8B5CF6]',
        bgClass: 'bg-[#8B5CF6]/10',
        indicatorClass: 'bg-[#8B5CF6]',
        metrics: ['Top Driver: Priya Nair (98% rating)', 'Avg. Trips/Driver: 14/month', 'Violations: 0'],
      },
      {
        id: 'maintenance-cost',
        title: 'Maintenance Cost Report',
        desc: 'Monthly and annual maintenance expenditure per vehicle, by type (preventive vs corrective).',
        iconName: 'Wrench',
        colorClass: 'text-warning',
        bgClass: 'bg-warning/10',
        indicatorClass: 'bg-warning',
        metrics: ['Avg Maintenance/Vehicle: ₹8,200', 'Preventive vs Corrective: 68/32%', 'Total (MTD): ₹1,24,500'],
      },
      {
        id: 'fleet-utilization',
        title: 'Fleet Utilization Report',
        desc: 'Utilization rate, idle time, and availability trends across the entire fleet over time.',
        iconName: 'Truck',
        colorClass: 'text-[#3B82F6]',
        bgClass: 'bg-[#3B82F6]/10',
        indicatorClass: 'bg-[#3B82F6]',
        metrics: ['Avg Utilization: 82%', 'Peak Day: Tuesday', 'Lowest: Sunday (41%)'],
      },
    ];
  }

  /**
   * Export all data for a given format ('csv' only for now).
   */
  async exportAll(companyId: string, _format: string): Promise<{ content: string; mime: string; filename: string }> {
    const [vehicles, drivers, trips] = await Promise.all([
      prisma.vehicle.findMany({ where: { companyId, deletedAt: null }, select: { plateNumber: true, make: true, model: true, year: true, status: true } }),
      prisma.driver.findMany({ where: { companyId, deletedAt: null }, include: { user: { select: { firstName: true, lastName: true, email: true } } } }),
      prisma.trip.findMany({ where: { companyId, deletedAt: null }, select: { id: true, status: true, scheduledStart: true, scheduledEnd: true } }),
    ]);

    const rows = [
      ...vehicles.map((v) => ({ type: 'Vehicle', ref: v.plateNumber, detail: `${v.make} ${v.model} ${v.year}`, status: v.status })),
      ...drivers.map((d) => ({ type: 'Driver', ref: d.employeeId, detail: `${d.user.firstName} ${d.user.lastName}`, status: d.status })),
      ...trips.map((t) => ({ type: 'Trip', ref: t.id, detail: `${t.scheduledStart?.toISOString() ?? ''}`, status: t.status })),
    ];

    const content = toCsv(rows);
    return { content, mime: 'text/csv', filename: `transitops-export-all.csv` };
  }

  /**
   * Export data for a single report type.
   */
  async exportOne(companyId: string, reportId: string, _format: string): Promise<{ content: string; mime: string; filename: string }> {
    let rows: Record<string, unknown>[] = [];

    if (reportId === 'fuel-efficiency') {
      const logs = await prisma.fuelLog.findMany({
        where: { companyId, deletedAt: null },
        include: { vehicle: { select: { plateNumber: true } } },
        orderBy: { fuelDate: 'desc' },
      });
      rows = logs.map((l) => ({ date: l.fuelDate?.toISOString() ?? '', vehicle: l.vehicle.plateNumber, liters: l.liters, cost: l.totalCost, efficiency: l.efficiency }));
    } else if (reportId === 'operational-cost') {
      const expenses = await prisma.expense.findMany({
        where: { companyId, deletedAt: null },
        orderBy: { expenseDate: 'desc' },
      });
      rows = expenses.map((e) => ({ date: e.expenseDate?.toISOString() ?? '', category: e.category, amount: e.amount, status: e.status }));
    } else if (reportId === 'maintenance-cost') {
      const logs = await prisma.maintenanceLog.findMany({
        where: { companyId, deletedAt: null },
        include: { vehicle: { select: { plateNumber: true } } },
        orderBy: { scheduledDate: 'desc' },
      });
      rows = logs.map((m) => ({ date: m.scheduledDate?.toISOString() ?? '', vehicle: m.vehicle.plateNumber, type: m.maintenanceType, cost: m.actualCost ?? 0, status: m.status }));
    } else if (reportId === 'fleet-utilization') {
      const vehicles = await prisma.vehicle.findMany({
        where: { companyId, deletedAt: null },
      });
      rows = vehicles.map((v) => ({ plateNumber: v.plateNumber, make: v.make, model: v.model, status: v.status, odometer: v.currentOdometer }));
    } else {
      rows = [{ message: `Export for ${reportId} — connect your data source` }];
    }

    const content = toCsv(rows.length > 0 ? rows : [{ message: 'No data available' }]);
    return { content, mime: 'text/csv', filename: `report-${reportId}.csv` };
  }
}
