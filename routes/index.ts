import express from 'express';
import { usersRouter } from './users';
import { authRouter } from './auth';
import { vehiclesRoutes } from './vehicles';
import { checkToken } from './middleware';
import { employeesRoutes } from './employees';
import { attendanceRoute } from './attendance';
import { partnerRoutes } from './partner';
import { pickingListRoute } from './pickingList';
import { pickingProductRoute } from './pickingProduct';
import { deliveryRoutes } from './delivery';
import { partnerPickingAuthorizedRoute } from './partnerPickingAuthorized';
import { reasonRoute } from './reason';
const router = express.Router();

router.use('/users', checkToken, usersRouter);
router.use('/vehicles', checkToken, vehiclesRoutes);
router.use('/employees', checkToken, employeesRoutes);
router.use('/checkIn', checkToken, attendanceRoute);
router.use('/partners', checkToken, partnerRoutes);
router.use('/picking_lists', checkToken, pickingListRoute);
router.use('/picking_products', checkToken, pickingProductRoute);
router.use('/delivery',checkToken, deliveryRoutes);
router.use('/partner_picking_authorized', checkToken, partnerPickingAuthorizedRoute);
router.use('/auth', authRouter);
router.use('/reasons', checkToken, reasonRoute)
/* GET home page. */
router.get('/', function (req, res) {
  res.send({ title: 'DFA API Services' });
});

export { router as indexRouter };
