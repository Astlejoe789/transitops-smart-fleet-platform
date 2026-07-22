import { prisma } from '../../database/index.js';
import * as os from 'os'; // for mock system health

export class AdministrationService {
  /**
   * User Management
   */
  async getUsers(companyId: string, filters: any = {}) {
    const where: any = { companyId };
    if (filters.status) where.status = filters.status;
    if (filters.roleId) where.roleId = filters.roleId;
    if (filters.search) {
      where.OR = [
        { firstName: { contains: filters.search, mode: 'insensitive' } },
        { lastName: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const users = await prisma.user.findMany({
      where,
      include: {
        role: { select: { id: true, name: true, isSystem: true } },
        branch: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: filters.limit ? parseInt(filters.limit, 10) : 50,
      skip: filters.offset ? parseInt(filters.offset, 10) : 0,
    });

    const total = await prisma.user.count({ where });
    return { users, total };
  }

  async updateUserStatus(companyId: string, targetUserId: string, status: any, adminUserId: string) {
    const updated = await prisma.user.updateMany({
      where: { id: targetUserId, companyId },
      data: { status },
    });

    await prisma.auditLog.create({
      data: {
        companyId,
        userId: adminUserId,
        action: 'UPDATE',
        entityType: 'USER',
        entityId: targetUserId,
        newValues: { status },
      }
    });

    return updated;
  }

  /**
   * Role & Permission Management
   */
  async getRoles(companyId: string) {
    // Return company specific and system wide roles
    return prisma.role.findMany({
      where: {
        OR: [{ companyId }, { isSystem: true }],
      },
      include: {
        rolePermissions: {
          include: { permission: true }
        }
      },
      orderBy: { name: 'asc' },
    });
  }

  async getPermissions() {
    return prisma.permission.findMany({
      orderBy: [{ module: 'asc' }, { action: 'asc' }],
    });
  }

  async assignRolePermissions(companyId: string, roleId: string, permissionIds: string[], adminUserId: string) {
    // Validate role belongs to company (cannot edit system roles this way)
    const role = await prisma.role.findFirst({ where: { id: roleId, companyId, isSystem: false } });
    if (!role) throw new Error("Role not found or is a system role");

    // Clear existing
    await prisma.rolePermission.deleteMany({
      where: { roleId },
    });

    // Assign new
    if (permissionIds.length > 0) {
      await prisma.rolePermission.createMany({
        data: permissionIds.map(pid => ({ roleId, permissionId: pid })),
      });
    }

    await prisma.auditLog.create({
      data: {
        companyId,
        userId: adminUserId,
        action: 'UPDATE',
        entityType: 'ROLE',
        entityId: roleId,
        newValues: { permissions: permissionIds.length },
      }
    });

    return { success: true };
  }

  /**
   * Settings (System Config)
   */
  async getSettings(companyId: string, category: string) {
    let setting = await prisma.setting.findFirst({
      where: { companyId, category },
    });

    if (!setting) {
      // Lazy init based on category
      setting = await prisma.setting.create({
        data: {
          companyId,
          category,
          key: `${category}_CONFIG`,
          value: {}, // Default empty json
        }
      });
    }
    return setting;
  }

  async updateSettings(companyId: string, category: string, configData: any, adminUserId: string) {
    const setting = await this.getSettings(companyId, category);
    
    const updated = await prisma.setting.update({
      where: { id: setting.id },
      data: {
        value: {
          ...(setting.value as any),
          ...configData
        }
      }
    });

    await prisma.auditLog.create({
      data: {
        companyId,
        userId: adminUserId,
        action: 'UPDATE',
        entityType: 'SETTING',
        entityId: setting.id,
        newValues: { category },
      }
    });

    return updated;
  }

  /**
   * Audit Logs
   */
  async getAuditLogs(companyId: string, filters: any = {}) {
    const where: any = { companyId };
    if (filters.userId) where.userId = filters.userId;
    if (filters.action) where.action = filters.action;
    if (filters.entityType) where.entityType = filters.entityType;

    const logs = await prisma.auditLog.findMany({
      where,
      include: {
        user: { select: { firstName: true, lastName: true, email: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: filters.limit ? parseInt(filters.limit, 10) : 50,
      skip: filters.offset ? parseInt(filters.offset, 10) : 0,
    });

    const total = await prisma.auditLog.count({ where });
    return { logs, total };
  }

  /**
   * System Health Dashboard (Admin Stats)
   */
  async getSystemHealth(companyId: string) {
    // Mock system metrics
    const totalUsers = await prisma.user.count({ where: { companyId } });
    const activeUsers = await prisma.user.count({ where: { companyId, status: 'ACTIVE' } });
    const totalRoles = await prisma.role.count({ where: { OR: [{ companyId }, { isSystem: true }] } });
    const branchesCount = await prisma.branch.count({ where: { companyId } });

    // Try dummy DB query for latency
    const start = performance.now();
    await prisma.$queryRaw`SELECT 1`;
    const latency = (performance.now() - start).toFixed(2);

    return {
      stats: {
        totalUsers,
        activeUsers,
        totalRoles,
        branchesCount,
      },
      health: {
        dbStatus: 'CONNECTED',
        dbLatency: `${latency}ms`,
        apiStatus: 'ONLINE',
        apiVersion: 'v1.16.0',
        memoryUsage: `${Math.round(os.freemem() / 1024 / 1024)}MB Free / ${Math.round(os.totalmem() / 1024 / 1024)}MB Total`,
        cpuUsage: 'Nominal', // placeholder
        storageUsage: '42%', // placeholder
        uptime: os.uptime(),
      }
    };
  }
}
