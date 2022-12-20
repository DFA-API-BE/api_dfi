import express from 'express';
import reasonController from '../controllers/reasonController';
const router = express.Router();

router.get('/', reasonController.getReasonList);

export { router as reasonRoute };
