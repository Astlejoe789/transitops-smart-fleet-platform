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

  private static computeTotals(items: { quantity: number; unitPrice: number }[], taxAmount = 0, discountAmount = 0) {
    const subtotal = items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
    const totalAmount = subtotal + taxAmount - discountAmount;
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
    const { items, taxAmount = 0, discountAmount = 0, ...rest } = data;
    const invoiceNumber = await this.generateInvoiceNumber(companyId);
    const { subtotal, totalAmount } = this.computeTotals(items, taxAmount, discountAmount);

    const invoice = await prisma.invoice.create({
      data: {
        ...rest,
        companyId,
        invoiceNumber,
        subtotal,
        taxAmount,
        discountAmount,
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

    if (existing.status !== 'DRAFT' && existing.status !== 'PENDING_APPROVAL') {
      throw new HttpException(StatusCodes.BAD_REQUEST, 'Only DRAFT or PENDING_APPROVAL invoices can be edited');
    }

    const taxAmount = data.taxAmount ?? existing.taxAmount;
    const discountAmount = data.discountAmount ?? existing.discountAmount;
    const items = data.items;
    const subtotal = items ? this.computeTotals(items, 0, 0).subtotal : existing.subtotal;
    const totalAmount = subtotal + taxAmount - discountAmount;

    const invoice = await prisma.invoice.update({
      where: { id },
      data: {
        ...(data.dueDate && { dueDate: new Date(data.dueDate) }),
        ...(data.notes !== undefined && { notes: data.notes }),
        taxAmount,
        discountAmount,
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

    if (existing.status !== 'DRAFT' && existing.status !== 'APPROVED') {
      throw new HttpException(StatusCodes.BAD_REQUEST, 'Only DRAFT or APPROVED invoices can be issued');
    }

    const invoice = await prisma.invoice.update({
      where: { id },
      data: { status: 'ISSUED', invoiceDate: new Date() },
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

  // ─────────────────────────────────────────────────────────
  // Phase 12 Additions
  // ─────────────────────────────────────────────────────────
  static async submitForApproval(id: string, companyId: string, userId: string) {
    const existing = await this.getInvoiceById(id, companyId);
    if (existing.status !== 'DRAFT') throw new HttpException(StatusCodes.BAD_REQUEST, 'Only DRAFT invoices can be submitted');
    
    const invoice = await prisma.invoice.update({ where: { id }, data: { status: 'PENDING_APPROVAL' } });
    await prisma.auditLog.create({ data: { companyId, userId, action: 'UPDATE', entityType: 'Invoice', entityId: id, newValues: { status: 'PENDING_APPROVAL' } as any } });
    return invoice;
  }

  static async approveInvoice(id: string, companyId: string, userId: string) {
    const existing = await this.getInvoiceById(id, companyId);
    if (existing.status !== 'PENDING_APPROVAL') throw new HttpException(StatusCodes.BAD_REQUEST, 'Only PENDING_APPROVAL invoices can be approved');
    
    const invoice = await prisma.invoice.update({ where: { id }, data: { status: 'APPROVED' } });
    await prisma.auditLog.create({ data: { companyId, userId, action: 'UPDATE', entityType: 'Invoice', entityId: id, newValues: { status: 'APPROVED' } as any } });
    return invoice;
  }

  static async sendInvoice(id: string, companyId: string, userId: string) {
    const existing = await this.getInvoiceById(id, companyId);
    if (!['DRAFT', 'APPROVED', 'ISSUED'].includes(existing.status)) throw new HttpException(StatusCodes.BAD_REQUEST, 'Invalid status to send invoice');
    
    const invoice = await prisma.invoice.update({ where: { id }, data: { status: 'SENT', invoiceDate: existing.invoiceDate || new Date() } });
    await prisma.auditLog.create({ data: { companyId, userId, action: 'UPDATE', entityType: 'Invoice', entityId: id, newValues: { status: 'SENT' } as any } });
    return invoice;
  }

  static async generateFromTrip(tripId: string, companyId: string, userId: string) {
    const trip = await prisma.trip.findFirst({
      where: { id: tripId, companyId },
      include: { customer: true, expenses: true, fuelLogs: true }
    });

    if (!trip || !trip.customerId) {
      throw new HttpException(StatusCodes.BAD_REQUEST, 'Trip not found or has no associated customer');
    }

    const items = [
      { description: `Freight Charges - Trip ${trip.tripNumber}`, quantity: 1, unitPrice: 500 } // Default estimation
    ];
    
    // Add additional items based on distance if available
    if (trip.actualDistance) {
      items.push({ description: 'Distance surcharge', quantity: trip.actualDistance, unitPrice: 1.5 });
    }

    const { subtotal, totalAmount } = this.computeTotals(items, 0, 0);
    const invoiceNumber = await this.generateInvoiceNumber(companyId);

    const invoice = await prisma.invoice.create({
      data: {
        companyId,
        customerId: trip.customerId,
        tripId: trip.id,
        invoiceNumber,
        subtotal,
        taxAmount: 0,
        discountAmount: 0,
        totalAmount,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 days
        items: {
          create: items.map(i => ({ ...i, totalPrice: i.quantity * i.unitPrice }))
        }
      },
      include: { items: true }
    });

    await prisma.auditLog.create({ data: { companyId, userId, action: 'CREATE', entityType: 'Invoice', entityId: invoice.id } });
    return invoice;
  }

  static async getCustomerLedger(customerId: string, companyId: string, query: { page?: string, limit?: string }) {
    const page = Math.max(1, parseInt(query.page || '1'));
    const limit = Math.max(1, Math.min(100, parseInt(query.limit || '20')));
    const skip = (page - 1) * limit;

    const invoices = await prisma.invoice.findMany({
      where: { companyId, customerId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: { payments: true }
    });

    const total = await prisma.invoice.count({ where: { companyId, customerId, deletedAt: null } });

    // Build ledger entries (both invoices and payments)
    const ledger = invoices.flatMap(inv => {
      const entries = [];
      entries.push({
        type: 'INVOICE',
        id: inv.id,
        date: inv.issueDate,
        reference: inv.invoiceNumber,
        amount: inv.totalAmount,
        status: inv.status
      });
      inv.payments.forEach(p => {
        entries.push({
          type: 'PAYMENT',
          id: p.id,
          date: p.paymentDate,
          reference: p.paymentNumber,
          amount: p.amount,
          status: p.paymentStatus
        });
      });
      return entries;
    });

    ledger.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return { data: ledger, meta: { total, page, limit } };
  }

  static async getRevenueData(companyId: string, year?: string) {
    const targetYear = year ? parseInt(year) : new Date().getFullYear();
    const startDate = new Date(targetYear, 0, 1);
    const endDate = new Date(targetYear, 11, 31, 23, 59, 59);

    const invoices = await prisma.invoice.findMany({
      where: { companyId, deletedAt: null, issueDate: { gte: startDate, lte: endDate }, status: { in: ['ISSUED', 'PARTIALLY_PAID', 'PAID', 'OVERDUE', 'SENT'] } },
      select: { totalAmount: true, issueDate: true, customer: { select: { name: true } } },
    });

    const monthlyRevenue = Array.from({ length: 12 }, (_, i) => ({ month: i, amount: 0 }));
    const customerRevenue: Record<string, number> = {};

    invoices.forEach(inv => {
      const month = inv.issueDate.getMonth();
      monthlyRevenue[month].amount += inv.totalAmount;
      
      const custName = inv.customer.name;
      customerRevenue[custName] = (customerRevenue[custName] || 0) + inv.totalAmount;
    });

    const topCustomers = Object.entries(customerRevenue)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    return { monthlyRevenue, topCustomers };
  }

  static async exportInvoicesCSV(companyId: string, query: GetInvoicesQuery) {
    const { data } = await this.getInvoices(companyId, { ...query, limit: '1000' });
    
    const rows = ['Invoice Number,Customer,Issue Date,Due Date,Subtotal,Tax,Discount,Total,Status'];
    data.forEach(inv => {
      rows.push(`${inv.invoiceNumber},"${inv.customer?.name || ''}",${inv.issueDate.toISOString()},${inv.dueDate.toISOString()},${inv.subtotal},${inv.taxAmount},${inv.discountAmount},${inv.totalAmount},${inv.status}`);
    });
    
    return rows.join('\n');
  }
}
