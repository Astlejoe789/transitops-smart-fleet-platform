import { PrismaClient, CustomerStatus, Prisma } from '@prisma/client';
import { CreateCustomerDTO, GetCustomersQuery, UpdateCustomerDTO } from './types.js';
import { HttpException } from '../../shared/exceptions/http.exception.js';
import { StatusCodes } from 'http-status-codes';

const prisma = new PrismaClient();

export class CustomerService {
  /** Generate a unique customer number */
  private static async generateCustomerNumber(companyId: string): Promise<string> {
    const count = await prisma.customer.count({
      where: { companyId }
    });
    return `CUS-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;
  }

  static async getCustomers(companyId: string, query: GetCustomersQuery) {
    const page = Math.max(1, parseInt(query.page || '1'));
    const limit = Math.max(1, parseInt(query.limit || '10'));
    const skip = (page - 1) * limit;

    const { search, status, type, industry, sortBy = 'createdAt', sortOrder = 'desc' } = query;

    const where: Prisma.CustomerWhereInput = {
      companyId,
      deletedAt: null,
      ...(status && { status: status as CustomerStatus }),
      ...(type && { type: type as any }),
      ...(industry && { industry }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search, mode: 'insensitive' } },
          { customerNumber: { contains: search, mode: 'insensitive' } }
        ]
      })
    };

    const [total, data] = await Promise.all([
      prisma.customer.count({ where }),
      prisma.customer.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          _count: { select: { trips: true, invoices: true, contacts: true } }
        }
      })
    ]);

    return {
      data,
      meta: { total, page, limit }
    };
  }

  static async getCustomerById(id: string, companyId: string) {
    const customer = await prisma.customer.findFirst({
      where: { id, companyId, deletedAt: null },
      include: {
        contacts: true,
        documents: true,
        trips: {
          take: 5,
          orderBy: { createdAt: 'desc' }
        },
        invoices: {
          take: 5,
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!customer) {
      throw new HttpException(StatusCodes.NOT_FOUND, 'Customer not found');
    }

    return customer;
  }

  static async createCustomer(data: CreateCustomerDTO, companyId: string, userId: string) {
    // Check email uniqueness within company
    const existingEmail = await prisma.customer.findFirst({
      where: { email: data.email, companyId, deletedAt: null }
    });

    if (existingEmail) {
      throw new HttpException(StatusCodes.CONFLICT, 'Customer with this email already exists');
    }

    const customerNumber = await this.generateCustomerNumber(companyId);

    const customer = await prisma.customer.create({
      data: {
        ...data,
        companyId,
        customerNumber
      }
    });

    // Automatically create the primary contact using the primary info provided
    if (data.name) {
      await prisma.customerContact.create({
        data: {
          customerId: customer.id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          mobile: data.mobile,
          isPrimary: true
        }
      });
    }

    await prisma.auditLog.create({
      data: {
        companyId,
        userId,
        action: 'CREATE',
        entityType: 'Customer',
        entityId: customer.id,
        newValues: data as any
      }
    });

    return customer;
  }

  static async updateCustomer(id: string, data: UpdateCustomerDTO, companyId: string, userId: string) {
    const existing = await this.getCustomerById(id, companyId);

    if (data.email && data.email !== existing.email) {
      const emailCheck = await prisma.customer.findFirst({
        where: { email: data.email, companyId, deletedAt: null, id: { not: id } }
      });
      if (emailCheck) throw new HttpException(StatusCodes.CONFLICT, 'Email is already taken by another customer');
    }

    const updated = await prisma.customer.update({
      where: { id },
      data
    });

    await prisma.auditLog.create({
      data: {
        companyId,
        userId,
        action: 'UPDATE',
        entityType: 'Customer',
        entityId: id,
        oldValues: existing as any,
        newValues: data as any
      }
    });

    return updated;
  }

  static async deleteCustomer(id: string, companyId: string, userId: string) {
    await this.getCustomerById(id, companyId);

    const deleted = await prisma.customer.update({
      where: { id },
      data: { deletedAt: new Date(), status: 'INACTIVE', isActive: false }
    });

    await prisma.auditLog.create({
      data: {
        companyId,
        userId,
        action: 'DELETE',
        entityType: 'Customer',
        entityId: id
      }
    });

    return deleted;
  }

  static async restoreCustomer(id: string, companyId: string) {
    const restored = await prisma.customer.updateMany({
      where: { id, companyId, deletedAt: { not: null } },
      data: { deletedAt: null, status: 'ACTIVE', isActive: true }
    });

    if (restored.count === 0) {
      throw new HttpException(StatusCodes.NOT_FOUND, 'Customer not found or not deleted');
    }

    return { success: true };
  }
}
