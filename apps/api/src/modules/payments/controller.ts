import { Request, Response, NextFunction } from 'express';
import { PaymentService } from './service.js';
import { recordPaymentSchema } from './validation.js';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware.js';
import { ApiResponse } from '../../shared/responses/api.response.js';

export class PaymentController {
  static async getPayments(req: Request, res: Response, next: NextFunction) {
    try {
      const { companyId } = (req as AuthenticatedRequest).user;
      const result = await PaymentService.getPayments(companyId, req.query as any);
      return ApiResponse.paginated(res, result.data, result.meta);
    } catch (err) { next(err); }
  }

  static async getPaymentSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const { companyId } = (req as AuthenticatedRequest).user;
      const summary = await PaymentService.getPaymentSummary(companyId);
      return ApiResponse.success(res, summary);
    } catch (err) { next(err); }
  }

  static async getPaymentById(req: Request, res: Response, next: NextFunction) {
    try {
      const { companyId } = (req as AuthenticatedRequest).user;
      const payment = await PaymentService.getPaymentById(req.params.id, companyId);
      return ApiResponse.success(res, payment);
    } catch (err) { next(err); }
  }

  static async recordPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const { companyId, userId } = (req as AuthenticatedRequest).user;
      const data = recordPaymentSchema.parse(req.body);
      const payment = await PaymentService.recordPayment(data as any, companyId, userId);
      return ApiResponse.created(res, payment, 'Payment recorded successfully');
    } catch (err) { next(err); }
  }

  static async refundPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const { companyId, userId } = (req as AuthenticatedRequest).user;
      const payment = await PaymentService.refundPayment(req.params.id, companyId, userId);
      return ApiResponse.success(res, payment, 'Payment refunded');
    } catch (err) { next(err); }
  }
}
