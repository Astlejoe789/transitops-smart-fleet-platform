import type { Request, Response } from 'express';
import { dashboardService } from './service.js';

const ok = (res: Response, data: unknown) => res.json({ success: true, data });
const err = (res: Response, msg: string, error: unknown) =>
  res.status(500).json({ success: false, message: msg, error });

export class DashboardController {
  async getSummary(req: Request, res: Response) {
    try {
      const companyId = (req as any).user?.companyId as string;
      const data = await dashboardService.getSummary(companyId);
      ok(res, data);
    } catch (error) {
      err(res, 'Failed to fetch dashboard summary', error);
    }
  }

  async getFleetDashboard(req: Request, res: Response) {
    try {
      const companyId = (req as any).user?.companyId as string;
      const data = await dashboardService.getFleetDashboard(companyId);
      ok(res, data);
    } catch (error) {
      err(res, 'Failed to fetch fleet dashboard data', error);
    }
  }

  async getFleetStatus(req: Request, res: Response) {
    try {
      const companyId = (req as any).user?.companyId as string;
      const data = await dashboardService.getFleetStatus(companyId);
      ok(res, data);
    } catch (error) {
      err(res, 'Failed to fetch fleet status', error);
    }
  }

  async getTripsData(req: Request, res: Response) {
    try {
      const companyId = (req as any).user?.companyId as string;
      const data = await dashboardService.getTripsData(companyId);
      ok(res, data);
    } catch (error) {
      err(res, 'Failed to fetch trips data', error);
    }
  }

  async getExpensesData(req: Request, res: Response) {
    try {
      const companyId = (req as any).user?.companyId as string;
      const data = await dashboardService.getExpensesData(companyId);
      ok(res, data);
    } catch (error) {
      err(res, 'Failed to fetch expenses data', error);
    }
  }

  async getMaintenanceData(req: Request, res: Response) {
    try {
      const companyId = (req as any).user?.companyId as string;
      const data = await dashboardService.getMaintenanceData(companyId);
      ok(res, data);
    } catch (error) {
      err(res, 'Failed to fetch maintenance data', error);
    }
  }

  async getRecentActivities(req: Request, res: Response) {
    try {
      const companyId = (req as any).user?.companyId as string;
      const data = await dashboardService.getRecentActivities(companyId);
      ok(res, data);
    } catch (error) {
      err(res, 'Failed to fetch recent activities', error);
    }
  }

  async getNotifications(req: Request, res: Response) {
    try {
      const companyId = (req as any).user?.companyId as string;
      const data = await dashboardService.getNotifications(companyId);
      ok(res, data);
    } catch (error) {
      err(res, 'Failed to fetch notifications', error);
    }
  }
}

export const dashboardController = new DashboardController();
