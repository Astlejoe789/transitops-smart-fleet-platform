/**
 * Reports Controller
 *
 * Handles HTTP requests for the reports module.
 * Keep controllers thin — delegate logic to the service layer.
 */
import type { Request, Response } from 'express';
import { ReportsService } from './service.js';
import type { AuthenticatedRequest } from '../../middlewares/index.js';

const reportsService = new ReportsService();

export class ReportsController {
  async getFleetReport(req: Request, res: Response) {
    const authReq = req as AuthenticatedRequest;
    const data = await reportsService.getFleetReport(authReq.user!.companyId, authReq.query);
    res.json({ success: true, data });
  }

  async getDriversReport(req: Request, res: Response) {
    const authReq = req as AuthenticatedRequest;
    const data = await reportsService.getDriversReport(authReq.user!.companyId, authReq.query);
    res.json({ success: true, data });
  }

  async getTripsReport(req: Request, res: Response) {
    const authReq = req as AuthenticatedRequest;
    const data = await reportsService.getTripsReport(authReq.user!.companyId, authReq.query);
    res.json({ success: true, data });
  }

  async getFuelReport(req: Request, res: Response) {
    const authReq = req as AuthenticatedRequest;
    const data = await reportsService.getFuelReport(authReq.user!.companyId, authReq.query);
    res.json({ success: true, data });
  }

  async getMaintenanceReport(req: Request, res: Response) {
    const authReq = req as AuthenticatedRequest;
    const data = await reportsService.getMaintenanceReport(authReq.user!.companyId, authReq.query);
    res.json({ success: true, data });
  }

  async getExpenseReport(req: Request, res: Response) {
    const authReq = req as AuthenticatedRequest;
    const data = await reportsService.getExpenseReport(authReq.user!.companyId, authReq.query);
    res.json({ success: true, data });
  }

  async getCustomersReport(req: Request, res: Response) {
    const authReq = req as AuthenticatedRequest;
    const data = await reportsService.getCustomersReport(authReq.user!.companyId, authReq.query);
    res.json({ success: true, data });
  }

  async getVendorsReport(req: Request, res: Response) {
    const authReq = req as AuthenticatedRequest;
    const data = await reportsService.getVendorsReport(authReq.user!.companyId, authReq.query);
    res.json({ success: true, data });
  }

  async getBillingReport(req: Request, res: Response) {
    const authReq = req as AuthenticatedRequest;
    const data = await reportsService.getBillingReport(authReq.user!.companyId, authReq.query);
    res.json({ success: true, data });
  }

  async getSummary(req: Request, res: Response) {
    const authReq = req as AuthenticatedRequest;
    const data = await reportsService.getSummary(authReq.user!.companyId);
    res.json({ success: true, data });
  }

  async getReportsList(req: Request, res: Response) {
    const authReq = req as AuthenticatedRequest;
    const data = await reportsService.getReportsList(authReq.user!.companyId);
    res.json({ success: true, data });
  }

  async exportAll(req: Request, res: Response) {
    const authReq = req as AuthenticatedRequest;
    const format = (authReq.query.format as string) || 'csv';
    const result = await reportsService.exportAll(authReq.user!.companyId, format);
    res.setHeader('Content-Type', result.mime);
    res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
    res.send(result.content);
  }

  async exportOne(req: Request, res: Response) {
    const authReq = req as AuthenticatedRequest;
    const { reportId } = authReq.params;
    const format = (authReq.query.format as string) || 'csv';
    const result = await reportsService.exportOne(authReq.user!.companyId, reportId, format);
    res.setHeader('Content-Type', result.mime);
    res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
    res.send(result.content);
  }
}


