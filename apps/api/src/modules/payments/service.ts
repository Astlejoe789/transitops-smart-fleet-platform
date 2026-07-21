import { PrismaClient, PaymentStatus, Prisma } from '@prisma/client';
import { RecordPaymentDTO, GetPaymentsQuery } from './types.js';
import { BillingService } from '../billing/service.js';
import { HttpException } from '../../shared/exceptions/http.exception.js';
import { StatusCodes } from 'http-status-codes';

const prisma = new PrismaClient();

export class PaymentService {
  private static async generatePaymentNumber(companyId: string): Promise<string> {
    const count = await prisma.payment.count({ where: { companyId } });
    return `PAY-${new Date().getFullYear()}-${String(count + 1).padStart(5, '0')}`;
  }

  // ─────────────────────────────────────────────────────────
  // Queries
  // ─────────────────────────────────────────────────────────
  static async getPayments(companyId: string, query: GetPaymentsQuery) {
    const page = Math.max(1, parseInt(query.page || '1'));
    const limit = Math.max(1, Math.min(100, parseInt(query.limit || '15')));
    const skip = (page - 1) * limit;

    const { search, invoiceId, paymentMethod, paymentStatus, startDate, endDate, sortBy = 'paymentDate', sortOrder = 'desc' } = query;

    const where: Prisma.PaymentWhereInput = {
      companyId,
      ...(invoiceId && { invoiceId }),
      ...(paymentMethod && { paymentMethod: paymentMethod as any }),
      ...(paymentStatus && { paymentStatus: paymentStatus as PaymentStatus }),
      ...(startDate && { paymentDate: { gte: new Date(startDate) } }),
      ...(endDate && { paymentDate: { lte: new Date(endDate) } }),
      ...(search && {
        OR: [
          { paymentNumber: { contains: search, mode: 'insensitive' } },
          { referenceNumber: { contains: search, mode: 'insensitive' } },
          { invoice: { invoiceNumber: { contains: search, mode: 'insensitive' } } },
        ],
      }),
    };

    const [total, data] = await Promise.all([
      prisma.payment.count({ where }),
      prisma.payment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          invoice: {
            select: {
              id: true,
              invoiceNumber: true,
              totalAmount: true,
              customer: { select: { id: true, name: true } },
            },
          },
        },
      }),
    ]);

    return { data, meta: { total, page, limit } };
  }

  static async getPaymentSummary(companyId: string) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [collectedMtd, pending, refunded] = await Promise.all([
      prisma.payment.aggregate({
        where: { companyId, paymentStatus: 'COMPLETED', paymentDate: { gte: startOfMonth } },
        _sum: { amount: true },
        _count: true,
      }),
      prisma.payment.aggregate({
        where: { companyId, paymentStatus: 'PENDING' },
        _sum: { amount: true },
        _count: true,
      }),
      prisma.payment.aggregate({
        where: { companyId, paymentStatus: 'REFUNDED' },
        _sum: { amount: true },
        _count: true,
      }),
    ]);

    return {
      collectedMtd: { amount: collectedMtd._sum.amount ?? 0, count: collectedMtd._count },
      pending: { amount: pending._sum.amount ?? 0, count: pending._count },
      refunded: { amount: refunded._sum.amount ?? 0, count: refunded._count },
    };
  }

  static async getPaymentById(id: string, companyId: string) {
    const payment = await prisma.payment.findFirst({
      where: { id, companyId },
      include: {
        invoice: {
          include: {
            customer: { select: { id: true, name: true, email: true } },
          },
        },
      },
    });

    if (!payment) throw new HttpException(StatusCodes.NOT_FOUND, 'Payment not found');
    return payment;
  }

  // ─────────────────────────────────────────────────────────
  // Mutations
  // ─────────────────────────────────────────────────────────
  static async recordPayment(data: RecordPaymentDTO, companyId: string, userId: string) {
    // Validate the invoice exists and belongs to this company
    const invoice = await prisma.invoice.findFirst({
      where: { id: data.invoiceId, companyId, deletedAt: null },
    });

    if (!invoice) throw new HttpException(StatusCodes.NOT_FOUND, 'Invoice not found');
    if (['VOID', 'CANCELLED', 'DRAFT'].includes(invoice.status)) {
      throw new HttpException(StatusCodes.BAD_REQUEST, `Cannot record payment on a ${invoice.status} invoice`);
    }

    const paymentNumber = await this.generatePaymentNumber(companyId);

    const payment = await prisma.payment.create({
      data: {
        companyId,
        invoiceId: data.invoiceId,
        paymentNumber,
        amount: data.amount,
        paymentDate: data.paymentDate ? new Date(data.paymentDate) : new Date(),
        paymentMethod: data.paymentMethod,
        paymentStatus: 'COMPLETED',
        referenceNumber: data.referenceNumber,
        receiptUrl: data.receiptUrl,
        notes: data.notes,
      },
    });

    // Recalculate invoice status automatically
    await BillingService.recalculateInvoiceStatus(data.invoiceId);

    await prisma.auditLog.create({
      data: { companyId, userId, action: 'CREATE', entityType: 'Payment', entityId: payment.id, newValues: data as any },
    });

    return payment;
  }

  static async refundPayment(id: string, companyId: string, userId: string) {
    const payment = await this.getPaymentById(id, companyId);

    if (payment.paymentStatus !== 'COMPLETED') {
      throw new HttpException(StatusCodes.BAD_REQUEST, 'Only COMPLETED payments can be refunded');
    }

    const updated = await prisma.payment.update({
      where: { id },
      data: { paymentStatus: 'REFUNDED' },
    });

    // Recalculate invoice status after refund
    await BillingService.recalculateInvoiceStatus(payment.invoiceId);

    await prisma.auditLog.create({
      data: { companyId, userId, action: 'UPDATE', entityType: 'Payment', entityId: id, newValues: { paymentStatus: 'REFUNDED' } as any },
    });

    return updated;
  }

  // ─────────────────────────────────────────────────────────
  // Phase 12 Additions
  // ─────────────────────────────────────────────────────────
  static async exportPaymentsCSV(companyId: string, query: GetPaymentsQuery) {
    const { data } = await this.getPayments(companyId, { ...query, limit: '1000' });
    
    const rows = ['Payment Number,Invoice Number,Date,Amount,Method,Status,Reference'];
    data.forEach(payment => {
      rows.push(`${payment.paymentNumber},${payment.invoice?.invoiceNumber || ''},${payment.paymentDate.toISOString()},${payment.amount},${payment.paymentMethod},${payment.paymentStatus},"${payment.referenceNumber || ''}"`);
    });
    
    return rows.join('\n');
  }
}
