import express from 'express';
import partnerPickingListAuthorizedController from '../controllers/partnerPickingListAuthorizedController';
const router = express.Router();

router.get('/', partnerPickingListAuthorizedController.getPartnerPickingAuthorized);
router.post('/', partnerPickingListAuthorizedController.storePickingAuthorized);
router.put('/:pickingAuthorizedId', partnerPickingListAuthorizedController.updatePickingAuthorized);

export { router as partnerPickingAuthorizedRoute };
