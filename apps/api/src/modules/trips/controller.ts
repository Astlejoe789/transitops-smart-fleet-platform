import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { tripService } from './service.js';
import {
  createTripSchema,
  updateTripSchema,
  assignDriverSchema,
  assignVehicleSchema,
  updateTripStatusSchema,
} from './validation.js';

const getUser = (req: Request) => (req as any).user as { id: string; companyId: string; role: string };

export class TripController {
  async getTrips(req: Request, res: Response, next: NextFunction) {
    try {
      const { companyId } = getUser(req);
      const result = await tripService.getTrips(companyId, req.query);
      res.status(StatusCodes.OK).json({ status: 'success', ...result });
    } catch (error) {
      next(error);
    }
  }

  async getTripById(req: Request, res: Response, next: NextFunction) {
    try {
      const { companyId } = getUser(req);
      const trip = await tripService.getTripById(companyId, req.params.id);
      res.status(StatusCodes.OK).json({ status: 'success', data: trip });
    } catch (error) {
      next(error);
    }
  }

  async createTrip(req: Request, res: Response, next: NextFunction) {
    try {
      const { companyId, id: userId } = getUser(req);
      const validated = createTripSchema.parse({ body: req.body });
      const trip = await tripService.createTrip(companyId, userId, validated.body);
      res.status(StatusCodes.CREATED).json({ status: 'success', data: trip });
    } catch (error) {
      next(error);
    }
  }

  async updateTrip(req: Request, res: Response, next: NextFunction) {
    try {
      const { companyId, id: userId } = getUser(req);
      const validated = updateTripSchema.parse({ params: { id: req.params.id }, body: req.body });
      const trip = await tripService.updateTrip(companyId, userId, req.params.id, validated.body);
      res.status(StatusCodes.OK).json({ status: 'success', data: trip });
    } catch (error) {
      next(error);
    }
  }

  async deleteTrip(req: Request, res: Response, next: NextFunction) {
    try {
      const { companyId, id: userId } = getUser(req);
      await tripService.deleteTrip(companyId, userId, req.params.id);
      res.status(StatusCodes.OK).json({ status: 'success', message: 'Trip deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  async restoreTrip(req: Request, res: Response, next: NextFunction) {
    try {
      const { companyId, id: userId } = getUser(req);
      await tripService.restoreTrip(companyId, userId, req.params.id);
      res.status(StatusCodes.OK).json({ status: 'success', message: 'Trip restored successfully' });
    } catch (error) {
      next(error);
    }
  }

  async assignDriver(req: Request, res: Response, next: NextFunction) {
    try {
      const { companyId, id: userId } = getUser(req);
      const validated = assignDriverSchema.parse({ params: { id: req.params.id }, body: req.body });
      const trip = await tripService.assignDriver(companyId, userId, req.params.id, validated.body);
      res.status(StatusCodes.OK).json({ status: 'success', data: trip });
    } catch (error) {
      next(error);
    }
  }

  async assignVehicle(req: Request, res: Response, next: NextFunction) {
    try {
      const { companyId, id: userId } = getUser(req);
      const validated = assignVehicleSchema.parse({ params: { id: req.params.id }, body: req.body });
      const trip = await tripService.assignVehicle(companyId, userId, req.params.id, validated.body);
      res.status(StatusCodes.OK).json({ status: 'success', data: trip });
    } catch (error) {
      next(error);
    }
  }

  async updateTripStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { companyId, id: userId } = getUser(req);
      const validated = updateTripStatusSchema.parse({ params: { id: req.params.id }, body: req.body });
      const trip = await tripService.updateTripStatus(companyId, userId, req.params.id, validated.body);
      res.status(StatusCodes.OK).json({ status: 'success', data: trip });
    } catch (error) {
      next(error);
    }
  }

  async getDispatchBoard(req: Request, res: Response, next: NextFunction) {
    try {
      const { companyId } = getUser(req);
      const data = await tripService.getDispatchBoard(companyId);
      res.status(StatusCodes.OK).json({ status: 'success', data });
    } catch (error) {
      next(error);
    }
  }
}

export const tripController = new TripController();
