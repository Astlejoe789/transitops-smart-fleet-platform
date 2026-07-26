import type { Request, Response } from 'express';
import { settingsService } from './service.js';
import { StatusCodes } from 'http-status-codes';

export class SettingsController {
  async getSettings(req: Request, res: Response) {
    try {
      const companyId = (req as any).user?.companyId;
      const settings = await settingsService.getSettings(companyId);
      res.json(settings);
    } catch (error: any) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  }

  async updateSettings(req: Request, res: Response) {
    try {
      const companyId = (req as any).user?.companyId;
      const { category } = req.params;
      const settings = await settingsService.updateSettings(companyId, category, req.body);
      res.json(settings);
    } catch (error: any) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  }
}

export const settingsController = new SettingsController();
