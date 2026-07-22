/**
 * Reports Service
 *
 * Business logic for the reports module.
 */
import { prisma } from '../../database/index.js';
import { Prisma } from '@prisma/client';

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
}
