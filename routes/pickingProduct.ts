import express from 'express';
import pickingDetailProductController from '../controllers/pickingDetailProductController';
const router = express.Router();

router.put(
  '/:productId',
  pickingDetailProductController.updatePickingDetailProduct,
);
export { router as pickingProductRoute };
