import express from 'express';
import partnerController from '../controllers/partnerController';
const router = express.Router();

router.get('/', partnerController.getPartner);
router.post('/', partnerController.storePartners);

export { router as partnerRoutes };
