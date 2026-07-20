import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { fleetService } from './service.js';
import { createVehicleSchema, updateVehicleSchema, createDocumentSchema } from './validation.js';

export class FleetController {
  async getVehicles(req: Request, res: Response) {
    try {
      const companyId = (req as any).user?.companyId;
      const data = await fleetService.getVehicles(companyId, req.query);
      res.json(data);
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to fetch vehicles' });
    }
  }

  async getVehicle(req: Request, res: Response) {
    try {
      const companyId = (req as any).user?.companyId;
      const data = await fleetService.getVehicleById(companyId, req.params.id);
      res.json(data);
    } catch (error: any) {
      res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  }

  async createVehicle(req: Request, res: Response) {
    try {
      const companyId = (req as any).user?.companyId;
      const userId = (req as any).user?.id;
      const validated = createVehicleSchema.parse({ body: req.body });
      
      const vehicle = await fleetService.createVehicle(companyId, userId, validated.body);
      res.status(StatusCodes.CREATED).json(vehicle);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Validation failed', details: error.errors });
      }
      res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  }

  async updateVehicle(req: Request, res: Response) {
    try {
      const companyId = (req as any).user?.companyId;
      const userId = (req as any).user?.id;
      const validated = updateVehicleSchema.parse({ params: req.params, body: req.body });
      
      const vehicle = await fleetService.updateVehicle(companyId, userId, validated.params.id, validated.body);
      res.json(vehicle);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Validation failed', details: error.errors });
      }
      res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  }

  async deleteVehicle(req: Request, res: Response) {
    try {
      const companyId = (req as any).user?.companyId;
      const userId = (req as any).user?.id;
      const result = await fleetService.deleteVehicle(companyId, userId, req.params.id);
      res.json(result);
    } catch (error: any) {
      res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  }

  async restoreVehicle(req: Request, res: Response) {
    try {
      const companyId = (req as any).user?.companyId;
      const userId = (req as any).user?.id;
      const result = await fleetService.restoreVehicle(companyId, userId, req.params.id);
      res.json(result);
    } catch (error: any) {
      res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  }

  async getDocuments(req: Request, res: Response) {
    try {
      const companyId = (req as any).user?.companyId;
      const data = await fleetService.getDocuments(companyId, req.params.id);
      res.json(data);
    } catch (error: any) {
      res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  }

  async addDocument(req: Request, res: Response) {
    try {
      const companyId = (req as any).user?.companyId;
      const userId = (req as any).user?.id;
      const validated = createDocumentSchema.parse({ params: req.params, body: req.body });
      
      const document = await fleetService.addDocument(companyId, userId, validated.params.id, validated.body);
      res.status(StatusCodes.CREATED).json(document);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Validation failed', details: error.errors });
      }
      res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  }

  async deleteDocument(req: Request, res: Response) {
    try {
      const companyId = (req as any).user?.companyId;
      const userId = (req as any).user?.id;
      const result = await fleetService.deleteDocument(companyId, userId, req.params.docId);
      res.json(result);
    } catch (error: any) {
      res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  }
}

export const fleetController = new FleetController();
