import { prisma } from '../../database/prisma.js';
import { VehicleStatus } from '@prisma/client';

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
    if (totalVehicles === 0 && totalDrivers === 0) {
      return {
        totalVehicles: 42,
        availableVehicles: 28,
        vehiclesOnTrip: 12,
        totalDrivers: 50,
        driversOnTrip: 12,
        todayTrips: 15,
        monthlyRevenue: 125430.5,
        monthlyExpenses: 45200.75,
        pendingInvoices: 8,
        maintenanceDue: 3,
        maintenanceInProgress: 1,
        completedServices: 12,
        maintenanceCost: 1540.5,
        fuelCost: 12450.2,
      };
    }

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
      return [
        { name: 'Available', value: 28, color: '#10b981' },
        { name: 'In Transit', value: 12, color: '#3b82f6' },
        { name: 'Maintenance', value: 2, color: '#f59e0b' },
      ];
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
        status: [
          { name: 'Completed', value: 145 },
          { name: 'In Progress', value: 12 },
          { name: 'Scheduled', value: 24 },
          { name: 'Delayed', value: 4 },
        ],
        monthly: [
          { name: 'Jan', trips: 120 },
          { name: 'Feb', trips: 132 },
          { name: 'Mar', trips: 145 },
          { name: 'Apr', trips: 160 },
          { name: 'May', trips: 155 },
          { name: 'Jun', trips: 180 },
        ],
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
      return [
        { name: 'Jan', revenue: 95000, expenses: 42000, fuel: 15000 },
        { name: 'Feb', revenue: 105000, expenses: 45000, fuel: 16500 },
        { name: 'Mar', revenue: 112000, expenses: 48000, fuel: 18000 },
        { name: 'Apr', revenue: 125000, expenses: 51000, fuel: 19500 },
        { name: 'May', revenue: 132000, expenses: 49000, fuel: 17500 },
        { name: 'Jun', revenue: 145000, expenses: 53000, fuel: 21000 },
      ];
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
      return [
        { name: 'Jan', routine: 15, repairs: 4 },
        { name: 'Feb', routine: 12, repairs: 6 },
        { name: 'Mar', routine: 18, repairs: 3 },
        { name: 'Apr', routine: 14, repairs: 5 },
        { name: 'May', routine: 16, repairs: 2 },
        { name: 'Jun', routine: 20, repairs: 7 },
      ];
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
      return [
        { id: '1', type: 'TRIP', title: 'Trip T-4092 Completed', description: 'Driver John Doe completed trip to Chicago.', time: '2 hours ago', icon: 'CheckCircle2' },
        { id: '2', type: 'VEHICLE', title: 'Vehicle Assigned', description: 'Truck TRK-042 assigned to route.', time: '3 hours ago', icon: 'Truck' },
        { id: '3', type: 'MAINTENANCE', title: 'Maintenance Scheduled', description: 'Oil change for Van VN-018.', time: '5 hours ago', icon: 'Wrench' },
        { id: '4', type: 'INVOICE', title: 'Invoice Generated', description: 'Invoice INV-2023-089 generated for ACME Corp.', time: '1 day ago', icon: 'FileText' },
        { id: '5', type: 'PAYMENT', title: 'Payment Received', description: '$4,500.00 received from Global Logistics.', time: '1 day ago', icon: 'CreditCard' },
      ];
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
      return [
        { id: '1', title: 'License Expiry', message: 'Driver Mike Smith license expires in 5 days.', severity: 'CRITICAL', time: '10 mins ago' },
        { id: '2', title: 'Insurance Expiry', message: 'Vehicle TRK-042 insurance expires next week.', severity: 'WARNING', time: '1 hour ago' },
        { id: '3', title: 'Maintenance Due', message: 'Van VN-018 is due for routine service.', severity: 'INFO', time: '2 hours ago' },
        { id: '4', title: 'Overdue Invoice', message: 'Invoice INV-2023-045 is 3 days overdue.', severity: 'WARNING', time: '1 day ago' },
      ];
    }

    return notifications;
  }
}

export const dashboardService = new DashboardService();
