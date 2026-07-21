import { prisma } from '../../database/prisma.js';
import { FuelType, PaymentMethod, AuditAction, Prisma } from '@prisma/client';
import { HttpException } from '../../shared/exceptions/http.exception.js';

export class FuelService {
  /**
   * Helper to log audit events
   */
  private async logAudit(companyId: string, userId: string, action: AuditAction, entityId: string, oldValues?: any, newValues?: any) {
    await prisma.auditLog.create({
      data: {
        companyId,
        userId,
        action,
        entityType: 'FUEL',
        entityId,
        oldValues: oldValues ? JSON.parse(JSON.stringify(oldValues)) : undefined,
        newValues: newValues ? JSON.parse(JSON.stringify(newValues)) : undefined,
      },
    });
  }

  private async generateFuelLogNumber(companyId: string): Promise<string> {
    const today = new Date();
    const prefix = `FUEL-${today.getFullYear()}${(today.getMonth() + 1).toString().padStart(2, '0')}${today.getDate().toString().padStart(2, '0')}`;
    
    const count = await prisma.fuelLog.count({
      where: {
        companyId,
        fuelLogNumber: { startsWith: prefix },
      },
    });

    return `${prefix}-${(count + 1).toString().padStart(4, '0')}`;
  }

  /**
   * Get all fuel logs with pagination and filtering
   */
  async getFuelLogs(companyId: string, query: any = {}) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.FuelLogWhereInput = {
      companyId,
      deletedAt: null,
    };

    if (query.search) {
      where.OR = [
        { fuelLogNumber: { contains: query.search, mode: 'insensitive' } },
        { stationName: { contains: query.search, mode: 'insensitive' } },
        { vehicle: { plateNumber: { contains: query.search, mode: 'insensitive' } } },
        { driver: { user: { firstName: { contains: query.search, mode: 'insensitive' } } } },
      ];
    }
    if (query.fuelType) where.fuelType = query.fuelType as FuelType;
    if (query.paymentMethod) where.paymentMethod = query.paymentMethod as PaymentMethod;
    if (query.vehicleId) where.vehicleId = query.vehicleId;
    if (query.driverId) where.driverId = query.driverId;
    
    if (query.startDate && query.endDate) {
      where.fuelDate = {
        gte: new Date(query.startDate),
        lte: new Date(query.endDate),
      };
    }

