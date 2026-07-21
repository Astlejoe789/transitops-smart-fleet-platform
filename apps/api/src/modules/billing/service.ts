import { PrismaClient, InvoiceStatus, Prisma } from '@prisma/client';
import { CreateInvoiceDTO, GetInvoicesQuery, UpdateInvoiceDTO } from './types.js';
import { HttpException } from '../../shared/exceptions/http.exception.js';
import { StatusCodes } from 'http-status-codes';

const prisma = new PrismaClient();

export class BillingService {
  // ─────────────────────────────────────────────────────────
  // Helpers
  // ─────────────────────────────────────────────────────────
  private static async generateInvoiceNumber(companyId: string): Promise<string> {
    const count = await prisma.invoice.count({ where: { companyId } });
    return `INV-${new Date().getFullYear()}-${String(count + 1).padStart(5, '0')}`;
  }

  private static computeTotals(items: { quantity: number; unitPrice: number }[], taxAmount = 0) {
    const subtotal = items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
    const totalAmount = subtotal + taxAmount;
    return { subtotal, totalAmount };
  }

  // ─────────────────────────────────────────────────────────
  // Queries
  // ─────────────────────────────────────────────────────────
  static async getInvoices(companyId: string, query: GetInvoicesQuery) {
    const page = Math.max(1, parseInt(query.page || '1'));
    const limit = Math.max(1, Math.min(100, parseInt(query.limit || '15')));
    const skip = (page - 1) * limit;

    const { search, status, customerId, tripId, startDate, endDate, sortBy = 'createdAt', sortOrder = 'desc' } = query;

    const where: Prisma.InvoiceWhereInput = {
      companyId,
      deletedAt: null,
      ...(status && { status: status as InvoiceStatus }),
      ...(customerId && { customerId }),
      ...(tripId && { tripId }),
      ...(startDate && { issueDate: { gte: new Date(startDate) } }),
      ...(endDate && { issueDate: { lte: new Date(endDate) } }),
      ...(search && {
        OR: [
          { invoiceNumber: { contains: search, mode: 'insensitive' } },
          { customer: { name: { contains: search, mode: 'insensitive' } } },
          { notes: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [total, data] = await Promise.all([
      prisma.invoice.count({ where }),
      prisma.invoice.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          customer: { select: { id: true, name: true, email: true } },
          _count: { select: { items: true, payments: true } },
        },
      }),
    ]);

    return { data, meta: { total, page, limit } };
  }

  static async getInvoiceSummary(companyId: string) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [outstanding, overdue, paidMtd, drafts] = await Promise.all([
      prisma.invoice.aggregate({
        where: { companyId, status: { in: ['ISSUED', 'PARTIALLY_PAID'] }, deletedAt: null },
        _sum: { totalAmount: true },
        _count: true,
      }),
      prisma.invoice.aggregate({
        where: { companyId, status: 'OVERDUE', deletedAt: null },
        _sum: { totalAmount: true },
        _count: true,
      }),
      prisma.invoice.aggregate({
        where: { companyId, status: 'PAID', issueDate: { gte: startOfMonth }, deletedAt: null },
        _sum: { totalAmount: true },
        _count: true,
      }),
      prisma.invoice.count({ where: { companyId, status: 'DRAFT', deletedAt: null } }),
    ]);

    return {
      outstanding: { amount: outstanding._sum.totalAmount ?? 0, count: outstanding._count },
      overdue: { amount: overdue._sum.totalAmount ?? 0, count: overdue._count },
      paidMtd: { amount: paidMtd._sum.totalAmount ?? 0, count: paidMtd._count },
      drafts,
    };
  }

  static async getInvoiceById(id: string, companyId: string) {
    const invoice = await prisma.invoice.findFirst({
      where: { id, companyId, deletedAt: null },
      include: {
        customer: true,
        trip: { select: { id: true, tripNumber: true, origin: true, destination: true } },
        items: true,
        payments: { orderBy: { paymentDate: 'desc' } },
      },
    });

    if (!invoice) throw new HttpException(StatusCodes.NOT_FOUND, 'Invoice not found');
    return invoice;
  }

  // ─────────────────────────────────────────────────────────
  // Mutations
  // ─────────────────────────────────────────────────────────
  static async createInvoice(data: CreateInvoiceDTO, companyId: string, userId: string) {
    const { items, taxAmount = 0, ...rest } = data;
    const invoiceNumber = await this.generateInvoiceNumber(companyId);
    const { subtotal, totalAmount } = this.computeTotals(items, taxAmount);

    const invoice = await prisma.invoice.create({
      data: {
        ...rest,
        companyId,
        invoiceNumber,
        subtotal,
        taxAmount,
        totalAmount,
        dueDate: new Date(rest.dueDate),
        items: {
          create: items.map((item) => ({
            ...item,
            totalPrice: item.quantity * item.unitPrice,
          })),
        },
      },
      include: { items: true },
    });

    await prisma.auditLog.create({
      data: { companyId, userId, action: 'CREATE', entityType: 'Invoice', entityId: invoice.id },
    });

    return invoice;
  }

  static async updateInvoice(id: string, data: UpdateInvoiceDTO, companyId: string, userId: string) {
    const existing = await this.getInvoiceById(id, companyId);

    if (existing.status !== 'DRAFT') {
      throw new HttpException(StatusCodes.BAD_REQUEST, 'Only DRAFT invoices can be edited');
    }

    const taxAmount = data.taxAmount ?? existing.taxAmount;
    const items = data.items;
    const subtotal = items ? this.computeTotals(items, 0).subtotal : existing.subtotal;
    const totalAmount = subtotal + taxAmount;

    const invoice = await prisma.invoice.update({
      where: { id },
      data: {
        ...(data.dueDate && { dueDate: new Date(data.dueDate) }),
        ...(data.notes !== undefined && { notes: data.notes }),
        taxAmount,
        subtotal,
        totalAmount,
        ...(items && {
          items: {
            deleteMany: {},
            create: items.map((item) => ({ ...item, totalPrice: item.quantity * item.unitPrice })),
          },
        }),
      },
      include: { items: true },
    });

    await prisma.auditLog.create({
      data: { companyId, userId, action: 'UPDATE', entityType: 'Invoice', entityId: id, newValues: data as any },
    });

    return invoice;
  }

  static async issueInvoice(id: string, companyId: string, userId: string) {
    const existing = await this.getInvoiceById(id, companyId);

    if (existing.status !== 'DRAFT') {
      throw new HttpException(StatusCodes.BAD_REQUEST, 'Only DRAFT invoices can be issued');
    }

    const invoice = await prisma.invoice.update({
      where: { id },
      data: { status: 'ISSUED' },
    });

    await prisma.auditLog.create({
      data: { companyId, userId, action: 'UPDATE', entityType: 'Invoice', entityId: id, newValues: { status: 'ISSUED' } as any },
    });

    return invoice;
  }

  static async voidInvoice(id: string, companyId: string, userId: string) {
    const existing = await this.getInvoiceById(id, companyId);

    if (!['DRAFT', 'ISSUED'].includes(existing.status)) {
      throw new HttpException(StatusCodes.BAD_REQUEST, 'Only DRAFT or ISSUED invoices can be voided');
    }

    const invoice = await prisma.invoice.update({ where: { id }, data: { status: 'VOID' } });

    await prisma.auditLog.create({
      data: { companyId, userId, action: 'UPDATE', entityType: 'Invoice', entityId: id, newValues: { status: 'VOID' } as any },
    });

    return invoice;
  }

  static async cancelInvoice(id: string, companyId: string, userId: string) {
    const existing = await this.getInvoiceById(id, companyId);

    if (['PAID', 'CANCELLED', 'VOID'].includes(existing.status)) {
      throw new HttpException(StatusCodes.BAD_REQUEST, `Cannot cancel a ${existing.status} invoice`);
    }

    const invoice = await prisma.invoice.update({ where: { id }, data: { status: 'CANCELLED' } });

    await prisma.auditLog.create({
      data: { companyId, userId, action: 'UPDATE', entityType: 'Invoice', entityId: id, newValues: { status: 'CANCELLED' } as any },
    });

    return invoice;
  }

  static async deleteInvoice(id: string, companyId: string, userId: string) {
    const existing = await this.getInvoiceById(id, companyId);

    if (!['DRAFT', 'VOID', 'CANCELLED'].includes(existing.status)) {
      throw new HttpException(StatusCodes.BAD_REQUEST, 'Only DRAFT, VOID, or CANCELLED invoices can be deleted');
    }

    await prisma.invoice.update({ where: { id }, data: { deletedAt: new Date() } });

    await prisma.auditLog.create({
      data: { companyId, userId, action: 'DELETE', entityType: 'Invoice', entityId: id },
    });

    return { success: true };
  }

  // ─────────────────────────────────────────────────────────
  // Payment-triggered status update (called by PaymentService)
  // ─────────────────────────────────────────────────────────
  static async recalculateInvoiceStatus(invoiceId: string) {
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: { payments: { where: { paymentStatus: 'COMPLETED' } } },
    });

    if (!invoice) return;

    const paid = invoice.payments.reduce((sum, p) => sum + p.amount, 0);

    let status: InvoiceStatus;
    if (paid <= 0) {
      status = 'ISSUED';
    } else if (paid >= invoice.totalAmount) {
      status = 'PAID';
    } else {
      status = 'PARTIALLY_PAID';
    }

    await prisma.invoice.update({ where: { id: invoiceId }, data: { status } });
  }
}
