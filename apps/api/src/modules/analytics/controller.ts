/**
 * Analytics Controller
 */
import { Request, Response } from 'express';
import { AnalyticsService } from './service.js';
import { AuthenticatedRequest } from '../../middlewares/index.js';

const analyticsService = new AnalyticsService();

export class AnalyticsController {
  /**
   * Get KPI data for the dashboard
   */
  async getDashboardKPIs(req: Request, res: Response) {
    const authReq = req as AuthenticatedRequest;
    const { companyId, branchId } = authReq.user!;
    const data = await analyticsService.getDashboardKPIs(companyId, branchId ?? undefined);
    
    res.json({ success: true, data, message: 'Dashboard KPIs retrieved successfully' });
  }

  /**
   * Get Chart data for the dashboard
   */
  async getDashboardCharts(req: Request, res: Response) {
    const authReq = req as AuthenticatedRequest;
    const { companyId, branchId } = authReq.user!;
    const data = await analyticsService.getDashboardCharts(companyId, branchId ?? undefined);
    
    res.json({ success: true, data, message: 'Dashboard Charts retrieved successfully' });
  }
}

