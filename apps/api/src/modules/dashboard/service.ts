import { prisma } from '../../database/prisma.js';
import type { VehicleStatus } from '@prisma/client';

export class DashboardService {
  /**
   * Returns summary counts and metrics for the dashboard KPI cards.
   */
  async getSummary(companyId: string) {
    const [
      totalVehicles,
      availableVehicles,
      vehiclesOnTrip,
      totalDrivers,
      driversOnTrip,
      todayTrips,
      pendingInvoices,
      maintenanceDue,
      maintenanceInProgressCount,
      completedServices,
      maintenanceCostAgg,
      fuelCostAgg,
      expenseCostAgg,
    ] = await Promise.all([
      prisma.vehicle.count({ where: { companyId, deletedAt: null } }),
      prisma.vehicle.count({ where: { companyId, status: 'AVAILABLE', deletedAt: null } }),
      prisma.vehicle.count({ where: { companyId, status: 'IN_TRANSIT', deletedAt: null } }),
      prisma.driver.count({ where: { companyId, deletedAt: null } }),
      prisma.driver.count({ where: { companyId, status: 'ON_TRIP', deletedAt: null } }),
      prisma.trip.count({
        where: {
          companyId,
          scheduledStart: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lt: new Date(new Date().setHours(23, 59, 59, 999)),
          },
          deletedAt: null,
        },
      }),
      prisma.invoice.count({ where: { companyId, status: { in: ['DRAFT', 'ISSUED'] }, deletedAt: null } }),
      prisma.maintenanceLog.count({ where: { companyId, status: 'SCHEDULED', deletedAt: null } }),
      prisma.maintenanceLog.count({ where: { companyId, status: { in: ['IN_PROGRESS', 'WAITING_FOR_PARTS'] }, deletedAt: null } }),
      prisma.maintenanceLog.count({ where: { companyId, status: 'COMPLETED', deletedAt: null } }),
      prisma.maintenanceLog.aggregate({ _sum: { actualCost: true }, where: { companyId, deletedAt: null } }),
      prisma.fuelLog.aggregate({ _sum: { totalCost: true }, where: { companyId, deletedAt: null } }),
      prisma.expense.aggregate({ _sum: { amount: true }, where: { companyId, deletedAt: null, expenseDate: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } } }),
    ]);

    // Fallback to demo data if the system is completely empty
    // Removed demo data fallback

    // TODO: Aggregate actual revenue/expenses for the month
    const monthlyRevenue = 0; // Replace with actual aggregation
    const monthlyExpenses = expenseCostAgg._sum.amount || 0;
    const fuelCost = fuelCostAgg._sum.totalCost || 0;

    return {
      totalVehicles,
      availableVehicles,
      vehiclesOnTrip,
      totalDrivers,
      driversOnTrip,
      todayTrips,
      monthlyRevenue,
      monthlyExpenses,
      pendingInvoices,
      maintenanceDue,
      maintenanceInProgress: maintenanceInProgressCount,
      completedServices,
      maintenanceCost: maintenanceCostAgg._sum.actualCost || 0,
      fuelCost,
    };
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

    if (statuses.length === 0) {
      return [];
    }

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

  /**
   * Returns data for the Trips charts (status breakdown and monthly trend)
   */
  async getTripsData(companyId: string) {
    const tripCount = await prisma.trip.count({ where: { companyId, deletedAt: null } });

    if (tripCount === 0) {
      return {
        status: [],
        monthly: [],
      };
    }

    // Replace with real aggregation logic
    return {
      status: [],
      monthly: [],
    };
  }

  /**
   * Returns data for Financial charts (Revenue vs Expenses)
   */
  async getExpensesData(companyId: string) {
    const invoiceCount = await prisma.invoice.count({ where: { companyId, deletedAt: null } });

    if (invoiceCount === 0) {
      return [];
    }

    // Replace with real aggregation logic
    return [];
  }

  /**
   * Returns data for Maintenance trend chart
   */
  async getMaintenanceData(companyId: string) {
    const logCount = await prisma.maintenanceLog.count({ where: { companyId } });

    if (logCount === 0) {
      return [];
    }

    // Replace with real aggregation logic
    return [];
  }

  /**
   * Returns recent activities feed
   */
  async getRecentActivities(companyId: string) {
    const activities = await prisma.auditLog.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    if (activities.length === 0) {
      return [];
    }

    return activities.map((a: any) => ({
      id: a.id,
      type: a.entityType,
      title: `${a.entityType} ${a.action}`,
      description: `Action ${a.action} performed on ${a.entityType}`,
      time: a.createdAt.toISOString(),
      icon: 'Activity'
    }));
  }

  /**
   * Returns high-priority notifications
   */
  async getNotifications(companyId: string) {
    const notifications = await prisma.notification.findMany({
      where: { companyId, isRead: false },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    if (notifications.length === 0) {
      return [];
    }

    return notifications;
  }
}

export const dashboardService = new DashboardService();