    const [data, total] = await Promise.all([
      prisma.fuelLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: query.sortBy ? { [query.sortBy]: query.sortOrder || 'desc' } : { fuelDate: 'desc' },
        include: {
          vehicle: { select: { plateNumber: true, make: true, model: true } },
          driver: { select: { user: { select: { firstName: true, lastName: true } } } },
        },
      }),
      prisma.fuelLog.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get a single fuel log by ID
   */
  async getFuelLogById(companyId: string, id: string) {
    const log = await prisma.fuelLog.findFirst({
      where: { id, companyId, deletedAt: null },
      include: {
        vehicle: true,
        driver: { select: { id: true, user: { select: { firstName: true, lastName: true } } } },
        trip: { select: { id: true, tripNumber: true } },
        createdBy: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    if (!log) throw new HttpException(404, 'Fuel log not found');

    return log;
  }

  /**
   * Create fuel log
   */
  async createFuelLog(companyId: string, userId: string, data: any) {
    // Validate vehicle and driver exist
    const vehicle = await prisma.vehicle.findFirst({
      where: { id: data.vehicleId, companyId, deletedAt: null },
    });
    if (!vehicle) throw new HttpException(400, 'Invalid vehicle ID');

    const driver = await prisma.driver.findFirst({
      where: { id: data.driverId, companyId, deletedAt: null },
    });
    if (!driver) throw new HttpException(400, 'Invalid driver ID');

    if (data.odometerReading < vehicle.currentOdometer) {
      throw new HttpException(400, 'Odometer reading cannot be less than the current vehicle odometer');
    }

    // Auto-calculations
    const totalCost = data.liters * data.costPerLiter;
    
    // Calculate efficiency
    let efficiency = null;
    const previousFuelLog = await prisma.fuelLog.findFirst({
      where: { vehicleId: data.vehicleId, companyId, deletedAt: null },
      orderBy: { fuelDate: 'desc' },
    });

    if (previousFuelLog && data.odometerReading > previousFuelLog.odometerReading) {
      const distance = data.odometerReading - previousFuelLog.odometerReading;
      efficiency = distance / data.liters; // km/L or mi/gal depending on metric
    }

    const fuelLogNumber = await this.generateFuelLogNumber(companyId);

    const log = await prisma.fuelLog.create({
      data: {
        ...data,
        companyId,
        fuelLogNumber,
        totalCost,
        efficiency,
        createdById: userId,
        fuelDate: new Date(data.fuelDate),
      },
    });

    // Update vehicle's current odometer
    await prisma.vehicle.update({
      where: { id: vehicle.id },
      data: { currentOdometer: data.odometerReading },
    });

    await this.logAudit(companyId, userId, 'CREATE', log.id, null, log);

    return log;
  }

  /**
   * Update fuel log
   */
  async updateFuelLog(companyId: string, userId: string, id: string, data: any) {
    const log = await prisma.fuelLog.findFirst({
      where: { id, companyId, deletedAt: null },
    });

    if (!log) throw new HttpException(404, 'Fuel log not found');

    // Recalculate total cost if liters or costPerLiter changes
    let totalCost = log.totalCost;
    if (data.liters || data.costPerLiter) {
      const liters = data.liters ?? log.liters;
      const costPerLiter = data.costPerLiter ?? log.costPerLiter;
      totalCost = liters * costPerLiter;
    }

    const updated = await prisma.fuelLog.update({
      where: { id },
      data: {
        ...data,
        totalCost,
        fuelDate: data.fuelDate ? new Date(data.fuelDate) : undefined,
      },
    });

    await this.logAudit(companyId, userId, 'UPDATE', log.id, log, updated);

    return updated;
  }

  /**
   * Soft delete fuel log
   */
  async deleteFuelLog(companyId: string, userId: string, id: string) {
    const log = await prisma.fuelLog.findFirst({
      where: { id, companyId, deletedAt: null },
    });

    if (!log) throw new HttpException(404, 'Fuel log not found');

    const deleted = await prisma.fuelLog.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    await this.logAudit(companyId, userId, 'DELETE', id, log, { deletedAt: deleted.deletedAt });

    return true;
  }

  /**
   * Restore soft deleted fuel log
   */
  async restoreFuelLog(companyId: string, userId: string, id: string) {
    const log = await prisma.fuelLog.findFirst({
      where: { id, companyId, deletedAt: { not: null } },
    });

    if (!log) throw new HttpException(404, 'Fuel log not found or not deleted');

    await prisma.fuelLog.update({
      where: { id },
      data: { deletedAt: null },
    });

    await this.logAudit(companyId, userId, 'UPDATE', id, { deletedAt: log.deletedAt }, { deletedAt: null });

    return true;
  }

  /**
   * Get Fuel Analytics
   */
  async getAnalytics(companyId: string, query: any) {
    const startDate = query.startDate ? new Date(query.startDate) : new Date(new Date().setMonth(new Date().getMonth() - 1));
    const endDate = query.endDate ? new Date(query.endDate) : new Date();

    const where: Prisma.FuelLogWhereInput = {
      companyId,
      deletedAt: null,
      fuelDate: { gte: startDate, lte: endDate },
    };

    const logs = await prisma.fuelLog.findMany({
      where,
      select: {
        liters: true,
        totalCost: true,
        efficiency: true,
        fuelType: true,
        fuelDate: true,
        vehicleId: true,
      },
    });

    let totalLiters = 0;
    let totalCost = 0;
    let validEfficiencies: number[] = [];
    const typeDistribution: Record<string, number> = {};
    const vehicleCosts: Record<string, number> = {};
    
    logs.forEach(log => {
      totalLiters += log.liters;
      totalCost += log.totalCost;
      if (log.efficiency) validEfficiencies.push(log.efficiency);
      
      typeDistribution[log.fuelType] = (typeDistribution[log.fuelType] || 0) + log.liters;
      vehicleCosts[log.vehicleId] = (vehicleCosts[log.vehicleId] || 0) + log.totalCost;
    });

    const averageEfficiency = validEfficiencies.length > 0 
      ? validEfficiencies.reduce((a, b) => a + b, 0) / validEfficiencies.length 
      : 0;

    let highestConsumptionVehicleId = null;
    let highestConsumptionCost = 0;
    for (const [vId, cost] of Object.entries(vehicleCosts)) {
      if (cost > highestConsumptionCost) {
        highestConsumptionCost = cost;
        highestConsumptionVehicleId = vId;
      }
    }

    return {
      totalLiters,
      totalCost,
      averageEfficiency,
      typeDistribution,
      highestConsumptionVehicleId,
      highestConsumptionCost
    };
  }

  /**
   * Get Fuel Dashboard Metrics
   */
  async getDashboardMetrics(companyId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [todayLogs, monthLogs] = await Promise.all([
      prisma.fuelLog.findMany({
        where: { companyId, deletedAt: null, fuelDate: { gte: today } },
        select: { id: true }
      }),
      prisma.fuelLog.findMany({
        where: { companyId, deletedAt: null, fuelDate: { gte: firstDayOfMonth } },
        select: { totalCost: true, efficiency: true, liters: true }
      }),
    ]);

    let monthlyCost = 0;
    let monthlyLiters = 0;
    let validEfficiencies: number[] = [];

    monthLogs.forEach(log => {
      monthlyCost += log.totalCost;
      monthlyLiters += log.liters;
      if (log.efficiency) validEfficiencies.push(log.efficiency);
    });

    const averageEfficiency = validEfficiencies.length > 0 
      ? validEfficiencies.reduce((a, b) => a + b, 0) / validEfficiencies.length 
      : 0;

    return {
      todayRefuels: todayLogs.length,
      monthlyCost,
      monthlyLiters,
      averageEfficiency,
    };
  }
}

export const fuelService = new FuelService();
