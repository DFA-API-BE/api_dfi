import express from 'express';
import deliveryController from '../controllers/deliveryController';
const router = express.Router();

router.get('/', deliveryController.getDeliveryList);
router.post('/create', deliveryController.createDelivery);
router.put('/:id', deliveryController.updateDeliveryDetail);
router.put('/product/:id', deliveryController.updateDeliveryDetailProduct);

export { router as deliveryRoutes };
