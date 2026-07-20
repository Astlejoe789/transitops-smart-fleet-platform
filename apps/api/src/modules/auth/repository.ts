import { prisma } from '../../database/prisma.js';
import type { User, Company, Role } from '@prisma/client';

export class AuthRepository {
  async findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email, deletedAt: null },
      include: {
        company: true,
        branch: true,
        role: {
          include: {
            rolePermissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });
  }

  async findUserById(id: string) {
    return prisma.user.findUnique({
      where: { id, deletedAt: null },
      include: {
        company: true,
        branch: true,
        role: {
          include: {
            rolePermissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });
  }

  async findCompanyByCode(code: string): Promise<Company | null> {
    return prisma.company.findUnique({
      where: { code, deletedAt: null },
    });
  }

  async findRoleByName(name: string, companyId?: string): Promise<Role | null> {
    return prisma.role.findFirst({
      where: {
        name: name as any,
        OR: [{ companyId: null }, { companyId }],
      },
    });
  }

  async createCompanyWithAdmin(data: {
    companyName: string;
    companyCode: string;
    firstName: string;
    lastName: string;
    email: string;
    passwordHash: string;
    phone?: string;
    roleId: string;
  }) {
    return prisma.$transaction(async (tx) => {
      const company = await tx.company.create({
        data: {
          name: data.companyName,
          code: data.companyCode,
          email: data.email,
          phone: data.phone,
          isActive: true,
        },
      });

      const user = await tx.user.create({
        data: {
          companyId: company.id,
          roleId: data.roleId,
          email: data.email,
          passwordHash: data.passwordHash,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
        },
        include: {
          company: true,
          branch: true,
          role: true,
        },
      });

      return { company, user };
    });
  }

  async updateUserPassword(userId: string, passwordHash: string): Promise<User> {
    return prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });
  }

  async updateLastLogin(userId: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { lastLoginAt: new Date() },
    });
  }
}
