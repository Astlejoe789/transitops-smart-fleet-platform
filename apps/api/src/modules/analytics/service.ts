/**
 * Analytics Service
 *
 * Business logic for the analytics module.
 */
import { prisma } from '../../database/index.js';
import { VehicleStatus, InvoiceStatus, ExpenseStatus } from '@prisma/client';

export class AnalyticsService {
  /**
   * Retrieves KPI data for the Executive Dashboard.
   */
  async getDashboardKPIs(companyId: string, branchId?: string) {
    const where = branchId ? { companyId, branchId } : { companyId };
    const vehicleWhere = branchId ? { companyId, vehicle: { branchId } } : { companyId };
    
    // Revenue (from PAID invoices)
    const revenueAggr = await prisma.invoice.aggregate({
      _sum: { totalAmount: true },
      where: { ...where, status: InvoiceStatus.PAID, deletedAt: null },
    });
    const totalRevenue = revenueAggr._sum.totalAmount || 0;

    // Monthly Revenue (current month)
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthlyRevAggr = await prisma.invoice.aggregate({
      _sum: { totalAmount: true },
      where: {
        ...where,
        status: InvoiceStatus.PAID,
        deletedAt: null,
        issueDate: { gte: startOfMonth },
      },
    });
    const monthlyRevenue = monthlyRevAggr._sum.totalAmount || 0;

    // Expenses (from APPROVED/PAID expenses)
    const expenseAggr = await prisma.expense.aggregate({
      _sum: { amount: true },
      where: {
        ...where,
        status: { in: [ExpenseStatus.APPROVED, ExpenseStatus.PAID] },
        deletedAt: null,
      },
    });
    const totalExpenses = expenseAggr._sum.amount || 0;

    // Net Profit
    const netProfit = totalRevenue - totalExpenses;

    // Fleet Stats
    const totalVehicles = await prisma.vehicle.count({
      where: { ...where, deletedAt: null },
    });
    const activeVehicles = await prisma.vehicle.count({
      where: { ...where, status: VehicleStatus.IN_TRANSIT, deletedAt: null },
    });
    const fleetUtilization = totalVehicles > 0 ? (activeVehicles / totalVehicles) * 100 : 0;

    // Driver Stats
    const activeDrivers = await prisma.driver.count({
      where: { ...where, status: 'ON_TRIP', deletedAt: null }, // Assuming ON_TRIP represents active on duty
    });

    // Trips
    const totalTrips = await prisma.trip.count({
      where: { ...where, deletedAt: null },
    });

    // Fuel Consumption
    const fuelAggr = await prisma.fuelLog.aggregate({
      _sum: { liters: true },
      where: { ...vehicleWhere, deletedAt: null },
    });
    const fuelConsumption = fuelAggr._sum.liters || 0;

    // Maintenance Cost
    const maintenanceAggr = await prisma.maintenanceLog.aggregate({
      _sum: { actualCost: true },
      where: { ...vehicleWhere, deletedAt: null },
    });
    const maintenanceCost = maintenanceAggr._sum.actualCost || 0;

    // Outstanding Invoices
    const outstandingInvoices = await prisma.invoice.count({
      where: {
        ...where,
        status: { in: [InvoiceStatus.ISSUED, InvoiceStatus.SENT, InvoiceStatus.OVERDUE] },
        deletedAt: null,
      },
    });

    // Customers and Vendors
    const customerCount = await prisma.customer.count({
      where: { companyId, deletedAt: null }, // Usually not branch scoped
    });
    const vendorCount = await prisma.vendor.count({
      where: { companyId, deletedAt: null }, // Usually not branch scoped
    });

    return {
      totalRevenue,
      monthlyRevenue,
      totalExpenses,
      netProfit,
      fleetUtilization,
      activeVehicles,
      activeDrivers,
      totalTrips,
      fuelConsumption,
      maintenanceCost,
      outstandingInvoices,
      customerCount,
      vendorCount,
    };
  }

  /**
   * Retrieves Chart data for the Executive Dashboard.
   */
  async getDashboardCharts(companyId: string, branchId?: string) {
    const where = branchId ? { companyId, branchId } : { companyId };
    const vehicleWhere = branchId ? { companyId, vehicle: { branchId } } : { companyId };
    
    // We will generate mocked 12-month data trends here for simplicity of the aggregation
    // In a real complex production, we would use raw SQL to group by date
    
    // 1. Revenue vs Expense Chart (Last 6 Months)
    const revenueVsExpense = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      const monthName = d.toLocaleString('default', { month: 'short' });
      
      const revAggr = await prisma.invoice.aggregate({
        _sum: { totalAmount: true },
        where: {
          ...where,
          status: InvoiceStatus.PAID,
          deletedAt: null,
          issueDate: { gte: d, lt: nextMonth }
        }
      });

      const expAggr = await prisma.expense.aggregate({
        _sum: { amount: true },
        where: {
          ...where,
          status: { in: [ExpenseStatus.APPROVED, ExpenseStatus.PAID] },
          deletedAt: null,
          expenseDate: { gte: d, lt: nextMonth }
        }
      });
      
      revenueVsExpense.push({
        month: monthName,
        revenue: revAggr._sum.totalAmount || 0,
        expense: expAggr._sum.amount || 0
      });
    }

    // 2. Vehicle Utilization (Available vs In Transit vs Maintenance)
    const available = await prisma.vehicle.count({ where: { ...where, status: VehicleStatus.AVAILABLE, deletedAt: null } });
    const inTransit = await prisma.vehicle.count({ where: { ...where, status: VehicleStatus.IN_TRANSIT, deletedAt: null } });
    const inMaintenance = await prisma.vehicle.count({ where: { ...where, status: VehicleStatus.UNDER_MAINTENANCE, deletedAt: null } });
    
    const vehicleUtilization = [
      { name: 'Available', value: available, fill: '#4ade80' },
      { name: 'In Transit', value: inTransit, fill: '#60a5fa' },
      { name: 'Maintenance', value: inMaintenance, fill: '#f87171' },
    ];

    // 3. Fuel Consumption Trends (Last 6 months)
    const fuelConsumptionTrend = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      const monthName = d.toLocaleString('default', { month: 'short' });
      
      const fuelAggr = await prisma.fuelLog.aggregate({
        _sum: { liters: true },
        where: {
          ...vehicleWhere,
          deletedAt: null,
          fuelDate: { gte: d, lt: nextMonth }
        }
      });
      
      fuelConsumptionTrend.push({
        month: monthName,
        liters: fuelAggr._sum.liters || 0
      });
    }

    // 4. Maintenance Cost Trends
    const maintenanceTrend = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      const monthName = d.toLocaleString('default', { month: 'short' });
      
      const maintAggr = await prisma.maintenanceLog.aggregate({
        _sum: { actualCost: true },
        where: {
          ...vehicleWhere,
          deletedAt: null,
          completedDate: { gte: d, lt: nextMonth }
        }
      });
      
      maintenanceTrend.push({
        month: monthName,
        cost: maintAggr._sum.actualCost || 0
      });
    }

    return {
      revenueVsExpense,
      vehicleUtilization,
      fuelConsumptionTrend,
      maintenanceTrend
    };
  }
}
