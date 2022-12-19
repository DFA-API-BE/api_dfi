import express from 'express';
import deliveryController from '../controllers/deliveryController';
const router = express.Router();

router.get('/', deliveryController.getDeliveryList);
router.post('/create', deliveryController.createDelivery);
router.put('/:id', deliveryController.updateDeliveryDetail);

export { router as deliveryRoutes };
