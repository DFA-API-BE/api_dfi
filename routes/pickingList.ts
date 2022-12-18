import express from 'express';
import pickingController from '../controllers/pickingController';
const router = express.Router();

router.get('/', pickingController.getPickingLists);
export { router as pickingListRoute };
