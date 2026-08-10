import { prisma } from '../../database/prisma.js';
import type { VehicleStatus } from '@prisma/client';

// ── Helper: KPI stat shape ───────────────────────────────────────────────
function kpi(value: string | number, sub: string) {
  return { value, sub };
}

export class DashboardService {
  /**
   * Returns KPI card data for the dashboard header strip.
   * Shape matches the frontend DashboardSummary interface exactly.
   */
  async getSummary(companyId: string) {
    const [
      totalVehicles,
      availableVehicles,
      vehiclesInMaintenance,
      vehiclesOnTrip,
      fuelLogs,
      prevWeekFuelLogs,
      newVehiclesThisMonth,
      needsAttention,
      activeTrips,
      pendingTrips,
      driversOnDuty,
      totalDrivers,
    ] = await Promise.all([
      prisma.vehicle.count({ where: { companyId, deletedAt: null } }),
      prisma.vehicle.count({ where: { companyId, status: 'AVAILABLE', deletedAt: null } }),
      prisma.vehicle.count({ where: { companyId, status: 'UNDER_MAINTENANCE', deletedAt: null } }),
      prisma.vehicle.count({ where: { companyId, status: 'IN_TRANSIT', deletedAt: null } }),
      prisma.fuelLog.aggregate({
        _avg: { efficiency: true },
        where: { companyId, deletedAt: null, fuelDate: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
      }),
      prisma.fuelLog.aggregate({
        _avg: { efficiency: true },
        where: {
          companyId,
          deletedAt: null,
          fuelDate: { gte: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
      }),
      prisma.vehicle.count({
        where: { companyId, deletedAt: null, createdAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } },
      }),
      prisma.maintenanceLog.count({ where: { companyId, status: { in: ['IN_PROGRESS', 'WAITING_FOR_PARTS'] }, deletedAt: null } }),
      prisma.trip.count({ where: { companyId, status: { in: ['DISPATCHED', 'IN_PROGRESS'] }, deletedAt: null } }),
      prisma.trip.count({ where: { companyId, status: 'DRAFT', deletedAt: null } }),
      prisma.driver.count({ where: { companyId, status: 'ON_TRIP', deletedAt: null } }),
      prisma.driver.count({ where: { companyId, deletedAt: null } }),
    ]);

    const utilPct = totalVehicles > 0 ? ((vehiclesOnTrip / totalVehicles) * 100).toFixed(1) : '0.0';
    const currentMpg = fuelLogs._avg?.efficiency ?? 8.4;
    const prevMpg = prevWeekFuelLogs._avg?.efficiency ?? 8.2;
    const mpgDelta = currentMpg - prevMpg;
    const mpgSign = mpgDelta >= 0 ? '+' : '';

    // Fallback to realistic demo data when DB is empty
    if (totalVehicles === 0) {
      return {
        totalVehicles: kpi(248, '+6 this month'),
        availableVehicles: kpi(187, 'ready for dispatch'),
        activeVehicles: kpi(32, '75.4% utilization'),
        inMaintenance: kpi(12, '3 need attention'),
        fuelEfficiency: kpi('8.4 km/L', '+2.1% vs last week'),
        activeTrips: kpi(28, '4 dispatched today'),
        pendingTrips: kpi(14, 'awaiting dispatch'),
        driversOnDuty: kpi(32, `of 89 total drivers`),
        fleetUtilization: kpi('75.4%', 'active vehicles'),
      };
    }

    return {
      totalVehicles: kpi(totalVehicles, `+${newVehiclesThisMonth} this month`),
      availableVehicles: kpi(availableVehicles, 'ready for dispatch'),
      activeVehicles: kpi(vehiclesOnTrip, `${utilPct}% utilization`),
      inMaintenance: kpi(vehiclesInMaintenance, `${needsAttention} need attention`),
      fuelEfficiency: kpi(`${currentMpg.toFixed(1)} km/L`, `${mpgSign}${mpgDelta.toFixed(1)}% vs last week`),
      activeTrips: kpi(activeTrips, 'dispatched or in progress'),
      pendingTrips: kpi(pendingTrips, 'awaiting dispatch'),
      driversOnDuty: kpi(driversOnDuty, `of ${totalDrivers} total drivers`),
      fleetUtilization: kpi(`${utilPct}%`, 'active vehicles'),
    };
  }

  /**
   * Returns fleet dashboard panel data:
   *  - Weekly utilization chart data
   *  - Vehicle activity table rows
   *  - Alert list items
   */
  async getFleetDashboard(companyId: string) {
    const [activeVehicles, activeTrips, maintenanceDue] = await Promise.all([
      prisma.vehicle.findMany({
        where: { companyId, deletedAt: null },
        orderBy: { updatedAt: 'desc' },
        take: 6,
      }),
      prisma.trip.findMany({
        where: { companyId, status: 'IN_PROGRESS', deletedAt: null },
        include: {
          driver: { include: { user: { select: { firstName: true, lastName: true } } } },
          vehicle: { select: { id: true } },
        },
      }),
      prisma.maintenanceLog.findMany({
        where: { companyId, status: { in: ['SCHEDULED', 'IN_PROGRESS'] }, deletedAt: null },
        include: { vehicle: { select: { plateNumber: true } } },
        take: 3,
      }),
    ]);

    // Build a vehicleId → trip driver lookup
    const tripByVehicle = new Map<string, typeof activeTrips[0]>();
    for (const t of activeTrips) {
      if (t.vehicle?.id) {
        tripByVehicle.set(t.vehicle.id, t);
      }
    }

    // --- Utilization chart data (last 7 days) ---
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const utilizationData = days.map((day) => ({
      day,
      value: Math.floor(Math.random() * 25) + 65, // placeholder until telemetry is wired
    }));

    // --- Vehicle activity rows ---
    const statusMap: Record<VehicleStatus, { label: string; cls: string }> = {
      AVAILABLE: { label: 'Idle', cls: 'bg-warning-soft text-warning' },
      IN_TRANSIT: { label: 'On route', cls: 'bg-success-soft text-success' },
      UNDER_MAINTENANCE: { label: 'In service', cls: 'bg-secondary text-foreground' },
      OUT_OF_SERVICE: { label: 'Service due', cls: 'bg-destructive text-destructive-foreground' },
      DECOMMISSIONED: { label: 'Decommissioned', cls: 'bg-secondary text-muted-foreground' },
    };

    const vehicles = activeVehicles.map((v) => {
      const sm = statusMap[v.status] ?? { label: v.status, cls: 'bg-secondary text-foreground' };
      const trip = tripByVehicle.get(v.id);
      const driver = trip?.driver?.user
        ? `${trip.driver.user.firstName} ${trip.driver.user.lastName[0]}.`
        : '—';
      return {
        id: v.plateNumber,
        driver,
        status: sm.label,
        statusClass: sm.cls,
        location: '—',
        next: '—',
      };
    });

    // --- Alert list ---
    const alerts = maintenanceDue.map((m) => ({
      iconName: 'Wrench',
      title: `${m.vehicle.plateNumber} service ${m.status === 'SCHEDULED' ? 'scheduled' : 'in progress'}`,
      body: m.description ?? 'Maintenance required',
      level: m.status === 'IN_PROGRESS' ? 'High' : 'Medium',
      levelClass:
        m.status === 'IN_PROGRESS'
          ? 'bg-destructive text-destructive-foreground'
          : 'bg-warning text-foreground',
    }));

    // Fallback to demo data when DB is empty
    if (vehicles.length === 0) {
      return {
        utilizationData: [
          { day: 'Mon', value: 72 },
          { day: 'Tue', value: 78 },
          { day: 'Wed', value: 75 },
          { day: 'Thu', value: 88 },
          { day: 'Fri', value: 85 },
          { day: 'Sat', value: 74 },
          { day: 'Sun', value: 79 },
        ],
        vehicles: [
          { id: 'FT-2048', driver: 'Maya Chen', status: 'On route', statusClass: 'bg-success-soft text-success', location: 'I-80 · Oakland', next: '14 min' },
          { id: 'FT-1832', driver: 'Jon Bell', status: 'Idle', statusClass: 'bg-warning-soft text-warning', location: 'Depot 04 · Fremont', next: '42 min' },
          { id: 'FT-2175', driver: 'A. Rivera', status: 'On route', statusClass: 'bg-success-soft text-success', location: 'US-101 · San Jose', next: '26 min' },
          { id: 'FT-1951', driver: 'Sam Okafor', status: 'Service due', statusClass: 'bg-destructive text-destructive-foreground', location: 'Depot 02 · Richmond', next: '—' },
        ],
        alerts: [
          { iconName: 'Wrench', title: 'FT-1951 service overdue', body: 'Oil service exceeded by 240 mi', level: 'High', levelClass: 'bg-destructive text-destructive-foreground' },
          { iconName: 'Fuel', title: 'Unusual fuel consumption', body: 'FT-1784 used 18% above baseline', level: 'Medium', levelClass: 'bg-warning text-foreground' },
          { iconName: 'Shield', title: 'Driver document expiring', body: 'Maya Chen · license in 12 days', level: 'Review', levelClass: 'bg-success-soft text-success' },
        ],
      };
    }

    return { utilizationData, vehicles, alerts };
  }

  /**
   * Returns data for the Fleet Status chart
   */
  async getFleetStatus(companyId: string) {
    const statuses = await prisma.vehicle.groupBy({
      by: ['status'],
      where: { companyId, deletedAt: null },
      _count: { status: true },
    });

    if (statuses.length === 0) return [];

    const colorMap: Record<VehicleStatus, string> = {
      AVAILABLE: '#10b981',
      IN_TRANSIT: '#3b82f6',
      UNDER_MAINTENANCE: '#f59e0b',
      OUT_OF_SERVICE: '#ef4444',
      DECOMMISSIONED: '#6b7280',
    };

    return statuses.map((s: any) => ({
      name: s.status.replace('_', ' '),
      value: s._count.status,
      color: colorMap[s.status as VehicleStatus] || '#cbd5e1',
    }));
  }

  async getTripsData(companyId: string) {
    const tripCount = await prisma.trip.count({ where: { companyId, deletedAt: null } });
    if (tripCount === 0) return { status: [], monthly: [] };
    return { status: [], monthly: [] };
  }

  async getExpensesData(companyId: string) {
    const invoiceCount = await prisma.invoice.count({ where: { companyId, deletedAt: null } });
    if (invoiceCount === 0) return [];
    return [];
  }

  async getMaintenanceData(companyId: string) {
    const logCount = await prisma.maintenanceLog.count({ where: { companyId } });
    if (logCount === 0) return [];
    return [];
  }

  async getRecentActivities(companyId: string) {
    const activities = await prisma.auditLog.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
    if (activities.length === 0) return [];
    return activities.map((a: any) => ({
      id: a.id,
      type: a.entityType,
      title: `${a.entityType} ${a.action}`,
      description: `Action ${a.action} performed on ${a.entityType}`,
      time: a.createdAt.toISOString(),
      icon: 'Activity',
    }));
  }

  async getNotifications(companyId: string) {
    const notifications = await prisma.notification.findMany({
      where: { companyId, isRead: false },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });
    if (notifications.length === 0) return [];
    return notifications;
  }
}

export const dashboardService = new DashboardService();
