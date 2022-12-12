import express from 'express';
import vehicleController from '../controllers/vehicleController';
const router = express.Router();

router.get('/', vehicleController.getVehicles);
router.post('/', vehicleController.storeVehicles);
router.put('/:id', vehicleController.updateVehicles);
router.delete('/:id', vehicleController.deleteVehicles);

export { router as vehiclesRoutes };
