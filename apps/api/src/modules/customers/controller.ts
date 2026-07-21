import { Request, Response, NextFunction } from 'express';
import { CustomerService } from './service.js';
import { createCustomerSchema, updateCustomerSchema } from './validation.js';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware.js';
import { ApiResponse } from '../../shared/responses/api.response.js';

export class CustomerController {
  static async getCustomers(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = (req as AuthenticatedRequest).user.companyId;
      const result = await CustomerService.getCustomers(companyId, req.query);
      return ApiResponse.paginated(res, result.data, result.meta);
    } catch (error) {
      next(error);
    }
  }

  static async getCustomerById(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = (req as AuthenticatedRequest).user.companyId;
      const customer = await CustomerService.getCustomerById(req.params.id, companyId);
      return ApiResponse.success(res, customer);
    } catch (error) {
      next(error);
    }
  }

  static async createCustomer(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = (req as AuthenticatedRequest).user.companyId;
      const userId = (req as AuthenticatedRequest).user.userId;
      const validatedData = createCustomerSchema.parse(req.body);
      const customer = await CustomerService.createCustomer(validatedData, companyId, userId);
      return ApiResponse.created(res, customer, 'Customer created successfully');
    } catch (error) {
      next(error);
    }
  }

  static async updateCustomer(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = (req as AuthenticatedRequest).user.companyId;
      const userId = (req as AuthenticatedRequest).user.userId;
      const validatedData = updateCustomerSchema.parse(req.body);
      const customer = await CustomerService.updateCustomer(req.params.id, validatedData, companyId, userId);
      return ApiResponse.success(res, customer, 'Customer updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async deleteCustomer(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = (req as AuthenticatedRequest).user.companyId;
      const userId = (req as AuthenticatedRequest).user.userId;
      await CustomerService.deleteCustomer(req.params.id, companyId, userId);
      return ApiResponse.success(res, null, 'Customer deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  static async restoreCustomer(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = (req as AuthenticatedRequest).user.companyId;
      await CustomerService.restoreCustomer(req.params.id, companyId);
      return ApiResponse.success(res, null, 'Customer restored successfully');
    } catch (error) {
      next(error);
    }
  }
}
