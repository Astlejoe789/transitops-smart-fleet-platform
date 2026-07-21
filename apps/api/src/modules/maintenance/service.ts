import { prisma } from '../../database/prisma.js';
import { MaintenanceStatus, MaintenancePriority, AuditAction, Prisma } from '@prisma/client';
import { HttpException } from '../../shared/exceptions/http.exception.js';

export class MaintenanceService {
  /**
   * Helper to log audit events
   */
  private async logAudit(companyId: string, userId: string, action: AuditAction, entityId: string, oldValues?: any, newValues?: any) {
    await prisma.auditLog.create({
      data: {
        companyId,
        userId,
        action,
        entityType: 'MAINTENANCE',
        entityId,
        oldValues: oldValues ? JSON.parse(JSON.stringify(oldValues)) : undefined,
        newValues: newValues ? JSON.parse(JSON.stringify(newValues)) : undefined,
      },
    });
  }

  private async generateMaintenanceId(companyId: string): Promise<string> {
    const today = new Date();
    const prefix = `MNT-${today.getFullYear()}${(today.getMonth() + 1).toString().padStart(2, '0')}${today.getDate().toString().padStart(2, '0')}`;
    
    const count = await prisma.maintenanceLog.count({
      where: {
        companyId,
        maintenanceId: { startsWith: prefix },
      },
    });

    return `${prefix}-${(count + 1).toString().padStart(4, '0')}`;
  }

  /**
   * Get all maintenance logs with pagination and filtering
   */
  async getMaintenanceLogs(companyId: string, query: any = {}) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.MaintenanceLogWhereInput = {
      companyId,
      deletedAt: null,
    };

