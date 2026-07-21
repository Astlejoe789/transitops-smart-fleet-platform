import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { maintenanceService } from './service.js';
import {
  createMaintenanceSchema,
  updateMaintenanceSchema,
  updateMaintenanceStatusSchema,
  assignTechnicianSchema,
  createPartSchema,
  createDocumentSchema,
} from './validation.js';

const getUser = (req: Request) => (req as any).user as { id: string; companyId: string; role: string };

export class MaintenanceController {
  async getMaintenanceLogs(req: Request, res: Response, next: NextFunction) {
    try {
      const { companyId } = getUser(req);
      const result = await maintenanceService.getMaintenanceLogs(companyId, req.query);
      res.status(StatusCodes.OK).json({ status: 'success', ...result });
    } catch (error) {
      next(error);
    }
  }

  async getMaintenanceLogById(req: Request, res: Response, next: NextFunction) {
    try {
      const { companyId } = getUser(req);
      const log = await maintenanceService.getMaintenanceLogById(companyId, req.params.id);
      res.status(StatusCodes.OK).json({ status: 'success', data: log });
    } catch (error) {
      next(error);
    }
  }

  async createMaintenanceLog(req: Request, res: Response, next: NextFunction) {
    try {
      const { companyId, id: userId } = getUser(req);
      const validated = createMaintenanceSchema.parse({ body: req.body });
      const log = await maintenanceService.createMaintenanceLog(companyId, userId, validated.body);
      res.status(StatusCodes.CREATED).json({ status: 'success', data: log });
    } catch (error) {
      next(error);
    }
  }

  async updateMaintenanceLog(req: Request, res: Response, next: NextFunction) {
    try {
      const { companyId, id: userId } = getUser(req);
      const validated = updateMaintenanceSchema.parse({ params: { id: req.params.id }, body: req.body });
      const log = await maintenanceService.updateMaintenanceLog(companyId, userId, req.params.id, validated.body);
      res.status(StatusCodes.OK).json({ status: 'success', data: log });
    } catch (error) {
      next(error);
    }
  }

  async deleteMaintenanceLog(req: Request, res: Response, next: NextFunction) {
    try {
      const { companyId, id: userId } = getUser(req);
      await maintenanceService.deleteMaintenanceLog(companyId, userId, req.params.id);
      res.status(StatusCodes.OK).json({ status: 'success', message: 'Maintenance log deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  async restoreMaintenanceLog(req: Request, res: Response, next: NextFunction) {
    try {
      const { companyId, id: userId } = getUser(req);
      await maintenanceService.restoreMaintenanceLog(companyId, userId, req.params.id);
      res.status(StatusCodes.OK).json({ status: 'success', message: 'Maintenance log restored successfully' });
    } catch (error) {
      next(error);
    }
  }

  async updateMaintenanceStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { companyId, id: userId } = getUser(req);
      const validated = updateMaintenanceStatusSchema.parse({ params: { id: req.params.id }, body: req.body });
      const log = await maintenanceService.updateMaintenanceStatus(companyId, userId, req.params.id, validated.body.status, validated.body.notes);
      res.status(StatusCodes.OK).json({ status: 'success', data: log });
    } catch (error) {
      next(error);
    }
  }

  async assignTechnician(req: Request, res: Response, next: NextFunction) {
    try {
      const { companyId, id: userId } = getUser(req);
      const validated = assignTechnicianSchema.parse({ params: { id: req.params.id }, body: req.body });
      const log = await maintenanceService.assignTechnician(companyId, userId, req.params.id, validated.body.technicianId);
      res.status(StatusCodes.OK).json({ status: 'success', data: log });
    } catch (error) {
      next(error);
    }
  }

  async addPart(req: Request, res: Response, next: NextFunction) {
    try {
      const { companyId, id: userId } = getUser(req);
      const validated = createPartSchema.parse({ params: { id: req.params.id }, body: req.body });
      const part = await maintenanceService.addPart(companyId, userId, req.params.id, validated.body);
      res.status(StatusCodes.CREATED).json({ status: 'success', data: part });
    } catch (error) {
      next(error);
    }
  }

  async deletePart(req: Request, res: Response, next: NextFunction) {
    try {
      const { companyId, id: userId } = getUser(req);
      await maintenanceService.deletePart(companyId, userId, req.params.id, req.params.partId);
      res.status(StatusCodes.OK).json({ status: 'success', message: 'Part deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  async addDocument(req: Request, res: Response, next: NextFunction) {
    try {
      const { companyId, id: userId } = getUser(req);
      const validated = createDocumentSchema.parse({ params: { id: req.params.id }, body: req.body });
      const doc = await maintenanceService.addDocument(companyId, userId, req.params.id, validated.body);
      res.status(StatusCodes.CREATED).json({ status: 'success', data: doc });
    } catch (error) {
      next(error);
    }
  }

  async deleteDocument(req: Request, res: Response, next: NextFunction) {
    try {
      const { companyId, id: userId } = getUser(req);
      await maintenanceService.deleteDocument(companyId, userId, req.params.id, req.params.docId);
      res.status(StatusCodes.OK).json({ status: 'success', message: 'Document deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}

export const maintenanceController = new MaintenanceController();
