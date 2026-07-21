import { Request, Response, NextFunction } from 'express';
import { ExpenseService } from './service.js';
import { createExpenseSchema, updateExpenseSchema, updateExpenseStatusSchema } from './validation.js';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware.js';
import { ApiResponse } from '../../shared/responses/api.response.js';

export class ExpenseController {
  static async getExpenses(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = (req as AuthenticatedRequest).user.companyId;
      const result = await ExpenseService.getExpenses(companyId, req.query);
      return ApiResponse.paginated(res, result.data, result.meta);
    } catch (error) {
      next(error);
    }
  }

  static async getExpenseById(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = (req as AuthenticatedRequest).user.companyId;
      const expense = await ExpenseService.getExpenseById(req.params.id, companyId);
      return ApiResponse.success(res, expense, 'Expense retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async createExpense(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = (req as AuthenticatedRequest).user.companyId;
      const userId = (req as AuthenticatedRequest).user.userId;
      const validatedData = createExpenseSchema.parse(req.body);
      const expense = await ExpenseService.createExpense(validatedData, companyId, userId);
      return ApiResponse.created(res, expense, 'Expense created successfully');
    } catch (error) {
      next(error);
    }
  }

  static async updateExpense(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = (req as AuthenticatedRequest).user.companyId;
      const userId = (req as AuthenticatedRequest).user.userId;
      const validatedData = updateExpenseSchema.parse(req.body);
      const expense = await ExpenseService.updateExpense(req.params.id, validatedData, companyId, userId);
      return ApiResponse.success(res, expense, 'Expense updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async updateExpenseStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = (req as AuthenticatedRequest).user.companyId;
      const userId = (req as AuthenticatedRequest).user.userId;
      const { status, notes } = updateExpenseStatusSchema.parse(req.body);
      const expense = await ExpenseService.updateExpenseStatus(req.params.id, status, companyId, userId, notes);
      return ApiResponse.success(res, expense, 'Expense status updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async deleteExpense(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = (req as AuthenticatedRequest).user.companyId;
      const userId = (req as AuthenticatedRequest).user.userId;
      await ExpenseService.deleteExpense(req.params.id, companyId, userId);
      return ApiResponse.success(res, null, 'Expense deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  static async restoreExpense(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = (req as AuthenticatedRequest).user.companyId;
      await ExpenseService.restoreExpense(req.params.id, companyId);
      return ApiResponse.success(res, null, 'Expense restored successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = (req as AuthenticatedRequest).user.companyId;
      const data = await ExpenseService.getDashboard(companyId);
      return ApiResponse.success(res, data, 'Expense dashboard retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = (req as AuthenticatedRequest).user.companyId;
      const { startDate, endDate } = req.query;
      const data = await ExpenseService.getAnalytics(
        companyId, 
        startDate as string, 
        endDate as string
      );
      return ApiResponse.success(res, data, 'Expense analytics retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}
