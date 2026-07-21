import { PrismaClient, VendorStatus, Prisma } from '@prisma/client';
import { CreateVendorDTO, GetVendorsQuery, UpdateVendorDTO } from './types.js';
import { HttpException } from '../../shared/exceptions/http.exception.js';
import { StatusCodes } from 'http-status-codes';

const prisma = new PrismaClient();

export class VendorService {
  /** Generate a unique vendor number */
  private static async generateVendorNumber(companyId: string): Promise<string> {
    const count = await prisma.vendor.count({
      where: { companyId }
    });
    return `VEN-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;
  }

  static async getVendors(companyId: string, query: GetVendorsQuery) {
    const page = Math.max(1, parseInt(query.page || '1'));
    const limit = Math.max(1, parseInt(query.limit || '10'));
    const skip = (page - 1) * limit;

    const { search, status, type, sortBy = 'createdAt', sortOrder = 'desc' } = query;

    const where: Prisma.VendorWhereInput = {
      companyId,
      deletedAt: null,
      ...(status && { status: status as VendorStatus }),
      ...(type && { type: type as any }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search, mode: 'insensitive' } },
          { vendorNumber: { contains: search, mode: 'insensitive' } }
        ]
      })
    };

    const [total, data] = await Promise.all([
      prisma.vendor.count({ where }),
      prisma.vendor.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          _count: { select: { services: true, maintenanceLogs: true, maintenanceParts: true, ratings: true } }
        }
      })
    ]);

    return {
      data,
      meta: { total, page, limit }
    };
  }

  static async getVendorById(id: string, companyId: string) {
    const vendor = await prisma.vendor.findFirst({
      where: { id, companyId, deletedAt: null },
      include: {
        contacts: true,
        documents: true,
        services: true,
        ratings: {
          orderBy: { createdAt: 'desc' }
        },
        maintenanceLogs: {
          take: 5,
          orderBy: { scheduledDate: 'desc' },
          include: { vehicle: { select: { plateNumber: true, make: true, model: true } } }
        }
      }
    });

    if (!vendor) {
      throw new HttpException(StatusCodes.NOT_FOUND, 'Vendor not found');
    }

    return vendor;
  }

  static async createVendor(data: CreateVendorDTO, companyId: string, userId: string) {
    // Check email uniqueness within company if provided
    if (data.email) {
      const existingEmail = await prisma.vendor.findFirst({
        where: { email: data.email, companyId, deletedAt: null }
      });
      if (existingEmail) {
        throw new HttpException(StatusCodes.CONFLICT, 'Vendor with this email already exists');
      }
    }

    const vendorNumber = await this.generateVendorNumber(companyId);

    const vendor = await prisma.vendor.create({
      data: {
        ...data,
        companyId,
        vendorNumber
      }
    });

    await prisma.auditLog.create({
      data: {
        companyId,
        userId,
        action: 'CREATE',
        entityType: 'Vendor',
        entityId: vendor.id,
        newValues: data as any
      }
    });

    return vendor;
  }

  static async updateVendor(id: string, data: UpdateVendorDTO, companyId: string, userId: string) {
    const existing = await this.getVendorById(id, companyId);

    if (data.email && data.email !== existing.email) {
      const emailCheck = await prisma.vendor.findFirst({
        where: { email: data.email, companyId, deletedAt: null, id: { not: id } }
      });
      if (emailCheck) throw new HttpException(StatusCodes.CONFLICT, 'Email is already taken by another vendor');
    }

    const updated = await prisma.vendor.update({
      where: { id },
      data
    });

    await prisma.auditLog.create({
      data: {
        companyId,
        userId,
        action: 'UPDATE',
        entityType: 'Vendor',
        entityId: id,
        oldValues: existing as any,
        newValues: data as any
      }
    });

    return updated;
  }

  static async deleteVendor(id: string, companyId: string, userId: string) {
    await this.getVendorById(id, companyId);

    const deleted = await prisma.vendor.update({
      where: { id },
      data: { deletedAt: new Date(), status: 'INACTIVE', isActive: false }
    });

    await prisma.auditLog.create({
      data: {
        companyId,
        userId,
        action: 'DELETE',
        entityType: 'Vendor',
        entityId: id
      }
    });

    return deleted;
  }

  static async restoreVendor(id: string, companyId: string) {
    const restored = await prisma.vendor.updateMany({
      where: { id, companyId, deletedAt: { not: null } },
      data: { deletedAt: null, status: 'ACTIVE', isActive: true }
    });

    if (restored.count === 0) {
      throw new HttpException(StatusCodes.NOT_FOUND, 'Vendor not found or not deleted');
    }

    return { success: true };
  }
}
