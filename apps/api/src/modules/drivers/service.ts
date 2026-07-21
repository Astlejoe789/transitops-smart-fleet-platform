import { prisma } from '../../database/prisma.js';
import { StatusCodes } from 'http-status-codes';
import { HttpException } from '../../shared/exceptions/http.exception.js';
import bcrypt from 'bcryptjs';
import type { CreateDriverDto, UpdateDriverDto, CreateDriverDocumentDto, AssignVehicleDto } from './validation.js';

interface DriverPaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  branchId?: string;
  licenseCategory?: string;
  licenseExpiryDays?: number;
  medicalExpiryDays?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export class DriverService {
  // ─── List Drivers ────────────────────────────────────────────────────────────
  async getDrivers(companyId: string, params: DriverPaginationParams) {
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 10;
    const skip = (page - 1) * limit;

    const where: any = { companyId, deletedAt: null };

    // Search across name, employeeId, email, phone, licenseNumber
    if (params.search) {
      where.OR = [
        { employeeId: { contains: params.search, mode: 'insensitive' } },
        { licenseNumber: { contains: params.search, mode: 'insensitive' } },
        { phone: { contains: params.search, mode: 'insensitive' } },
        { user: { firstName: { contains: params.search, mode: 'insensitive' } } },
        { user: { lastName: { contains: params.search, mode: 'insensitive' } } },
        { user: { email: { contains: params.search, mode: 'insensitive' } } },
      ];
    }

    if (params.status) where.status = params.status;
    if (params.branchId) where.branchId = params.branchId;
    if (params.licenseCategory) where.licenseCategory = params.licenseCategory;

    // License expiry filter (expiring within N days)
    if (params.licenseExpiryDays) {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() + Number(params.licenseExpiryDays));
      where.licenseExpiry = { lte: cutoff };
    }

    // Medical expiry filter
    if (params.medicalExpiryDays) {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() + Number(params.medicalExpiryDays));
      where.medicalExpiry = { lte: cutoff };
    }

    const sortBy = params.sortBy || 'createdAt';
    const sortOrder = params.sortOrder || 'desc';

    // Handle sorting by nested user fields
    let orderBy: any = { [sortBy]: sortOrder };
    if (sortBy === 'firstName' || sortBy === 'lastName' || sortBy === 'email') {
      orderBy = { user: { [sortBy]: sortOrder } };
    }

    const [total, drivers] = await Promise.all([
      prisma.driver.count({ where }),
      prisma.driver.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              avatarUrl: true,
              status: true,
            },
          },
          branch: { select: { id: true, name: true } },
          assignedVehicle: {
            select: { id: true, plateNumber: true, make: true, model: true },
          },
          _count: { select: { documents: true, trips: true } },
        },
      }),
    ]);

    return {
      data: drivers,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // ─── Get Driver By ID ────────────────────────────────────────────────────────
  async getDriverById(companyId: string, id: string) {
    const driver = await prisma.driver.findFirst({
      where: { id, companyId, deletedAt: null },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatarUrl: true,
            status: true,
          },
        },
        branch: { select: { id: true, name: true, code: true } },
        documents: { orderBy: { createdAt: 'desc' } },
        assignedVehicle: {
          select: {
            id: true,
            plateNumber: true,
            make: true,
            model: true,
            year: true,
            type: true,
            status: true,
          },
        },
        _count: { select: { trips: true, documents: true } },
      },
    });

    if (!driver) {
      throw new HttpException(StatusCodes.NOT_FOUND, 'Driver not found');
    }

    return driver;
  }

  // ─── Create Driver ───────────────────────────────────────────────────────────
  async createDriver(companyId: string, actorUserId: string, data: CreateDriverDto) {
    // Check uniqueness constraints
    const [existingEmployee, existingEmail, existingLicense] = await Promise.all([
      prisma.driver.findFirst({ where: { companyId, employeeId: data.employeeId } }),
      prisma.user.findFirst({ where: { email: data.email } }),
      prisma.driver.findFirst({ where: { licenseNumber: data.licenseNumber } }),
    ]);

    if (existingEmployee) {
      throw new HttpException(StatusCodes.CONFLICT, 'A driver with this Employee ID already exists');
    }
    if (existingEmail) {
      throw new HttpException(StatusCodes.CONFLICT, 'A user with this email already exists');
    }
    if (existingLicense) {
      throw new HttpException(StatusCodes.CONFLICT, 'A driver with this license number already exists');
    }

    // Get the company's default DRIVER role
    const company = await prisma.company.findUnique({ where: { id: companyId } });
    if (!company) throw new HttpException(StatusCodes.NOT_FOUND, 'Company not found');

    let driverRole = await prisma.role.findFirst({
      where: { companyId, name: 'DRIVER' },
    });

    // Fallback: get any role
    if (!driverRole) {
      driverRole = await prisma.role.findFirst({ where: { companyId } });
    }

    if (!driverRole) {
      throw new HttpException(StatusCodes.BAD_REQUEST, 'No roles configured for this company. Please set up roles first.');
    }

    const passwordHash = await bcrypt.hash('Driver@123', 12); // Default password

    const driver = await prisma.$transaction(async (tx) => {
      // 1. Create user account for the driver
      const user = await tx.user.create({
        data: {
          companyId,
          branchId: data.branchId || null,
          roleId: driverRole!.id,
          email: data.email,
          passwordHash,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
        },
      });

      // 2. Create the driver profile
      const newDriver = await tx.driver.create({
        data: {
          companyId,
          userId: user.id,
          branchId: data.branchId || null,
          employeeId: data.employeeId,
          photoUrl: data.photoUrl || null,
          phone: data.phone,
          dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
          gender: data.gender || null,
          bloodGroup: data.bloodGroup || null,
          nationality: data.nationality || null,
          address: data.address || null,
          emergencyContactName: data.emergencyContactName || null,
          emergencyContactPhone: data.emergencyContactPhone || null,
          emergencyContactRelation: data.emergencyContactRelation || null,
          licenseNumber: data.licenseNumber,
          licenseCategory: data.licenseCategory,
          licenseIssuedDate: data.licenseIssuedDate ? new Date(data.licenseIssuedDate) : null,
          licenseExpiry: new Date(data.licenseExpiry),
          licenseIssuingAuthority: data.licenseIssuingAuthority || null,
          medicalCertificateUrl: data.medicalCertificateUrl || null,
          medicalExpiry: data.medicalExpiry ? new Date(data.medicalExpiry) : null,
          fitnessStatus: data.fitnessStatus || null,
          healthNotes: data.healthNotes || null,
          status: data.status || 'AVAILABLE',
          joinedDate: data.joinedDate ? new Date(data.joinedDate) : new Date(),
        },
        include: {
          user: { select: { id: true, firstName: true, lastName: true, email: true } },
          branch: { select: { id: true, name: true } },
        },
      });

      // 3. Audit log
      await tx.auditLog.create({
        data: {
          companyId,
          userId: actorUserId,
          action: 'CREATE',
          entityType: 'DRIVER',
          entityId: newDriver.id,
          newValues: {
            employeeId: data.employeeId,
            name: `${data.firstName} ${data.lastName}`,
            email: data.email,
          } as any,
        },
      });

      return newDriver;
    });

    return driver;
  }

  // ─── Update Driver ───────────────────────────────────────────────────────────
  async updateDriver(companyId: string, actorUserId: string, id: string, data: UpdateDriverDto) {
    const existing = await prisma.driver.findFirst({
      where: { id, companyId, deletedAt: null },
      include: { user: true },
    });

    if (!existing) throw new HttpException(StatusCodes.NOT_FOUND, 'Driver not found');

    // Check uniqueness if changing employeeId
    if (data.employeeId && data.employeeId !== existing.employeeId) {
      const conflict = await prisma.driver.findFirst({
        where: { companyId, employeeId: data.employeeId, id: { not: id } },
      });
      if (conflict) throw new HttpException(StatusCodes.CONFLICT, 'Employee ID already in use');
    }

    // Check uniqueness if changing license
    if (data.licenseNumber && data.licenseNumber !== existing.licenseNumber) {
      const conflict = await prisma.driver.findFirst({
        where: { licenseNumber: data.licenseNumber, id: { not: id } },
      });
      if (conflict) throw new HttpException(StatusCodes.CONFLICT, 'License number already in use');
    }

    // Check email uniqueness if changing
    if (data.email && data.email !== existing.user.email) {
      const emailConflict = await prisma.user.findFirst({
        where: { email: data.email, id: { not: existing.userId } },
      });
      if (emailConflict) throw new HttpException(StatusCodes.CONFLICT, 'Email already in use');
    }

    const updated = await prisma.$transaction(async (tx) => {
      // Update user fields if provided
      if (data.firstName || data.lastName || data.email || data.phone) {
        await tx.user.update({
          where: { id: existing.userId },
          data: {
            ...(data.firstName && { firstName: data.firstName }),
            ...(data.lastName && { lastName: data.lastName }),
            ...(data.email && { email: data.email }),
            ...(data.phone && { phone: data.phone }),
            ...(data.branchId !== undefined && { branchId: data.branchId }),
          },
        });
      }

      // Update driver fields
      const updatedDriver = await tx.driver.update({
        where: { id },
        data: {
          ...(data.employeeId && { employeeId: data.employeeId }),
          ...(data.phone !== undefined && { phone: data.phone }),
          ...(data.photoUrl !== undefined && { photoUrl: data.photoUrl }),
          ...(data.dateOfBirth !== undefined && { dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null }),
          ...(data.gender !== undefined && { gender: data.gender }),
          ...(data.bloodGroup !== undefined && { bloodGroup: data.bloodGroup }),
          ...(data.nationality !== undefined && { nationality: data.nationality }),
          ...(data.address !== undefined && { address: data.address }),
          ...(data.branchId !== undefined && { branchId: data.branchId }),
          ...(data.status && { status: data.status }),
          ...(data.joinedDate !== undefined && { joinedDate: data.joinedDate ? new Date(data.joinedDate) : undefined }),
          ...(data.emergencyContactName !== undefined && { emergencyContactName: data.emergencyContactName }),
          ...(data.emergencyContactPhone !== undefined && { emergencyContactPhone: data.emergencyContactPhone }),
          ...(data.emergencyContactRelation !== undefined && { emergencyContactRelation: data.emergencyContactRelation }),
          ...(data.licenseNumber && { licenseNumber: data.licenseNumber }),
          ...(data.licenseCategory && { licenseCategory: data.licenseCategory }),
          ...(data.licenseIssuedDate !== undefined && { licenseIssuedDate: data.licenseIssuedDate ? new Date(data.licenseIssuedDate) : null }),
          ...(data.licenseExpiry && { licenseExpiry: new Date(data.licenseExpiry) }),
          ...(data.licenseIssuingAuthority !== undefined && { licenseIssuingAuthority: data.licenseIssuingAuthority }),
          ...(data.medicalCertificateUrl !== undefined && { medicalCertificateUrl: data.medicalCertificateUrl }),
          ...(data.medicalExpiry !== undefined && { medicalExpiry: data.medicalExpiry ? new Date(data.medicalExpiry) : null }),
          ...(data.fitnessStatus !== undefined && { fitnessStatus: data.fitnessStatus }),
          ...(data.healthNotes !== undefined && { healthNotes: data.healthNotes }),
        },
        include: {
          user: { select: { id: true, firstName: true, lastName: true, email: true } },
          branch: { select: { id: true, name: true } },
          assignedVehicle: { select: { id: true, plateNumber: true } },
        },
      });

      await tx.auditLog.create({
        data: {
          companyId,
          userId: actorUserId,
          action: 'UPDATE',
          entityType: 'DRIVER',
          entityId: id,
          oldValues: { status: existing.status, employeeId: existing.employeeId } as any,
          newValues: data as any,
        },
      });

      return updatedDriver;
    });

    return updated;
  }

  // ─── Soft Delete Driver ──────────────────────────────────────────────────────
  async deleteDriver(companyId: string, actorUserId: string, id: string) {
    const existing = await prisma.driver.findFirst({
      where: { id, companyId, deletedAt: null },
    });

    if (!existing) throw new HttpException(StatusCodes.NOT_FOUND, 'Driver not found');

    await prisma.$transaction(async (tx) => {
      await tx.driver.update({
        where: { id },
        data: { deletedAt: new Date(), status: 'TERMINATED' },
      });

      await tx.auditLog.create({
        data: {
          companyId,
          userId: actorUserId,
          action: 'DELETE',
          entityType: 'DRIVER',
          entityId: id,
          oldValues: { employeeId: existing.employeeId } as any,
        },
      });
    });

    return { success: true, message: 'Driver deleted successfully' };
  }

  // ─── Restore Driver ──────────────────────────────────────────────────────────
  async restoreDriver(companyId: string, actorUserId: string, id: string) {
    const existing = await prisma.driver.findFirst({
      where: { id, companyId, deletedAt: { not: null } },
    });

    if (!existing) throw new HttpException(StatusCodes.NOT_FOUND, 'Deleted driver not found');

    await prisma.$transaction(async (tx) => {
      await tx.driver.update({
        where: { id },
        data: { deletedAt: null, status: 'AVAILABLE' },
      });

      await tx.auditLog.create({
        data: {
          companyId,
          userId: actorUserId,
          action: 'UPDATE',
          entityType: 'DRIVER',
          entityId: id,
          newValues: { action: 'RESTORED', status: 'AVAILABLE' } as any,
        },
      });
    });

    return { success: true, message: 'Driver restored successfully' };
  }

  // ─── Get Driver Documents ────────────────────────────────────────────────────
  async getDriverDocuments(companyId: string, driverId: string) {
    const driver = await prisma.driver.findFirst({
      where: { id: driverId, companyId, deletedAt: null },
    });

    if (!driver) throw new HttpException(StatusCodes.NOT_FOUND, 'Driver not found');

    return prisma.driverDocument.findMany({
      where: { driverId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ─── Add Document ────────────────────────────────────────────────────────────
  async addDocument(
    companyId: string,
    actorUserId: string,
    driverId: string,
    data: CreateDriverDocumentDto,
  ) {
    const driver = await prisma.driver.findFirst({
      where: { id: driverId, companyId, deletedAt: null },
    });

    if (!driver) throw new HttpException(StatusCodes.NOT_FOUND, 'Driver not found');

    const document = await prisma.$transaction(async (tx) => {
      const doc = await tx.driverDocument.create({
        data: {
          driverId,
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
          userId: actorUserId,
          action: 'CREATE',
          entityType: 'DRIVER_DOCUMENT',
          entityId: doc.id,
          newValues: { driverId, documentType: data.documentType, title: data.title } as any,
        },
      });

      return doc;
    });

    return document;
  }

  // ─── Delete Document ─────────────────────────────────────────────────────────
  async deleteDocument(companyId: string, actorUserId: string, docId: string) {
    const document = await prisma.driverDocument.findFirst({
      where: { id: docId, driver: { companyId } },
    });

    if (!document) throw new HttpException(StatusCodes.NOT_FOUND, 'Document not found');

    await prisma.$transaction(async (tx) => {
      await tx.driverDocument.delete({ where: { id: docId } });

      await tx.auditLog.create({
        data: {
          companyId,
          userId: actorUserId,
          action: 'DELETE',
          entityType: 'DRIVER_DOCUMENT',
          entityId: docId,
          oldValues: { documentType: document.documentType } as any,
        },
      });
    });

    return { success: true };
  }

  // ─── Assign Vehicle ──────────────────────────────────────────────────────────
  async assignVehicle(
    companyId: string,
    actorUserId: string,
    driverId: string,
    data: AssignVehicleDto,
  ) {
    const driver = await prisma.driver.findFirst({
      where: { id: driverId, companyId, deletedAt: null },
    });

    if (!driver) throw new HttpException(StatusCodes.NOT_FOUND, 'Driver not found');

    const vehicle = await prisma.vehicle.findFirst({
      where: { id: data.vehicleId, companyId, deletedAt: null },
    });

    if (!vehicle) throw new HttpException(StatusCodes.NOT_FOUND, 'Vehicle not found');

    const updated = await prisma.$transaction(async (tx) => {
      const result = await tx.driver.update({
        where: { id: driverId },
        data: { assignedVehicleId: data.vehicleId },
        include: {
          assignedVehicle: { select: { id: true, plateNumber: true, make: true, model: true } },
        },
      });

      await tx.auditLog.create({
        data: {
          companyId,
          userId: actorUserId,
          action: 'UPDATE',
          entityType: 'DRIVER',
          entityId: driverId,
          newValues: { action: 'VEHICLE_ASSIGNED', vehicleId: data.vehicleId, plateNumber: vehicle.plateNumber } as any,
        },
      });

      return result;
    });

    return updated;
  }

  // ─── Unassign Vehicle ────────────────────────────────────────────────────────
  async unassignVehicle(companyId: string, actorUserId: string, driverId: string) {
    const driver = await prisma.driver.findFirst({
      where: { id: driverId, companyId, deletedAt: null },
    });

    if (!driver) throw new HttpException(StatusCodes.NOT_FOUND, 'Driver not found');
    if (!driver.assignedVehicleId) {
      throw new HttpException(StatusCodes.BAD_REQUEST, 'Driver has no assigned vehicle');
    }

    const updated = await prisma.$transaction(async (tx) => {
      const result = await tx.driver.update({
        where: { id: driverId },
        data: { assignedVehicleId: null },
      });

      await tx.auditLog.create({
        data: {
          companyId,
          userId: actorUserId,
          action: 'UPDATE',
          entityType: 'DRIVER',
          entityId: driverId,
          newValues: { action: 'VEHICLE_UNASSIGNED', previousVehicleId: driver.assignedVehicleId } as any,
        },
      });

      return result;
    });

    return updated;
  }

  // ─── Driver Timeline (Audit Log) ─────────────────────────────────────────────
  async getDriverTimeline(companyId: string, driverId: string) {
    const driver = await prisma.driver.findFirst({
      where: { id: driverId, companyId },
    });

    if (!driver) throw new HttpException(StatusCodes.NOT_FOUND, 'Driver not found');

    const logs = await prisma.auditLog.findMany({
      where: {
        companyId,
        entityType: { in: ['DRIVER', 'DRIVER_DOCUMENT'] },
        entityId: driverId,
      },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return logs;
  }

  // ─── Driver Stats ─────────────────────────────────────────────────────────────
  async getDriverStats(companyId: string) {
    const [total, available, onTrip, suspended, expiringLicense, expiredLicense] = await Promise.all([
      prisma.driver.count({ where: { companyId, deletedAt: null } }),
      prisma.driver.count({ where: { companyId, deletedAt: null, status: 'AVAILABLE' } }),
      prisma.driver.count({ where: { companyId, deletedAt: null, status: 'ON_TRIP' } }),
      prisma.driver.count({ where: { companyId, deletedAt: null, status: 'SUSPENDED' } }),
      prisma.driver.count({
        where: {
          companyId,
          deletedAt: null,
          licenseExpiry: { gt: new Date(), lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
        },
      }),
      prisma.driver.count({
        where: { companyId, deletedAt: null, licenseExpiry: { lt: new Date() } },
      }),
    ]);

    return { total, available, onTrip, suspended, expiringLicense, expiredLicense };
  }
}

export const driverService = new DriverService();
