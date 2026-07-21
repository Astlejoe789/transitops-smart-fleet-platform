import { prisma } from '../../database/prisma.js';
import { StatusCodes } from 'http-status-codes';
import { HttpException } from '../../shared/exceptions/http.exception.js';
import type {
  CreateTripDto,
  UpdateTripDto,
  AssignDriverDto,
  AssignVehicleDto,
  UpdateTripStatusDto,
} from './validation.js';

interface TripPaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  driverId?: string;
  vehicleId?: string;
  customerId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export class TripService {
  // ─── Generate Trip Number ────────────────────────────────────────────────────
  private async generateTripNumber(companyId: string): Promise<string> {
    const today = new Date();
    const prefix = `TRP-${today.getFullYear()}${(today.getMonth() + 1).toString().padStart(2, '0')}${today.getDate().toString().padStart(2, '0')}`;
    
    const count = await prisma.trip.count({
      where: {
        companyId,
        tripNumber: { startsWith: prefix },
      },
    });

    return `${prefix}-${(count + 1).toString().padStart(4, '0')}`;
  }

  // ─── List Trips ──────────────────────────────────────────────────────────────
  async getTrips(companyId: string, params: TripPaginationParams) {
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 10;
    const skip = (page - 1) * limit;

    const where: any = { companyId, deletedAt: null };

    if (params.search) {
      where.OR = [
        { tripNumber: { contains: params.search, mode: 'insensitive' } },
        { tripName: { contains: params.search, mode: 'insensitive' } },
        { origin: { contains: params.search, mode: 'insensitive' } },
        { destination: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    if (params.status) where.status = params.status;
    if (params.driverId) where.driverId = params.driverId;
    if (params.vehicleId) where.vehicleId = params.vehicleId;
    if (params.customerId) where.customerId = params.customerId;

    const sortBy = params.sortBy || 'createdAt';
    const sortOrder = params.sortOrder || 'desc';

    const [total, trips] = await Promise.all([
      prisma.trip.count({ where }),
      prisma.trip.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          driver: { select: { id: true, user: { select: { firstName: true, lastName: true, avatarUrl: true } } } },
          vehicle: { select: { id: true, plateNumber: true, make: true, model: true } },
          customer: { select: { id: true, name: true } },
        },
      }),
    ]);

    return {
      data: trips,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // ─── Get Trip by ID ──────────────────────────────────────────────────────────
  async getTripById(companyId: string, id: string) {
    const trip = await prisma.trip.findFirst({
      where: { id, companyId, deletedAt: null },
      include: {
        driver: {
          include: {
            user: { select: { firstName: true, lastName: true, email: true, phone: true, avatarUrl: true } },
          },
        },
        vehicle: true,
        customer: true,
        branch: { select: { id: true, name: true } },
      },
    });

    if (!trip) throw new HttpException(StatusCodes.NOT_FOUND, 'Trip not found');
    return trip;
  }

  // ─── Create Trip ─────────────────────────────────────────────────────────────
  async createTrip(companyId: string, actorUserId: string, data: CreateTripDto) {
    const tripNumber = await this.generateTripNumber(companyId);

    // Determine initial status based on assignments
    let initialStatus = 'DRAFT';
    if (data.driverId && data.vehicleId) initialStatus = 'READY_FOR_DISPATCH';
    else if (data.driverId) initialStatus = 'DRIVER_ASSIGNED';
    else if (data.vehicleId) initialStatus = 'VEHICLE_ASSIGNED';
    else initialStatus = 'SCHEDULED';

    const trip = await prisma.$transaction(async (tx) => {
      const newTrip = await tx.trip.create({
        data: {
          companyId,
          tripNumber,
          tripName: data.tripName,
          tripType: data.tripType,
          customerId: data.customerId,
          origin: data.origin,
          destination: data.destination,
          intermediateStops: data.intermediateStops ? data.intermediateStops : undefined,
          scheduledStart: new Date(data.scheduledStart),
          scheduledEnd: new Date(data.scheduledEnd),
          priority: data.priority || 'MEDIUM',
          cargoDescription: data.cargoDescription,
          cargoWeight: data.cargoWeight,
          notes: data.notes,
          driverId: data.driverId,
          vehicleId: data.vehicleId,
          status: initialStatus as any,
        },
      });

      await tx.auditLog.create({
        data: {
          companyId,
          userId: actorUserId,
          action: 'CREATE',
          entityType: 'TRIP',
          entityId: newTrip.id,
          newValues: { tripNumber, origin: data.origin, destination: data.destination } as any,
        },
      });

      return newTrip;
    });

    return trip;
  }

  // ─── Update Trip ─────────────────────────────────────────────────────────────
  async updateTrip(companyId: string, actorUserId: string, id: string, data: UpdateTripDto) {
    const existing = await prisma.trip.findFirst({
      where: { id, companyId, deletedAt: null },
    });

    if (!existing) throw new HttpException(StatusCodes.NOT_FOUND, 'Trip not found');

    const updated = await prisma.$transaction(async (tx) => {
      const updateData: any = { ...data };
      if (data.intermediateStops) updateData.intermediateStops = JSON.stringify(data.intermediateStops);
      if (data.scheduledStart) updateData.scheduledStart = new Date(data.scheduledStart);
      if (data.scheduledEnd) updateData.scheduledEnd = new Date(data.scheduledEnd);
      if (data.actualStart) updateData.actualStart = new Date(data.actualStart);
      if (data.actualEnd) updateData.actualEnd = new Date(data.actualEnd);

      const trip = await tx.trip.update({
        where: { id },
        data: updateData,
        include: {
          driver: { select: { user: { select: { firstName: true, lastName: true } } } },
          vehicle: { select: { plateNumber: true } },
        },
      });

      await tx.auditLog.create({
        data: {
          companyId,
          userId: actorUserId,
          action: 'UPDATE',
          entityType: 'TRIP',
          entityId: id,
          oldValues: { status: existing.status } as any,
          newValues: updateData as any,
        },
      });

      return trip;
    });

    return updated;
  }

  // ─── Soft Delete Trip ────────────────────────────────────────────────────────
  async deleteTrip(companyId: string, actorUserId: string, id: string) {
    const existing = await prisma.trip.findFirst({
      where: { id, companyId, deletedAt: null },
    });

    if (!existing) throw new HttpException(StatusCodes.NOT_FOUND, 'Trip not found');

    await prisma.$transaction(async (tx) => {
      await tx.trip.update({
        where: { id },
        data: { deletedAt: new Date(), status: 'CANCELLED' },
      });

      await tx.auditLog.create({
        data: {
          companyId,
          userId: actorUserId,
          action: 'DELETE',
          entityType: 'TRIP',
          entityId: id,
          oldValues: { tripNumber: existing.tripNumber } as any,
        },
      });
    });

    return { success: true };
  }

  // ─── Restore Trip ────────────────────────────────────────────────────────────
  async restoreTrip(companyId: string, actorUserId: string, id: string) {
    const existing = await prisma.trip.findFirst({
      where: { id, companyId, deletedAt: { not: null } },
    });

    if (!existing) throw new HttpException(StatusCodes.NOT_FOUND, 'Deleted trip not found');

    await prisma.$transaction(async (tx) => {
      await tx.trip.update({
        where: { id },
        data: { deletedAt: null, status: 'DRAFT' },
      });

      await tx.auditLog.create({
        data: {
          companyId,
          userId: actorUserId,
          action: 'UPDATE',
          entityType: 'TRIP',
          entityId: id,
          newValues: { action: 'RESTORED' } as any,
        },
      });
    });

    return { success: true };
  }

  // ─── Assign Driver ───────────────────────────────────────────────────────────
  async assignDriver(companyId: string, actorUserId: string, id: string, data: AssignDriverDto) {
    const trip = await prisma.trip.findFirst({
      where: { id, companyId, deletedAt: null },
    });

    if (!trip) throw new HttpException(StatusCodes.NOT_FOUND, 'Trip not found');
    if (['IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'CLOSED'].includes(trip.status)) {
      throw new HttpException(StatusCodes.BAD_REQUEST, `Cannot assign driver when trip is ${trip.status}`);
    }

    // Check if driver is already on an active trip
    const activeDriverTrip = await prisma.trip.findFirst({
      where: {
        driverId: data.driverId,
        status: { in: ['IN_PROGRESS', 'DISPATCHED'] },
        id: { not: id },
      },
    });

    if (activeDriverTrip) {
      throw new HttpException(StatusCodes.CONFLICT, 'Driver is currently on another active trip');
    }

    const newStatus = trip.vehicleId ? 'READY_FOR_DISPATCH' : 'DRIVER_ASSIGNED';

    const updated = await prisma.$transaction(async (tx) => {
      const result = await tx.trip.update({
        where: { id },
        data: { driverId: data.driverId, status: newStatus },
      });

      await tx.auditLog.create({
        data: {
          companyId,
          userId: actorUserId,
          action: 'UPDATE',
          entityType: 'TRIP',
          entityId: id,
          newValues: { action: 'DRIVER_ASSIGNED', driverId: data.driverId, status: newStatus } as any,
        },
      });

      return result;
    });

    return updated;
  }

  // ─── Assign Vehicle ──────────────────────────────────────────────────────────
  async assignVehicle(companyId: string, actorUserId: string, id: string, data: AssignVehicleDto) {
    const trip = await prisma.trip.findFirst({
      where: { id, companyId, deletedAt: null },
    });

    if (!trip) throw new HttpException(StatusCodes.NOT_FOUND, 'Trip not found');
    if (['IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'CLOSED'].includes(trip.status)) {
      throw new HttpException(StatusCodes.BAD_REQUEST, `Cannot assign vehicle when trip is ${trip.status}`);
    }

    // Check if vehicle is already on an active trip
    const activeVehicleTrip = await prisma.trip.findFirst({
      where: {
        vehicleId: data.vehicleId,
        status: { in: ['IN_PROGRESS', 'DISPATCHED'] },
        id: { not: id },
      },
    });

    if (activeVehicleTrip) {
      throw new HttpException(StatusCodes.CONFLICT, 'Vehicle is currently on another active trip');
    }

    const newStatus = trip.driverId ? 'READY_FOR_DISPATCH' : 'VEHICLE_ASSIGNED';

    const updated = await prisma.$transaction(async (tx) => {
      const result = await tx.trip.update({
        where: { id },
        data: { vehicleId: data.vehicleId, status: newStatus },
      });

      await tx.auditLog.create({
        data: {
          companyId,
          userId: actorUserId,
          action: 'UPDATE',
          entityType: 'TRIP',
          entityId: id,
          newValues: { action: 'VEHICLE_ASSIGNED', vehicleId: data.vehicleId, status: newStatus } as any,
        },
      });

      return result;
    });

    return updated;
  }

  // ─── Update Trip Status ──────────────────────────────────────────────────────
  async updateTripStatus(companyId: string, actorUserId: string, id: string, data: UpdateTripStatusDto) {
    const trip = await prisma.trip.findFirst({
      where: { id, companyId, deletedAt: null },
    });

    if (!trip) throw new HttpException(StatusCodes.NOT_FOUND, 'Trip not found');

    const updated = await prisma.$transaction(async (tx) => {
      const updateData: any = { status: data.status };

      // Automatic timestamps based on status
      if (data.status === 'IN_PROGRESS' && !trip.actualStart) {
        updateData.actualStart = new Date();
        // Update driver and vehicle status
        if (trip.driverId) await tx.driver.update({ where: { id: trip.driverId }, data: { status: 'ON_TRIP' } });
        if (trip.vehicleId) await tx.vehicle.update({ where: { id: trip.vehicleId }, data: { status: 'IN_TRANSIT' } });
      } else if (['COMPLETED', 'CLOSED'].includes(data.status) && !trip.actualEnd) {
        updateData.actualEnd = new Date();
        // Free driver and vehicle
        if (trip.driverId) await tx.driver.update({ where: { id: trip.driverId }, data: { status: 'AVAILABLE' } });
        if (trip.vehicleId) await tx.vehicle.update({ where: { id: trip.vehicleId }, data: { status: 'AVAILABLE' } });
      } else if (data.status === 'CANCELLED') {
        // Free driver and vehicle
        if (trip.driverId) await tx.driver.update({ where: { id: trip.driverId }, data: { status: 'AVAILABLE' } });
        if (trip.vehicleId) await tx.vehicle.update({ where: { id: trip.vehicleId }, data: { status: 'AVAILABLE' } });
      }

      const result = await tx.trip.update({
        where: { id },
        data: updateData,
      });

      await tx.auditLog.create({
        data: {
          companyId,
          userId: actorUserId,
          action: 'UPDATE',
          entityType: 'TRIP',
          entityId: id,
          oldValues: { status: trip.status } as any,
          newValues: { status: data.status, notes: data.notes } as any,
        },
      });

      return result;
    });

    return updated;
  }

  // ─── Get Dispatch Board Data ─────────────────────────────────────────────────
  async getDispatchBoard(companyId: string) {
    const [pending, assigned, active, completed] = await Promise.all([
      prisma.trip.findMany({
        where: { companyId, status: { in: ['DRAFT', 'SCHEDULED'] }, deletedAt: null },
        include: { customer: { select: { name: true } } },
        orderBy: { scheduledStart: 'asc' },
        take: 50,
      }),
      prisma.trip.findMany({
        where: { companyId, status: { in: ['DRIVER_ASSIGNED', 'VEHICLE_ASSIGNED', 'READY_FOR_DISPATCH'] }, deletedAt: null },
        include: {
          driver: { select: { user: { select: { firstName: true, lastName: true } } } },
          vehicle: { select: { plateNumber: true } },
          customer: { select: { name: true } },
        },
        orderBy: { scheduledStart: 'asc' },
        take: 50,
      }),
      prisma.trip.findMany({
        where: { companyId, status: { in: ['DISPATCHED', 'IN_PROGRESS', 'DELAYED'] }, deletedAt: null },
        include: {
          driver: { select: { user: { select: { firstName: true, lastName: true, avatarUrl: true } } } },
          vehicle: { select: { plateNumber: true } },
          customer: { select: { name: true } },
        },
        orderBy: { scheduledStart: 'asc' },
        take: 50,
      }),
      prisma.trip.findMany({
        where: {
          companyId,
          status: 'COMPLETED',
          deletedAt: null,
          actualEnd: { gte: new Date(new Date().setHours(0, 0, 0, 0)) }, // Today's completed
        },
        include: {
          driver: { select: { user: { select: { firstName: true, lastName: true } } } },
          vehicle: { select: { plateNumber: true } },
        },
        orderBy: { actualEnd: 'desc' },
        take: 20,
      }),
    ]);

    return {
      pending,
      assigned,
      active,
      completed,
    };
  }
}

export const tripService = new TripService();
