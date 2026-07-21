import { Router } from 'express';
import { driverController } from './controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';

const router = Router();

// All driver routes require authentication
router.use(authMiddleware);

// Stats
router.get('/stats', driverController.getStats.bind(driverController));

// Driver CRUD
router.get('/', driverController.getDrivers.bind(driverController));
router.post('/', driverController.createDriver.bind(driverController));
router.get('/:id', driverController.getDriver.bind(driverController));
router.put('/:id', driverController.updateDriver.bind(driverController));
router.delete('/:id', driverController.deleteDriver.bind(driverController));
router.patch('/:id/restore', driverController.restoreDriver.bind(driverController));

// Documents
router.get('/:id/documents', driverController.getDocuments.bind(driverController));
router.post('/:id/documents', driverController.addDocument.bind(driverController));
router.delete('/documents/:docId', driverController.deleteDocument.bind(driverController));

// Vehicle Assignment
router.post('/:id/assign-vehicle', driverController.assignVehicle.bind(driverController));
router.delete('/:id/unassign-vehicle', driverController.unassignVehicle.bind(driverController));

// Timeline
router.get('/:id/timeline', driverController.getTimeline.bind(driverController));

export const driverRoutes = router;
