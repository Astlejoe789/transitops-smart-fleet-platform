import { Request, Response } from 'express';
import { dashboardService } from './service.js';

export class DashboardController {
  async getSummary(req: Request, res: Response) {
    try {
      const companyId = (req as any).user?.companyId as string;
      const data = await dashboardService.getSummary(companyId);
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch dashboard summary', error });
    }
  }

  async getFleetStatus(req: Request, res: Response) {
    try {
      const companyId = (req as any).user?.companyId as string;
      const data = await dashboardService.getFleetStatus(companyId);
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch fleet status', error });
    }
  }

  async getTripsData(req: Request, res: Response) {
    try {
      const companyId = (req as any).user?.companyId as string;
      const data = await dashboardService.getTripsData(companyId);
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch trips data', error });
    }
  }

  async getExpensesData(req: Request, res: Response) {
    try {
      const companyId = (req as any).user?.companyId as string;
      const data = await dashboardService.getExpensesData(companyId);
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch expenses data', error });
    }
  }

  async getMaintenanceData(req: Request, res: Response) {
    try {
      const companyId = (req as any).user?.companyId as string;
      const data = await dashboardService.getMaintenanceData(companyId);
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch maintenance data', error });
    }
  }

  async getRecentActivities(req: Request, res: Response) {
    try {
      const companyId = (req as any).user?.companyId as string;
      const data = await dashboardService.getRecentActivities(companyId);
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch recent activities', error });
    }
  }

  async getNotifications(req: Request, res: Response) {
    try {
      const companyId = (req as any).user?.companyId as string;
      const data = await dashboardService.getNotifications(companyId);
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch notifications', error });
    }
  }
}

export const dashboardController = new DashboardController();
