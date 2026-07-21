import { Request, Response, NextFunction } from 'express';
import { VendorService } from './service.js';
import { createVendorSchema, updateVendorSchema } from './validation.js';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware.js';
import { ApiResponse } from '../../shared/responses/api.response.js';

export class VendorController {
  static async getVendors(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = (req as AuthenticatedRequest).user.companyId;
      const result = await VendorService.getVendors(companyId, req.query);
      return ApiResponse.paginated(res, result.data, result.meta);
    } catch (error) {
      next(error);
    }
  }

  static async getVendorById(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = (req as AuthenticatedRequest).user.companyId;
      const vendor = await VendorService.getVendorById(req.params.id, companyId);
      return ApiResponse.success(res, vendor);
    } catch (error) {
      next(error);
    }
  }

  static async createVendor(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = (req as AuthenticatedRequest).user.companyId;
      const userId = (req as AuthenticatedRequest).user.userId;
      const validatedData = createVendorSchema.parse(req.body);
      const vendor = await VendorService.createVendor(validatedData, companyId, userId);
      return ApiResponse.created(res, vendor, 'Vendor created successfully');
    } catch (error) {
      next(error);
    }
  }

  static async updateVendor(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = (req as AuthenticatedRequest).user.companyId;
      const userId = (req as AuthenticatedRequest).user.userId;
      const validatedData = updateVendorSchema.parse(req.body);
      const vendor = await VendorService.updateVendor(req.params.id, validatedData, companyId, userId);
      return ApiResponse.success(res, vendor, 'Vendor updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async deleteVendor(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = (req as AuthenticatedRequest).user.companyId;
      const userId = (req as AuthenticatedRequest).user.userId;
      await VendorService.deleteVendor(req.params.id, companyId, userId);
      return ApiResponse.success(res, null, 'Vendor deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  static async restoreVendor(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = (req as AuthenticatedRequest).user.companyId;
      await VendorService.restoreVendor(req.params.id, companyId);
      return ApiResponse.success(res, null, 'Vendor restored successfully');
    } catch (error) {
      next(error);
    }
  }
}
