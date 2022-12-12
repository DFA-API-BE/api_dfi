import express from 'express';
import attendance from '../controllers/attendanceController';
const router = express.Router();

router.post('/arrival', attendance.checkIn);

export { router as attendanceRoute };
