import { type Response } from 'express';
import { type AuthenticatedRequest } from '../../middlewares/index.js';
import { AdministrationService } from './service.js';

export class AdministrationController {
  private adminService: AdministrationService;

  constructor() {
    this.adminService = new AdministrationService();
  }

  // --- Users ---
  getUsers = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { companyId } = req.user!;
      const data = await this.adminService.getUsers(companyId, req.query);
      return res.status(200).json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  };

  updateUserStatus = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { companyId, userId: adminUserId } = req.user!;
      const { id } = req.params;
      const { status } = req.body;
      const data = await this.adminService.updateUserStatus(companyId, id, status, adminUserId);
      return res.status(200).json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  };

  // --- Roles & Permissions ---
  getRoles = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { companyId } = req.user!;
      const data = await this.adminService.getRoles(companyId);
      return res.status(200).json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  };

  getPermissions = async (_req: AuthenticatedRequest, res: Response) => {
    try {
      const data = await this.adminService.getPermissions();
      return res.status(200).json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  };

  assignRolePermissions = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { companyId, userId: adminUserId } = req.user!;
      const { id: roleId } = req.params;
      const { permissionIds } = req.body;
      const data = await this.adminService.assignRolePermissions(companyId, roleId, permissionIds, adminUserId);
      return res.status(200).json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  };

  // --- Settings ---
  getSettings = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { companyId } = req.user!;
      const { category } = req.params;
      const data = await this.adminService.getSettings(companyId, category.toUpperCase());
      return res.status(200).json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  };

  updateSettings = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { companyId, userId: adminUserId } = req.user!;
      const { category } = req.params;
      const data = await this.adminService.updateSettings(companyId, category.toUpperCase(), req.body, adminUserId);
      return res.status(200).json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  };

  // --- Audit Logs ---
  getAuditLogs = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { companyId } = req.user!;
      const data = await this.adminService.getAuditLogs(companyId, req.query);
      return res.status(200).json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  };

  // --- System Health ---
  getSystemHealth = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { companyId } = req.user!;
      const data = await this.adminService.getSystemHealth(companyId);
      return res.status(200).json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  };
}
