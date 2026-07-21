import { Router } from 'express';
import { tripController } from './controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';

const router = Router();

// Protect all trip routes
router.use(authMiddleware);

// Dispatch Board (Must come before /:id)
router.get('/dispatch/board', tripController.getDispatchBoard.bind(tripController));

// Basic CRUD
router.get('/', tripController.getTrips.bind(tripController));
router.post('/', tripController.createTrip.bind(tripController));
router.get('/:id', tripController.getTripById.bind(tripController));
router.put('/:id', tripController.updateTrip.bind(tripController));
router.delete('/:id', tripController.deleteTrip.bind(tripController));

// Actions
router.patch('/:id/restore', tripController.restoreTrip.bind(tripController));
router.patch('/:id/assign-driver', tripController.assignDriver.bind(tripController));
router.patch('/:id/assign-vehicle', tripController.assignVehicle.bind(tripController));
router.patch('/:id/status', tripController.updateTripStatus.bind(tripController));

export { router as tripRoutes };