    if (query.search) {
      where.OR = [
        { maintenanceId: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
        { vehicle: { plateNumber: { contains: query.search, mode: 'insensitive' } } },
      ];
    }
    if (query.status) where.status = query.status as MaintenanceStatus;
    if (query.priority) where.priority = query.priority as MaintenancePriority;
    if (query.vehicleId) where.vehicleId = query.vehicleId;
    if (query.vendorId) where.vendorId = query.vendorId;
    if (query.technicianId) where.assignedTechnicianId = query.technicianId;
    if (query.type) where.maintenanceType = query.type;

    const [data, total] = await Promise.all([
      prisma.maintenanceLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: query.sortBy ? { [query.sortBy]: query.sortOrder || 'desc' } : { createdAt: 'desc' },
        include: {
          vehicle: { select: { plateNumber: true, make: true, model: true } },
          vendor: { select: { name: true } },
          assignedTechnician: { select: { firstName: true, lastName: true } },
        },
      }),
      prisma.maintenanceLog.count({ where }),
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
   * Get a single maintenance log by ID
   */
  async getMaintenanceLogById(companyId: string, id: string) {
    const log = await prisma.maintenanceLog.findFirst({
      where: { id, companyId, deletedAt: null },
      include: {
        vehicle: true,
        vendor: true,
        assignedTechnician: { select: { id: true, firstName: true, lastName: true, email: true } },
        parts: { include: { supplier: true } },
        documents: true,
      },
    });

    if (!log) throw new HttpException(404, 'Maintenance log not found');
    return log;
  }

  /**
   * Create a new maintenance log
   */
  async createMaintenanceLog(companyId: string, userId: string, data: any) {
    const vehicle = await prisma.vehicle.findFirst({
      where: { id: data.vehicleId, companyId, deletedAt: null },
    });

    if (!vehicle) throw new HttpException(404, 'Vehicle not found');

    const maintenanceId = await this.generateMaintenanceId(companyId);

    const log = await prisma.maintenanceLog.create({
      data: {
        companyId,
        maintenanceId,
        vehicleId: data.vehicleId,
        vendorId: data.vendorId,
        assignedTechnicianId: data.assignedTechnicianId,
        maintenanceType: data.maintenanceType,
        priority: data.priority,
        status: 'SCHEDULED',
        description: data.description,
        estimatedCost: data.estimatedCost || 0,
        scheduledDate: new Date(data.scheduledDate),
        estimatedDuration: data.estimatedDuration,
        odometerReading: data.odometerReading,
        notes: data.notes,
        checklist: data.checklist ? data.checklist : undefined,
      },
    });

    await this.logAudit(companyId, userId, 'CREATE', log.id, null, log);

    // Ensure vehicle status becomes UNDER_MAINTENANCE if it's scheduled for today or starting immediately.
    // For simplicity, we just create the log. Updating vehicle status can happen when status -> IN_PROGRESS.

    return log;
  }

  /**
   * Update maintenance log
   */
  async updateMaintenanceLog(companyId: string, userId: string, id: string, data: any) {
    const log = await prisma.maintenanceLog.findFirst({
      where: { id, companyId, deletedAt: null },
    });

    if (!log) throw new HttpException(404, 'Maintenance log not found');

    const updated = await prisma.maintenanceLog.update({
      where: { id },
      data: {
        ...data,
        scheduledDate: data.scheduledDate ? new Date(data.scheduledDate) : undefined,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        completedDate: data.completedDate ? new Date(data.completedDate) : undefined,
      },
    });

    await this.logAudit(companyId, userId, 'UPDATE', log.id, log, updated);

    return updated;
  }

  /**
   * Soft delete maintenance log
   */
  async deleteMaintenanceLog(companyId: string, userId: string, id: string) {
    const log = await prisma.maintenanceLog.findFirst({
      where: { id, companyId, deletedAt: null },
    });

    if (!log) throw new HttpException(404, 'Maintenance log not found');

    if (['IN_PROGRESS', 'VERIFIED'].includes(log.status)) {
      throw new HttpException(400, 'Cannot delete a maintenance log that is currently in progress or verified');
    }

    const deleted = await prisma.maintenanceLog.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    await this.logAudit(companyId, userId, 'DELETE', id, log, { deletedAt: deleted.deletedAt });

    return true;
  }

  /**
   * Restore soft deleted maintenance log
   */
  async restoreMaintenanceLog(companyId: string, userId: string, id: string) {
    const log = await prisma.maintenanceLog.findFirst({
      where: { id, companyId, deletedAt: { not: null } },
    });

    if (!log) throw new HttpException(404, 'Maintenance log not found or not deleted');

    await prisma.maintenanceLog.update({
      where: { id },
      data: { deletedAt: null },
    });

    await this.logAudit(companyId, userId, 'UPDATE', id, { deletedAt: log.deletedAt }, { deletedAt: null });

    return true;
  }

  /**
   * Update status workflow
   */
  async updateMaintenanceStatus(companyId: string, userId: string, id: string, status: MaintenanceStatus, notes?: string) {
    const log = await prisma.maintenanceLog.findFirst({
      where: { id, companyId, deletedAt: null },
    });

    if (!log) throw new HttpException(404, 'Maintenance log not found');

    const validTransitions: Record<MaintenanceStatus, MaintenanceStatus[]> = {
      SCHEDULED: ['TECHNICIAN_ASSIGNED', 'CANCELLED'],
      TECHNICIAN_ASSIGNED: ['IN_PROGRESS', 'SCHEDULED', 'CANCELLED'],
      IN_PROGRESS: ['WAITING_FOR_PARTS', 'COMPLETED', 'CANCELLED'],
      WAITING_FOR_PARTS: ['IN_PROGRESS', 'CANCELLED'],
      COMPLETED: ['VERIFIED', 'IN_PROGRESS'],
      VERIFIED: ['CLOSED'],
      CLOSED: [],
      CANCELLED: ['SCHEDULED'],
    };

    if (!validTransitions[log.status].includes(status)) {
      throw new HttpException(400, `Cannot transition from ${log.status} to ${status}`);
    }

    const dataToUpdate: any = { status };
    if (notes) {
      dataToUpdate.notes = log.notes ? `${log.notes}\n${notes}` : notes;
    }

    if (status === 'IN_PROGRESS') {
      dataToUpdate.startDate = new Date();
      // Update vehicle status
      await prisma.vehicle.update({
        where: { id: log.vehicleId },
        data: { status: 'UNDER_MAINTENANCE' },
      });
    }

    if (status === 'COMPLETED') {
      dataToUpdate.completedDate = new Date();
      // Do not release vehicle until VERIFIED or CLOSED, depending on policy. 
      // We will release it on VERIFIED.
    }

    if (status === 'VERIFIED' || status === 'CANCELLED') {
      // Release vehicle back to available if it's currently under maintenance
      const vehicle = await prisma.vehicle.findUnique({ where: { id: log.vehicleId } });
      if (vehicle?.status === 'UNDER_MAINTENANCE') {
        await prisma.vehicle.update({
          where: { id: log.vehicleId },
          data: { status: 'AVAILABLE' },
        });
      }
    }

    const updated = await prisma.maintenanceLog.update({
      where: { id },
      data: dataToUpdate,
    });

    await this.logAudit(companyId, userId, 'UPDATE', id, { status: log.status }, { status: updated.status });

    return updated;
  }

  /**
   * Assign Technician
   */
  async assignTechnician(companyId: string, userId: string, id: string, technicianId: string) {
    const log = await prisma.maintenanceLog.findFirst({
      where: { id, companyId, deletedAt: null },
    });

    if (!log) throw new HttpException(404, 'Maintenance log not found');

    const technician = await prisma.user.findFirst({
      where: { id: technicianId, companyId, deletedAt: null },
    });

    if (!technician) throw new HttpException(404, 'Technician not found');

    const updated = await prisma.maintenanceLog.update({
      where: { id },
      data: {
        assignedTechnicianId: technicianId,
        status: log.status === 'SCHEDULED' ? 'TECHNICIAN_ASSIGNED' : undefined,
      },
    });

    await this.logAudit(companyId, userId, 'UPDATE', id, { assignedTechnicianId: log.assignedTechnicianId }, { assignedTechnicianId: updated.assignedTechnicianId });

    return updated;
  }

  /**
   * Add a part
   */
  async addPart(companyId: string, userId: string, logId: string, data: any) {
    const log = await prisma.maintenanceLog.findFirst({
      where: { id: logId, companyId, deletedAt: null },
    });

    if (!log) throw new HttpException(404, 'Maintenance log not found');

    const totalCost = data.quantity * data.unitCost;

    const part = await prisma.maintenancePart.create({
      data: {
        maintenanceLogId: logId,
        name: data.name,
        quantity: data.quantity,
        unitCost: data.unitCost,
        totalCost,
        supplierId: data.supplierId,
        warranty: data.warranty,
        stockReference: data.stockReference,
      },
    });

    // Update log's actual cost
    await prisma.maintenanceLog.update({
      where: { id: logId },
      data: {
        actualCost: { increment: totalCost },
      },
    });

    await this.logAudit(companyId, userId, 'CREATE', logId, null, { action: 'ADDED_PART', part });

    return part;
  }

  /**
   * Delete a part
   */
  async deletePart(companyId: string, userId: string, logId: string, partId: string) {
    const log = await prisma.maintenanceLog.findFirst({
      where: { id: logId, companyId, deletedAt: null },
    });

    if (!log) throw new HttpException(404, 'Maintenance log not found');

    const part = await prisma.maintenancePart.findFirst({
      where: { id: partId, maintenanceLogId: logId },
    });

    if (!part) throw new HttpException(404, 'Part not found');

    await prisma.maintenancePart.delete({
      where: { id: partId },
    });

    // Update log's actual cost
    await prisma.maintenanceLog.update({
      where: { id: logId },
      data: {
        actualCost: { decrement: part.totalCost },
      },
    });

    await this.logAudit(companyId, userId, 'DELETE', logId, { action: 'DELETED_PART', part }, null);

    return true;
  }

  /**
   * Add a document
   */
  async addDocument(companyId: string, userId: string, logId: string, data: { title: string; documentType: string; fileUrl: string }) {
    const log = await prisma.maintenanceLog.findFirst({
      where: { id: logId, companyId, deletedAt: null },
    });

    if (!log) throw new HttpException(404, 'Maintenance log not found');

    const doc = await prisma.maintenanceDocument.create({
      data: {
        maintenanceLogId: logId,
        title: data.title,
        documentType: data.documentType,
        fileUrl: data.fileUrl,
      },
    });

    await this.logAudit(companyId, userId, 'CREATE', logId, null, { action: 'ADDED_DOCUMENT', doc });

    return doc;
  }

  /**
   * Delete a document
   */
  async deleteDocument(companyId: string, userId: string, logId: string, docId: string) {
    const doc = await prisma.maintenanceDocument.findFirst({
      where: { id: docId, maintenanceLogId: logId },
    });

    if (!doc) throw new HttpException(404, 'Document not found');

    await prisma.maintenanceDocument.delete({
      where: { id: docId },
    });

    await this.logAudit(companyId, userId, 'DELETE', logId, { action: 'DELETED_DOCUMENT', doc }, null);

    return true;
  }
}

export const maintenanceService = new MaintenanceService();
