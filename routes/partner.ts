import express from 'express';
import partnerController from '../controllers/partnerController';
const router = express.Router();

router.get('/', partnerController.getPartner);
router.post('/', partnerController.storePartners);
router.put('/:id', partnerController.updatePartner);

export { router as partnerRoutes };
