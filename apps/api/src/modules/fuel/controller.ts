import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { fuelService } from './service.js';
import { createFuelLogSchema, updateFuelLogSchema } from './validation.js';

const getUser = (req: Request) => (req as any).user as { id: string; companyId: string; role: string };

export class FuelController {
  async getFuelLogs(req: Request, res: Response, next: NextFunction) {
    try {
      const { companyId } = getUser(req);
      const result = await fuelService.getFuelLogs(companyId, req.query);
      res.status(StatusCodes.OK).json({ status: 'success', ...result });
    } catch (error) {
      next(error);
    }
  }

  async getFuelLogById(req: Request, res: Response, next: NextFunction) {
    try {
      const { companyId } = getUser(req);
      const log = await fuelService.getFuelLogById(companyId, req.params.id);
      res.status(StatusCodes.OK).json({ status: 'success', data: log });
    } catch (error) {
      next(error);
    }
  }

  async createFuelLog(req: Request, res: Response, next: NextFunction) {
    try {
      const { companyId, id: userId } = getUser(req);
      const validated = createFuelLogSchema.parse({ body: req.body });
      const log = await fuelService.createFuelLog(companyId, userId, validated.body);
      res.status(StatusCodes.CREATED).json({ status: 'success', data: log });
    } catch (error) {
      next(error);
    }
  }

  async updateFuelLog(req: Request, res: Response, next: NextFunction) {
    try {
      const { companyId, id: userId } = getUser(req);
      const validated = updateFuelLogSchema.parse({ params: { id: req.params.id }, body: req.body });
      const log = await fuelService.updateFuelLog(companyId, userId, req.params.id, validated.body);
      res.status(StatusCodes.OK).json({ status: 'success', data: log });
    } catch (error) {
      next(error);
    }
  }

  async deleteFuelLog(req: Request, res: Response, next: NextFunction) {
    try {
      const { companyId, id: userId } = getUser(req);
      await fuelService.deleteFuelLog(companyId, userId, req.params.id);
      res.status(StatusCodes.OK).json({ status: 'success', message: 'Fuel log deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  async restoreFuelLog(req: Request, res: Response, next: NextFunction) {
    try {
      const { companyId, id: userId } = getUser(req);
      await fuelService.restoreFuelLog(companyId, userId, req.params.id);
      res.status(StatusCodes.OK).json({ status: 'success', message: 'Fuel log restored successfully' });
    } catch (error) {
      next(error);
    }
  }

  async getAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
      const { companyId } = getUser(req);
      // Let's implement analytics in service.ts next
      const data = await fuelService.getAnalytics(companyId, req.query);
      res.status(StatusCodes.OK).json({ status: 'success', data });
    } catch (error) {
      next(error);
    }
  }

  async getDashboardMetrics(req: Request, res: Response, next: NextFunction) {
    try {
      const { companyId } = getUser(req);
      const data = await fuelService.getDashboardMetrics(companyId);
      res.status(StatusCodes.OK).json({ status: 'success', data });
    } catch (error) {
      next(error);
    }
  }
}

export const fuelController = new FuelController();
