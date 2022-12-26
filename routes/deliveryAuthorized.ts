import express from 'express';
import deliveryAuthorizedController from '../controllers/deliveryAuthorizedController';
const router = express.Router();

router.get(
  '/',
  deliveryAuthorizedController.getDeliveryAuthorized,
);
router.post('/', deliveryAuthorizedController.storeDeliveryAuthorized);
router.put(
  '/:id',
  deliveryAuthorizedController.updateDeliveryAuthorized,
);

export { router as deliveryAuthorizedRoute };
