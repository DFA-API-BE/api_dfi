import express from 'express';
import paymentController from '../controllers/paymentController';
const router = express.Router();

router.post('/', paymentController.storePayment);
export { router as PaymentRoutes };
