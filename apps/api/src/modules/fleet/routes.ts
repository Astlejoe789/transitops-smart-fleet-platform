import { Router } from 'express';
import { fleetController } from './controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';

const router = Router();

// Protect all fleet routes
router.use(authMiddleware);

// Vehicle CRUD
router.get('/', fleetController.getVehicles);
router.post('/', fleetController.createVehicle);
router.get('/:id', fleetController.getVehicle);
router.put('/:id', fleetController.updateVehicle);
router.delete('/:id', fleetController.deleteVehicle);
router.post('/:id/restore', fleetController.restoreVehicle);

// Vehicle Documents
router.get('/:id/documents', fleetController.getDocuments);
router.post('/:id/documents', fleetController.addDocument);
router.delete('/documents/:docId', fleetController.deleteDocument);

export const fleetRoutes = router;
