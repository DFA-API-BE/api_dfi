import express from 'express';
import paymentController from '../controllers/paymentController';
const router = express.Router();

router.get('/:id', paymentController.cashReceipt);
router.post('/', paymentController.storePayment);
export { router as PaymentRoutes };
