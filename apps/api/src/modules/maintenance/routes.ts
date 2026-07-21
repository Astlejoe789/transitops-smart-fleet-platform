import { Router } from 'express';
import { maintenanceController } from './controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';

const router = Router();

// Protect all maintenance routes
router.use(authMiddleware);

// Basic CRUD
router.get('/', maintenanceController.getMaintenanceLogs.bind(maintenanceController));
router.post('/', maintenanceController.createMaintenanceLog.bind(maintenanceController));
router.get('/:id', maintenanceController.getMaintenanceLogById.bind(maintenanceController));
router.put('/:id', maintenanceController.updateMaintenanceLog.bind(maintenanceController));
router.delete('/:id', maintenanceController.deleteMaintenanceLog.bind(maintenanceController));

// Actions
router.patch('/:id/restore', maintenanceController.restoreMaintenanceLog.bind(maintenanceController));
router.patch('/:id/status', maintenanceController.updateMaintenanceStatus.bind(maintenanceController));
router.patch('/:id/assign-technician', maintenanceController.assignTechnician.bind(maintenanceController));

// Parts
router.post('/:id/parts', maintenanceController.addPart.bind(maintenanceController));
router.delete('/:id/parts/:partId', maintenanceController.deletePart.bind(maintenanceController));

// Documents
router.post('/:id/documents', maintenanceController.addDocument.bind(maintenanceController));
router.delete('/:id/documents/:docId', maintenanceController.deleteDocument.bind(maintenanceController));

export { router as maintenanceRoutes };
