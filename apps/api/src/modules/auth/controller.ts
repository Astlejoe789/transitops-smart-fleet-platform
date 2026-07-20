import type { Request, Response } from 'express';
import { ApiResponse } from '../../shared/responses/api.response.js';
import { AuthService } from './service.js';
import type { AuthenticatedRequest } from '../../middlewares/auth.middleware.js';

export class AuthController {
  private service = new AuthService();

  login = async (req: Request, res: Response): Promise<void> => {
    const result = await this.service.login(req.body);
    ApiResponse.success(res, result, 'Login successful');
  };

  registerCompanyAdmin = async (req: Request, res: Response): Promise<void> => {
    const result = await this.service.registerCompanyAdmin(req.body);
    ApiResponse.created(res, result, 'Company and Admin registered successfully');
  };

  refreshToken = async (req: Request, res: Response): Promise<void> => {
    const result = await this.service.refreshToken(req.body);
    ApiResponse.success(res, result, 'Token refreshed successfully');
  };

  logout = async (_req: Request, res: Response): Promise<void> => {
    // Client discards tokens — server acknowledges logout
    ApiResponse.success(res, null, 'Logged out successfully');
  };

  me = async (req: Request, res: Response): Promise<void> => {
    const authReq = req as AuthenticatedRequest;
    const user = await this.service.getCurrentUser(authReq.user.userId);
    ApiResponse.success(res, user, 'User profile fetched successfully');
  };

  changePassword = async (req: Request, res: Response): Promise<void> => {
    const authReq = req as AuthenticatedRequest;
    await this.service.changePassword(authReq.user.userId, req.body);
    ApiResponse.success(res, null, 'Password changed successfully');
  };

  forgotPasswordPlaceholder = async (_req: Request, res: Response): Promise<void> => {
    // Placeholder response for forgot password
    ApiResponse.success(
      res,
      { message: 'If email exists, password reset instructions have been sent.' },
      'Forgot password request processed',
    );
  };

  resetPasswordPlaceholder = async (_req: Request, res: Response): Promise<void> => {
    // Placeholder response for reset password
    ApiResponse.success(
      res,
      { message: 'Password has been reset successfully.' },
      'Password reset processed',
    );
  };
}
