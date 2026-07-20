import { prisma } from '../../database/prisma.js';
import { StatusCodes } from 'http-status-codes';
import { HttpException } from '../../shared/exceptions/http.exception.js';
import type { CreateVehicleDto, UpdateVehicleDto, CreateDocumentDto } from './validation.js';

interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  type?: string;
}

export class FleetService {
  /**
   * Fetch all vehicles with pagination, search, and filtering
   */
  async getVehicles(companyId: string, params: PaginationParams) {
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 10;
    const skip = (page - 1) * limit;

    const where: any = {
      companyId,
      deletedAt: null,
    };

    if (params.search) {
      where.OR = [
        { plateNumber: { contains: params.search, mode: 'insensitive' } },
        { vin: { contains: params.search, mode: 'insensitive' } },
        { make: { contains: params.search, mode: 'insensitive' } },
        { model: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    if (params.status) {
      where.status = params.status;
    }

    if (params.type) {
      where.type = params.type;
    }

    const [total, vehicles] = await Promise.all([
      prisma.vehicle.count({ where }),
      prisma.vehicle.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          branch: { select: { id: true, name: true } },
        },
      }),
    ]);

    return {
      data: vehicles,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get single vehicle details
   */
  async getVehicleById(companyId: string, id: string) {
    const vehicle = await prisma.vehicle.findFirst({
      where: { id, companyId, deletedAt: null },
      include: {
        branch: { select: { id: true, name: true } },
        documents: true,
      },
    });

    if (!vehicle) {
      throw new HttpException(StatusCodes.NOT_FOUND, 'Vehicle not found');
    }

    return vehicle;
  }

  /**
   * Create a new vehicle
   */
  async createVehicle(companyId: string, userId: string, data: CreateVehicleDto) {
    // Check if VIN or Plate Number already exists in the same company
    const existing = await prisma.vehicle.findFirst({
      where: {
        companyId,
        OR: [{ vin: data.vin }, { plateNumber: data.plateNumber }],
      },
    });

    if (existing) {
      throw new HttpException(StatusCodes.CONFLICT, 'Vehicle with this VIN or Plate Number already exists');
    }

    const vehicle = await prisma.$transaction(async (tx) => {
      const newVehicle = await tx.vehicle.create({
        data: {
          ...data,
          companyId,
        },
      });

      await tx.auditLog.create({
        data: {
          companyId,
          userId,
          action: 'CREATE',
          entityType: 'VEHICLE',
          entityId: newVehicle.id,
          newValues: data as any,
        },
      });

      return newVehicle;
    });

    return vehicle;
  }

  /**
   * Update an existing vehicle
   */
  async updateVehicle(companyId: string, userId: string, id: string, data: UpdateVehicleDto) {
    const existing = await prisma.vehicle.findFirst({
      where: { id, companyId, deletedAt: null },
    });

    if (!existing) {
      throw new HttpException(StatusCodes.NOT_FOUND, 'Vehicle not found');
    }

    // If changing VIN or Plate, ensure no conflict
    if (data.vin || data.plateNumber) {
      const conflict = await prisma.vehicle.findFirst({
        where: {
          companyId,
          id: { not: id },
          OR: [
            ...(data.vin ? [{ vin: data.vin }] : []),
            ...(data.plateNumber ? [{ plateNumber: data.plateNumber }] : []),
          ],
        },
      });

      if (conflict) {
        throw new HttpException(StatusCodes.CONFLICT, 'Another vehicle with this VIN or Plate Number already exists');
      }
    }

    const updated = await prisma.$transaction(async (tx) => {
      const updatedVehicle = await tx.vehicle.update({
        where: { id },
        data,
      });

      await tx.auditLog.create({
        data: {
          companyId,
          userId,
          action: 'UPDATE',
          entityType: 'VEHICLE',
          entityId: id,
          oldValues: existing as any,
          newValues: data as any,
        },
      });

      return updatedVehicle;
    });

    return updated;
  }

  /**
   * Soft delete a vehicle
   */
  async deleteVehicle(companyId: string, userId: string, id: string) {
    const existing = await prisma.vehicle.findFirst({
      where: { id, companyId, deletedAt: null },
    });

    if (!existing) {
      throw new HttpException(StatusCodes.NOT_FOUND, 'Vehicle not found');
    }

    await prisma.$transaction(async (tx) => {
      await tx.vehicle.update({
        where: { id },
        data: { deletedAt: new Date() },
      });

      await tx.auditLog.create({
        data: {
          companyId,
          userId,
          action: 'DELETE',
          entityType: 'VEHICLE',
          entityId: id,
        },
      });
    });

    return { success: true };
  }

  /**
   * Restore a soft-deleted vehicle
   */
  async restoreVehicle(companyId: string, userId: string, id: string) {
    const existing = await prisma.vehicle.findFirst({
      where: { id, companyId, deletedAt: { not: null } },
    });

    if (!existing) {
      throw new HttpException(StatusCodes.NOT_FOUND, 'Deleted vehicle not found');
    }

    await prisma.$transaction(async (tx) => {
      await tx.vehicle.update({
        where: { id },
        data: { deletedAt: null },
      });

      await tx.auditLog.create({
        data: {
          companyId,
          userId,
          action: 'UPDATE',
          entityType: 'VEHICLE',
          entityId: id,
          newValues: { status: 'RESTORED' } as any,
        },
      });
    });

    return { success: true };
  }

  /**
   * Get vehicle documents
   */
  async getDocuments(companyId: string, vehicleId: string) {
    const vehicle = await prisma.vehicle.findFirst({
      where: { id: vehicleId, companyId, deletedAt: null },
    });

    if (!vehicle) throw new HttpException(StatusCodes.NOT_FOUND, 'Vehicle not found');

    return prisma.vehicleDocument.findMany({
      where: { vehicleId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Add a document to a vehicle
   */
  async addDocument(companyId: string, userId: string, vehicleId: string, data: CreateDocumentDto) {
    const vehicle = await prisma.vehicle.findFirst({
      where: { id: vehicleId, companyId, deletedAt: null },
    });

    if (!vehicle) throw new HttpException(StatusCodes.NOT_FOUND, 'Vehicle not found');

    const document = await prisma.$transaction(async (tx) => {
      const doc = await tx.vehicleDocument.create({
        data: {
          vehicleId,
          title: data.title,
          documentType: data.documentType,
          fileUrl: data.fileUrl,
          issuedDate: data.issuedDate ? new Date(data.issuedDate) : null,
          expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
        },
      });

      await tx.auditLog.create({
        data: {
          companyId,
          userId,
          action: 'CREATE',
          entityType: 'VEHICLE_DOCUMENT',
          entityId: doc.id,
          newValues: data as any,
        },
      });

      return doc;
    });

    return document;
  }

  /**
   * Delete a document
   */
  async deleteDocument(companyId: string, userId: string, docId: string) {
    const document = await prisma.vehicleDocument.findFirst({
      where: { id: docId, vehicle: { companyId } },
    });

    if (!document) throw new HttpException(StatusCodes.NOT_FOUND, 'Document not found');

    await prisma.$transaction(async (tx) => {
      await tx.vehicleDocument.delete({ where: { id: docId } });

      await tx.auditLog.create({
        data: {
          companyId,
          userId,
          action: 'DELETE',
          entityType: 'VEHICLE_DOCUMENT',
          entityId: docId,
        },
      });
    });

    return { success: true };
  }
}

export const fleetService = new FleetService();
