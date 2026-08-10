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
    const count = await prisma.trip.count({ where: { companyId, tripNumber: { startsWith: prefix } } });
    return `${prefix}-${(count + 1).toString().padStart(4, '0')}`;
  }

  // ─── List Trips ──────────────────────────────────────────────────────────────
  async getTrips(companyId: string, params: TripPaginationParams) {
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 50;
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
          vehicle: { select: { id: true, plateNumber: true, make: true, model: true, payloadCapacity: true } },
          customer: { select: { id: true, name: true } },
        },
      }),
    ]);

    return { data: trips, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  // ─── Get Trip by ID ──────────────────────────────────────────────────────────
  async getTripById(companyId: string, id: string) {
    const trip = await prisma.trip.findFirst({
      where: { id, companyId, deletedAt: null },
      include: {
        driver: { include: { user: { select: { firstName: true, lastName: true, email: true, phone: true, avatarUrl: true } } } },
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

    // ── Business Rule Validations ────────────────────────────────────────────
    if (data.vehicleId) {
      const vehicle = await prisma.vehicle.findFirst({ where: { id: data.vehicleId, companyId, deletedAt: null } });
      if (!vehicle) throw new HttpException(StatusCodes.NOT_FOUND, 'Vehicle not found');

      if (['UNDER_MAINTENANCE', 'OUT_OF_SERVICE', 'DECOMMISSIONED', 'IN_TRANSIT'].includes(vehicle.status)) {
        throw new HttpException(StatusCodes.BAD_REQUEST,
          `Vehicle is currently ${vehicle.status.replace(/_/g, ' ')} and cannot be assigned to a trip`);
      }

      if (data.cargoWeight && vehicle.payloadCapacity && data.cargoWeight > vehicle.payloadCapacity) {
        throw new HttpException(StatusCodes.BAD_REQUEST,
          `Cargo weight (${data.cargoWeight} kg) exceeds vehicle maximum capacity (${vehicle.payloadCapacity} kg)`);
      }

      const vehicleOnTrip = await prisma.trip.findFirst({
        where: { vehicleId: data.vehicleId, status: { in: ['DISPATCHED', 'IN_PROGRESS'] }, deletedAt: null },
      });
      if (vehicleOnTrip) throw new HttpException(StatusCodes.CONFLICT, 'Vehicle is already assigned to an active trip');
    }

    if (data.driverId) {
      const driver = await prisma.driver.findFirst({ where: { id: data.driverId, companyId, deletedAt: null } });
      if (!driver) throw new HttpException(StatusCodes.NOT_FOUND, 'Driver not found');
      if (driver.status === 'SUSPENDED') throw new HttpException(StatusCodes.BAD_REQUEST, 'Suspended drivers cannot be assigned to trips');
      if (new Date(driver.licenseExpiry) < new Date()) throw new HttpException(StatusCodes.BAD_REQUEST, 'Driver has an expired license');
      if (driver.status === 'ON_TRIP') throw new HttpException(StatusCodes.CONFLICT, 'Driver is already on an active trip');

      const driverOnTrip = await prisma.trip.findFirst({
        where: { driverId: data.driverId, status: { in: ['DISPATCHED', 'IN_PROGRESS'] }, deletedAt: null },
      });
      if (driverOnTrip) throw new HttpException(StatusCodes.CONFLICT, 'Driver is already assigned to an active trip');
    }

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
          estimatedDistance: (data as any).estimatedDistance,
          notes: data.notes,
          driverId: data.driverId,
          vehicleId: data.vehicleId,
          status: 'DRAFT',
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
    const existing = await prisma.trip.findFirst({ where: { id, companyId, deletedAt: null } });
    if (!existing) throw new HttpException(StatusCodes.NOT_FOUND, 'Trip not found');

    const updated = await prisma.$transaction(async (tx) => {
      const updateData: any = { ...data };
      if (data.intermediateStops) updateData.intermediateStops = JSON.stringify(data.intermediateStops);
      if (data.scheduledStart) updateData.scheduledStart = new Date(data.scheduledStart);
      if (data.scheduledEnd) updateData.scheduledEnd = new Date(data.scheduledEnd);

      const trip = await tx.trip.update({ where: { id }, data: updateData });

      await tx.auditLog.create({
        data: {
          companyId, userId: actorUserId, action: 'UPDATE', entityType: 'TRIP', entityId: id,
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
    const existing = await prisma.trip.findFirst({ where: { id, companyId, deletedAt: null } });
    if (!existing) throw new HttpException(StatusCodes.NOT_FOUND, 'Trip not found');

    await prisma.$transaction(async (tx) => {
      // Restore vehicle and driver if trip was active
      if (['DISPATCHED', 'IN_PROGRESS'].includes(existing.status)) {
        if (existing.driverId) await tx.driver.update({ where: { id: existing.driverId }, data: { status: 'AVAILABLE' } });
        if (existing.vehicleId) await tx.vehicle.update({ where: { id: existing.vehicleId }, data: { status: 'AVAILABLE' } });
      }
      await tx.trip.update({ where: { id }, data: { deletedAt: new Date(), status: 'CANCELLED' } });
      await tx.auditLog.create({
        data: { companyId, userId: actorUserId, action: 'DELETE', entityType: 'TRIP', entityId: id, oldValues: { tripNumber: existing.tripNumber } as any },
      });
    });

    return { success: true };
  }

  // ─── Restore Trip ────────────────────────────────────────────────────────────
  async restoreTrip(companyId: string, actorUserId: string, id: string) {
    const existing = await prisma.trip.findFirst({ where: { id, companyId, deletedAt: { not: null } } });
    if (!existing) throw new HttpException(StatusCodes.NOT_FOUND, 'Deleted trip not found');

    await prisma.$transaction(async (tx) => {
      await tx.trip.update({ where: { id }, data: { deletedAt: null, status: 'DRAFT' } });
      await tx.auditLog.create({
        data: { companyId, userId: actorUserId, action: 'UPDATE', entityType: 'TRIP', entityId: id, newValues: { action: 'RESTORED' } as any },
      });
    });

    return { success: true };
  }

  // ─── Assign Driver ───────────────────────────────────────────────────────────
  async assignDriver(companyId: string, actorUserId: string, id: string, data: AssignDriverDto) {
    const trip = await prisma.trip.findFirst({ where: { id, companyId, deletedAt: null } });
    if (!trip) throw new HttpException(StatusCodes.NOT_FOUND, 'Trip not found');
    if (['DISPATCHED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].includes(trip.status)) {
      throw new HttpException(StatusCodes.BAD_REQUEST, `Cannot assign driver when trip is ${trip.status}`);
    }

    const driver = await prisma.driver.findFirst({ where: { id: data.driverId, companyId, deletedAt: null } });
    if (!driver) throw new HttpException(StatusCodes.NOT_FOUND, 'Driver not found');
    if (driver.status === 'SUSPENDED') throw new HttpException(StatusCodes.BAD_REQUEST, 'Suspended driver cannot be assigned');
    if (new Date(driver.licenseExpiry) < new Date()) throw new HttpException(StatusCodes.BAD_REQUEST, 'Driver has an expired license');
    if (driver.status === 'ON_TRIP') throw new HttpException(StatusCodes.CONFLICT, 'Driver is already on an active trip');

    const activeDriverTrip = await prisma.trip.findFirst({
      where: { driverId: data.driverId, status: { in: ['DISPATCHED', 'IN_PROGRESS'] }, id: { not: id } },
    });
    if (activeDriverTrip) throw new HttpException(StatusCodes.CONFLICT, 'Driver is currently on another active trip');

    const updated = await prisma.$transaction(async (tx) => {
      const result = await tx.trip.update({ where: { id }, data: { driverId: data.driverId } });
      await tx.auditLog.create({
        data: { companyId, userId: actorUserId, action: 'UPDATE', entityType: 'TRIP', entityId: id, newValues: { action: 'DRIVER_ASSIGNED', driverId: data.driverId } as any },
      });
      return result;
    });

    return updated;
  }

  // ─── Assign Vehicle ──────────────────────────────────────────────────────────
  async assignVehicle(companyId: string, actorUserId: string, id: string, data: AssignVehicleDto) {
    const trip = await prisma.trip.findFirst({ where: { id, companyId, deletedAt: null } });
    if (!trip) throw new HttpException(StatusCodes.NOT_FOUND, 'Trip not found');
    if (['DISPATCHED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].includes(trip.status)) {
      throw new HttpException(StatusCodes.BAD_REQUEST, `Cannot assign vehicle when trip is ${trip.status}`);
    }

    const vehicle = await prisma.vehicle.findFirst({ where: { id: data.vehicleId, companyId, deletedAt: null } });
    if (!vehicle) throw new HttpException(StatusCodes.NOT_FOUND, 'Vehicle not found');
    if (['UNDER_MAINTENANCE', 'OUT_OF_SERVICE', 'DECOMMISSIONED'].includes(vehicle.status)) {
      throw new HttpException(StatusCodes.BAD_REQUEST, `Vehicle is ${vehicle.status.replace(/_/g, ' ')} and cannot be assigned`);
    }

    if (trip.cargoWeight && vehicle.payloadCapacity && trip.cargoWeight > vehicle.payloadCapacity) {
      throw new HttpException(StatusCodes.BAD_REQUEST,
        `Trip cargo weight (${trip.cargoWeight} kg) exceeds vehicle capacity (${vehicle.payloadCapacity} kg)`);
    }

    const activeVehicleTrip = await prisma.trip.findFirst({
      where: { vehicleId: data.vehicleId, status: { in: ['DISPATCHED', 'IN_PROGRESS'] }, id: { not: id } },
    });
    if (activeVehicleTrip) throw new HttpException(StatusCodes.CONFLICT, 'Vehicle is currently on another active trip');

    const updated = await prisma.$transaction(async (tx) => {
      const result = await tx.trip.update({ where: { id }, data: { vehicleId: data.vehicleId } });
      await tx.auditLog.create({
        data: { companyId, userId: actorUserId, action: 'UPDATE', entityType: 'TRIP', entityId: id, newValues: { action: 'VEHICLE_ASSIGNED', vehicleId: data.vehicleId } as any },
      });
      return result;
    });

    return updated;
  }

  // ─── Update Trip Status ──────────────────────────────────────────────────────
  // Lifecycle: DRAFT → DISPATCHED → COMPLETED | CANCELLED
  async updateTripStatus(companyId: string, actorUserId: string, id: string, data: UpdateTripStatusDto) {
    const trip = await prisma.trip.findFirst({ where: { id, companyId, deletedAt: null } });
    if (!trip) throw new HttpException(StatusCodes.NOT_FOUND, 'Trip not found');

    const allowedTransitions: Record<string, string[]> = {
      DRAFT: ['DISPATCHED', 'CANCELLED'],
      DISPATCHED: ['COMPLETED', 'CANCELLED'],
      IN_PROGRESS: ['COMPLETED', 'CANCELLED'],
      COMPLETED: [],
      CANCELLED: [],
    };

    const currentStatus = trip.status as string;
    const allowedNext = allowedTransitions[currentStatus] ?? [];

    if (!allowedNext.includes(data.status as string)) {
      throw new HttpException(StatusCodes.BAD_REQUEST,
        `Cannot transition trip from ${currentStatus} to ${data.status}. Allowed: ${allowedNext.join(', ') || 'none'}`);
    }

    // Pre-dispatch validation
    if (data.status === 'DISPATCHED') {
      if (!trip.driverId || !trip.vehicleId) {
        throw new HttpException(StatusCodes.BAD_REQUEST, 'Trip must have both a driver and a vehicle before dispatching');
      }

      const driver = await prisma.driver.findUnique({ where: { id: trip.driverId } });
      if (!driver) throw new HttpException(StatusCodes.NOT_FOUND, 'Assigned driver not found');
      if (driver.status === 'SUSPENDED') throw new HttpException(StatusCodes.BAD_REQUEST, 'Assigned driver is suspended');
      if (new Date(driver.licenseExpiry) < new Date()) throw new HttpException(StatusCodes.BAD_REQUEST, 'Assigned driver has an expired license');

      const vehicle = await prisma.vehicle.findUnique({ where: { id: trip.vehicleId } });
      if (!vehicle) throw new HttpException(StatusCodes.NOT_FOUND, 'Assigned vehicle not found');
      if (['UNDER_MAINTENANCE', 'OUT_OF_SERVICE', 'DECOMMISSIONED'].includes(vehicle.status)) {
        throw new HttpException(StatusCodes.BAD_REQUEST, `Assigned vehicle is ${vehicle.status.replace(/_/g, ' ')}`);
      }
      if (trip.cargoWeight && vehicle.payloadCapacity && trip.cargoWeight > vehicle.payloadCapacity) {
        throw new HttpException(StatusCodes.BAD_REQUEST,
          `Cargo weight (${trip.cargoWeight} kg) exceeds vehicle capacity (${vehicle.payloadCapacity} kg)`);
      }
    }

    const updated = await prisma.$transaction(async (tx) => {
      const updateData: any = { status: data.status };
      if (data.notes) updateData.notes = data.notes;

      if (data.status === 'DISPATCHED') {
        // Dispatching a trip → both vehicle and driver become ON_TRIP
        updateData.actualStart = new Date();
        if (trip.driverId) await tx.driver.update({ where: { id: trip.driverId }, data: { status: 'ON_TRIP' } });
        if (trip.vehicleId) await tx.vehicle.update({ where: { id: trip.vehicleId }, data: { status: 'IN_TRANSIT' } });
      } else if (data.status === 'COMPLETED') {
        // Completing a trip → both revert to AVAILABLE
        updateData.actualEnd = new Date();
        if (trip.driverId) await tx.driver.update({ where: { id: trip.driverId }, data: { status: 'AVAILABLE' } });
        if (trip.vehicleId) await tx.vehicle.update({ where: { id: trip.vehicleId }, data: { status: 'AVAILABLE' } });
      } else if (data.status === 'CANCELLED') {
        // Cancelling a dispatched trip → restore if they were marked ON_TRIP
        if (trip.driverId) {
          const dr = await tx.driver.findUnique({ where: { id: trip.driverId } });
          if (dr?.status === 'ON_TRIP') await tx.driver.update({ where: { id: trip.driverId }, data: { status: 'AVAILABLE' } });
        }
        if (trip.vehicleId) {
          const vh = await tx.vehicle.findUnique({ where: { id: trip.vehicleId } });
          if (vh?.status === 'IN_TRANSIT') await tx.vehicle.update({ where: { id: trip.vehicleId }, data: { status: 'AVAILABLE' } });
        }
      }

      const result = await tx.trip.update({ where: { id }, data: updateData });

      await tx.auditLog.create({
        data: {
          companyId, userId: actorUserId, action: 'UPDATE', entityType: 'TRIP', entityId: id,
          oldValues: { status: trip.status } as any,
          newValues: { status: data.status, notes: data.notes } as any,
        },
      });

      return result;
    });

    return updated;
  }

  // ─── Get Available Vehicles for Dispatch ─────────────────────────────────────
  async getAvailableVehicles(companyId: string) {
    return prisma.vehicle.findMany({
      where: { companyId, deletedAt: null, status: 'AVAILABLE' },
      select: { id: true, plateNumber: true, make: true, model: true, year: true, type: true, payloadCapacity: true, fuelType: true },
      orderBy: { plateNumber: 'asc' },
    });
  }

  // ─── Get Available Drivers for Dispatch ──────────────────────────────────────
  async getAvailableDrivers(companyId: string) {
    const now = new Date();
    return prisma.driver.findMany({
      where: { companyId, deletedAt: null, status: 'AVAILABLE', licenseExpiry: { gte: now } },
      include: { user: { select: { firstName: true, lastName: true, avatarUrl: true } } },
      orderBy: { user: { firstName: 'asc' } },
    });
  }

  // ─── Get Dispatch Board Data ─────────────────────────────────────────────────
  async getDispatchBoard(companyId: string) {
    const [pending, active, completed] = await Promise.all([
      prisma.trip.findMany({
        where: { companyId, status: 'DRAFT', deletedAt: null },
        include: { customer: { select: { name: true } } },
        orderBy: { scheduledStart: 'asc' },
        take: 50,
      }),
      prisma.trip.findMany({
        where: { companyId, status: { in: ['DISPATCHED', 'IN_PROGRESS'] }, deletedAt: null },
        include: {
          driver: { select: { user: { select: { firstName: true, lastName: true, avatarUrl: true } } } },
          vehicle: { select: { plateNumber: true } },
          customer: { select: { name: true } },
        },
        orderBy: { scheduledStart: 'asc' },
        take: 50,
      }),
      prisma.trip.findMany({
        where: { companyId, status: 'COMPLETED', deletedAt: null, actualEnd: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } },
        include: {
          driver: { select: { user: { select: { firstName: true, lastName: true } } } },
          vehicle: { select: { plateNumber: true } },
        },
        orderBy: { actualEnd: 'desc' },
        take: 20,
      }),
    ]);

    return { pending, active, completed };
  }
}

export const tripService = new TripService();
