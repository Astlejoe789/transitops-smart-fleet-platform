import { PrismaClient, ExpenseStatus, Prisma } from '@prisma/client';
import { CreateExpenseDTO, GetExpensesQuery, UpdateExpenseDTO } from './types.js';
import { HttpException } from '../../shared/exceptions/http.exception.js';
import { StatusCodes } from 'http-status-codes';

const prisma = new PrismaClient();

function generateExpenseNumber(): string {
  const prefix = 'EXP';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}-${timestamp}-${random}`;
}

export class ExpenseService {
  static async getExpenses(companyId: string, query: GetExpensesQuery) {
    const {
      page = 1,
      limit = 10,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      category,
      status,
      paymentMethod,
      vehicleId,
      driverId,
      tripId,
      startDate,
      endDate
    } = query;

    const skip = (Number(page) - 1) * Number(limit);

    const where: Prisma.ExpenseWhereInput = {
      companyId,
      deletedAt: null,
      ...(category && { category }),
      ...(status && { status }),
      ...(paymentMethod && { paymentMethod }),
      ...(vehicleId && { vehicleId }),
      ...(driverId && { driverId }),
      ...(tripId && { tripId }),
      ...(startDate && endDate && {
        expenseDate: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      }),
      ...(search && {
        OR: [
          { expenseNumber: { contains: search, mode: 'insensitive' } },
          { vendorName: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { referenceNumber: { contains: search, mode: 'insensitive' } },
          { receiptNumber: { contains: search, mode: 'insensitive' } }
        ]
      })
    };

    const [total, data] = await Promise.all([
      prisma.expense.count({ where }),
      prisma.expense.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { [sortBy]: sortOrder },
        include: {
          vehicle: { select: { id: true, plateNumber: true, make: true, model: true } },
          driver: { select: { id: true, user: { select: { firstName: true, lastName: true } } } },
          trip: { select: { id: true, tripNumber: true } },
          createdBy: { select: { id: true, firstName: true, lastName: true } },
          approvedBy: { select: { id: true, firstName: true, lastName: true } },
        }
      })
    ]);

    return {
      data,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      }
    };
  }

  static async getExpenseById(id: string, companyId: string) {
    const expense = await prisma.expense.findFirst({
      where: { id, companyId, deletedAt: null },
      include: {
        vehicle: true,
        driver: { include: { user: true } },
        trip: true,
        maintenanceLog: true,
        fuelLog: true,
        documents: true,
        createdBy: { select: { id: true, firstName: true, lastName: true } },
        approvedBy: { select: { id: true, firstName: true, lastName: true } },
      }
    });

    if (!expense) throw new HttpException(StatusCodes.NOT_FOUND, 'Expense not found');
    return expense;
  }

  static async createExpense(data: CreateExpenseDTO, companyId: string, userId: string) {
    const expense = await prisma.expense.create({
      data: {
        ...data,
        companyId,
        createdById: userId,
        expenseNumber: generateExpenseNumber(),
        status: ExpenseStatus.DRAFT,
      }
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        companyId,
        userId,
        action: 'CREATE',
        entityType: 'Expense',
        entityId: expense.id,
        newValues: JSON.parse(JSON.stringify(expense))
      }
    });

    return expense;
  }

  static async updateExpense(id: string, data: UpdateExpenseDTO, companyId: string, userId: string) {
    const existing = await this.getExpenseById(id, companyId);
    
    // Prevent editing of approved or paid expenses unless authorized (simplifying here for demo)
    if (existing.status === 'PAID' || existing.status === 'APPROVED') {
       if (data.status !== 'REJECTED' && data.status !== 'PAID') {
          throw new HttpException(StatusCodes.BAD_REQUEST, 'Cannot edit an approved or paid expense.');
       }
    }

    let approvedById = existing.approvedById;
    if (data.status === 'APPROVED' && existing.status !== 'APPROVED') {
      approvedById = userId;
    }

    const updated = await prisma.expense.update({
      where: { id },
      data: { ...data, approvedById }
    });

    await prisma.auditLog.create({
      data: {
        companyId,
        userId,
        action: 'UPDATE',
        entityType: 'Expense',
        entityId: updated.id,
        oldValues: JSON.parse(JSON.stringify(existing)),
        newValues: JSON.parse(JSON.stringify(updated))
      }
    });

    return updated;
  }

  static async updateExpenseStatus(id: string, status: ExpenseStatus, companyId: string, userId: string, notes?: string) {
    const existing = await this.getExpenseById(id, companyId);
    
    // Validate transitions
    if (existing.status === 'PAID') throw new HttpException(StatusCodes.BAD_REQUEST, 'Expense is already paid');
    if (existing.status === 'REJECTED' && status !== 'DRAFT') throw new HttpException(StatusCodes.BAD_REQUEST, 'Rejected expenses must be returned to draft');

    let approvedById = existing.approvedById;
    if (status === 'APPROVED') approvedById = userId;

    const dataToUpdate: any = { status, approvedById };
    if (notes) {
      dataToUpdate.notes = existing.notes ? `${existing.notes}\n[Status Change]: ${notes}` : `[Status Change]: ${notes}`;
    }

    const updated = await prisma.expense.update({
      where: { id },
      data: dataToUpdate
    });

    await prisma.auditLog.create({
      data: {
        companyId,
        userId,
        action: 'UPDATE',
        entityType: 'Expense',
        entityId: updated.id,
        newValues: { status, notes }
      }
    });

    return updated;
  }

  static async deleteExpense(id: string, companyId: string, userId: string) {
    const existing = await this.getExpenseById(id, companyId);
    if (existing.status === 'APPROVED' || existing.status === 'PAID') {
       throw new HttpException(StatusCodes.BAD_REQUEST, 'Cannot delete an approved or paid expense.');
    }

    const deleted = await prisma.expense.update({
      where: { id },
      data: { deletedAt: new Date() }
    });

    await prisma.auditLog.create({
      data: {
        companyId,
        userId,
        action: 'DELETE',
        entityType: 'Expense',
        entityId: id,
      }
    });

    return deleted;
  }

  static async restoreExpense(id: string, companyId: string) {
    const restored = await prisma.expense.updateMany({
      where: { id, companyId, deletedAt: { not: null } },
      data: { deletedAt: null }
    });

    if (restored.count === 0) throw new HttpException(StatusCodes.NOT_FOUND, 'Expense not found or not deleted');

    return { success: true };
  }

  static async getDashboard(companyId: string) {
    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      todayExpenses,
      monthlyExpenses,
      pendingApprovals,
      approvedExpenses,
      paidExpenses,
      expensesByCategory
    ] = await Promise.all([
      prisma.expense.aggregate({
        where: { companyId, deletedAt: null, expenseDate: { gte: startOfDay } },
        _sum: { amount: true }
      }),
      prisma.expense.aggregate({
        where: { companyId, deletedAt: null, expenseDate: { gte: startOfMonth } },
        _sum: { amount: true }
      }),
      prisma.expense.count({
        where: { companyId, deletedAt: null, status: 'SUBMITTED' }
      }),
      prisma.expense.count({
        where: { companyId, deletedAt: null, status: 'APPROVED' }
      }),
      prisma.expense.count({
        where: { companyId, deletedAt: null, status: 'PAID' }
      }),
      prisma.expense.groupBy({
        by: ['category'],
        where: { companyId, deletedAt: null, expenseDate: { gte: startOfMonth } },
        _sum: { amount: true },
        orderBy: { _sum: { amount: 'desc' } },
        take: 5
      })
    ]);

    return {
      todayExpenses: todayExpenses._sum.amount || 0,
      monthlyExpenses: monthlyExpenses._sum.amount || 0,
      pendingApprovals,
      approvedExpenses,
      paidExpenses,
      topCategories: expensesByCategory.map(e => ({
        category: e.category,
        amount: e._sum.amount || 0
      }))
    };
  }

  static async getAnalytics(companyId: string, startDate?: string, endDate?: string) {
    const where: Prisma.ExpenseWhereInput = {
      companyId,
      deletedAt: null,
      ...(startDate && endDate && {
        expenseDate: { gte: new Date(startDate), lte: new Date(endDate) }
      })
    };

    const [categoryBreakdown, monthlyTrend] = await Promise.all([
      prisma.expense.groupBy({
        by: ['category'],
        where,
        _sum: { amount: true }
      }),
      // Native query might be better for monthly trend, but let's approximate with JS parsing for Prisma compatibility
      prisma.expense.findMany({
        where,
        select: { amount: true, expenseDate: true, category: true }
      })
    ]);

    // Group trend by month
    const trendMap = new Map<string, number>();
    monthlyTrend.forEach(e => {
      const month = e.expenseDate.toISOString().slice(0, 7); // YYYY-MM
      trendMap.set(month, (trendMap.get(month) || 0) + e.amount);
    });

    const trend = Array.from(trendMap.entries())
      .map(([month, amount]) => ({ month, amount }))
      .sort((a, b) => a.month.localeCompare(b.month));

    return {
      categoryBreakdown: categoryBreakdown.map(c => ({ category: c.category, amount: c._sum.amount || 0 })),
      trend
    };
  }
}
