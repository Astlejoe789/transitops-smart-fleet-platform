import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { driverService } from './service.js';
import {
  createDriverSchema,
  updateDriverSchema,
  createDocumentSchema,
  assignVehicleSchema,
} from './validation.js';

// Helper to extract user context from JWT middleware
const getUser = (req: Request) => (req as any).user as { id: string; companyId: string };

export class DriverController {
  // ─── List Drivers ───────────────────────────────────────────────────────────
  async getDrivers(req: Request, res: Response) {
    try {
      const { companyId } = getUser(req);
      const data = await driverService.getDrivers(companyId, req.query as any);
      res.json(data);
    } catch (error: any) {
      res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  }

  // ─── Get Driver Stats ───────────────────────────────────────────────────────
  async getStats(req: Request, res: Response) {
    try {
      const { companyId } = getUser(req);
      const data = await driverService.getDriverStats(companyId);
      res.json(data);
    } catch (error: any) {
      res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  }

  // ─── Get Driver ─────────────────────────────────────────────────────────────
  async getDriver(req: Request, res: Response) {
    try {
      const { companyId } = getUser(req);
      const data = await driverService.getDriverById(companyId, req.params.id);
      res.json(data);
    } catch (error: any) {
      res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  }

  // ─── Create Driver ──────────────────────────────────────────────────────────
  async createDriver(req: Request, res: Response) {
    try {
      const { companyId, id: userId } = getUser(req);
      const validated = createDriverSchema.parse({ body: req.body });
      const driver = await driverService.createDriver(companyId, userId, validated.body);
      res.status(StatusCodes.CREATED).json(driver);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: 'Validation failed', details: error.errors });
      }
      res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  }

  // ─── Update Driver ──────────────────────────────────────────────────────────
  async updateDriver(req: Request, res: Response) {
    try {
      const { companyId, id: userId } = getUser(req);
      const validated = updateDriverSchema.parse({ params: req.params, body: req.body });
      const driver = await driverService.updateDriver(companyId, userId, validated.params.id, validated.body);
      res.json(driver);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: 'Validation failed', details: error.errors });
      }
      res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  }

  // ─── Delete Driver (Soft) ───────────────────────────────────────────────────
  async deleteDriver(req: Request, res: Response) {
    try {
      const { companyId, id: userId } = getUser(req);
      const result = await driverService.deleteDriver(companyId, userId, req.params.id);
      res.json(result);
    } catch (error: any) {
      res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  }

  // ─── Restore Driver ─────────────────────────────────────────────────────────
  async restoreDriver(req: Request, res: Response) {
    try {
      const { companyId, id: userId } = getUser(req);
      const result = await driverService.restoreDriver(companyId, userId, req.params.id);
      res.json(result);
    } catch (error: any) {
      res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  }

  // ─── Get Driver Documents ───────────────────────────────────────────────────
  async getDocuments(req: Request, res: Response) {
    try {
      const { companyId } = getUser(req);
      const data = await driverService.getDriverDocuments(companyId, req.params.id);
      res.json(data);
    } catch (error: any) {
      res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  }

  // ─── Add Document ───────────────────────────────────────────────────────────
  async addDocument(req: Request, res: Response) {
    try {
      const { companyId, id: userId } = getUser(req);
      const validated = createDocumentSchema.parse({ params: req.params, body: req.body });
      const doc = await driverService.addDocument(companyId, userId, validated.params.id, validated.body);
      res.status(StatusCodes.CREATED).json(doc);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: 'Validation failed', details: error.errors });
      }
      res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  }

  // ─── Delete Document ────────────────────────────────────────────────────────
  async deleteDocument(req: Request, res: Response) {
    try {
      const { companyId, id: userId } = getUser(req);
      const result = await driverService.deleteDocument(companyId, userId, req.params.docId);
      res.json(result);
    } catch (error: any) {
      res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  }

  // ─── Assign Vehicle ─────────────────────────────────────────────────────────
  async assignVehicle(req: Request, res: Response) {
    try {
      const { companyId, id: userId } = getUser(req);
      const validated = assignVehicleSchema.parse({ params: req.params, body: req.body });
      const result = await driverService.assignVehicle(companyId, userId, validated.params.id, validated.body);
      res.json(result);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: 'Validation failed', details: error.errors });
      }
      res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  }

  // ─── Unassign Vehicle ───────────────────────────────────────────────────────
  async unassignVehicle(req: Request, res: Response) {
    try {
      const { companyId, id: userId } = getUser(req);
      const result = await driverService.unassignVehicle(companyId, userId, req.params.id);
      res.json(result);
    } catch (error: any) {
      res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  }

  // ─── Driver Timeline ────────────────────────────────────────────────────────
  async getTimeline(req: Request, res: Response) {
    try {
      const { companyId } = getUser(req);
      const data = await driverService.getDriverTimeline(companyId, req.params.id);
      res.json(data);
    } catch (error: any) {
      res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  }
}

export const driverController = new DriverController();
