import { Request, Response, NextFunction } from 'express';
import { BillingService } from './service.js';
import { createInvoiceSchema, updateInvoiceSchema } from './validation.js';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware.js';
import { ApiResponse } from '../../shared/responses/api.response.js';

export class BillingController {
  static async getInvoices(req: Request, res: Response, next: NextFunction) {
    try {
      const { companyId } = (req as AuthenticatedRequest).user;
      const result = await BillingService.getInvoices(companyId, req.query as any);
      return ApiResponse.paginated(res, result.data, result.meta);
    } catch (err) { next(err); }
  }

  static async getInvoiceSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const { companyId } = (req as AuthenticatedRequest).user;
      const summary = await BillingService.getInvoiceSummary(companyId);
      return ApiResponse.success(res, summary);
    } catch (err) { next(err); }
  }

  static async getInvoiceById(req: Request, res: Response, next: NextFunction) {
    try {
      const { companyId } = (req as AuthenticatedRequest).user;
      const invoice = await BillingService.getInvoiceById(req.params.id, companyId);
      return ApiResponse.success(res, invoice);
    } catch (err) { next(err); }
  }

  static async createInvoice(req: Request, res: Response, next: NextFunction) {
    try {
      const { companyId, userId } = (req as AuthenticatedRequest).user;
      const data = createInvoiceSchema.parse(req.body);
      const invoice = await BillingService.createInvoice(data as any, companyId, userId);
      return ApiResponse.created(res, invoice, 'Invoice created successfully');
    } catch (err) { next(err); }
  }

  static async updateInvoice(req: Request, res: Response, next: NextFunction) {
    try {
      const { companyId, userId } = (req as AuthenticatedRequest).user;
      const data = updateInvoiceSchema.parse(req.body);
      const invoice = await BillingService.updateInvoice(req.params.id, data as any, companyId, userId);
      return ApiResponse.success(res, invoice, 'Invoice updated successfully');
    } catch (err) { next(err); }
  }

  static async issueInvoice(req: Request, res: Response, next: NextFunction) {
    try {
      const { companyId, userId } = (req as AuthenticatedRequest).user;
      const invoice = await BillingService.issueInvoice(req.params.id, companyId, userId);
      return ApiResponse.success(res, invoice, 'Invoice issued successfully');
    } catch (err) { next(err); }
  }

  static async voidInvoice(req: Request, res: Response, next: NextFunction) {
    try {
      const { companyId, userId } = (req as AuthenticatedRequest).user;
      const invoice = await BillingService.voidInvoice(req.params.id, companyId, userId);
      return ApiResponse.success(res, invoice, 'Invoice voided');
    } catch (err) { next(err); }
  }

  static async cancelInvoice(req: Request, res: Response, next: NextFunction) {
    try {
      const { companyId, userId } = (req as AuthenticatedRequest).user;
      const invoice = await BillingService.cancelInvoice(req.params.id, companyId, userId);
      return ApiResponse.success(res, invoice, 'Invoice cancelled');
    } catch (err) { next(err); }
  }

  static async deleteInvoice(req: Request, res: Response, next: NextFunction) {
    try {
      const { companyId, userId } = (req as AuthenticatedRequest).user;
      await BillingService.deleteInvoice(req.params.id, companyId, userId);
      return ApiResponse.success(res, null, 'Invoice deleted');
    } catch (err) { next(err); }
  }
}
