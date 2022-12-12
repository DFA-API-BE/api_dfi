import express from 'express';
import { usersRouter } from './users';
import { authRouter } from './auth';
import { vehiclesRoutes } from './vehicles';
import { checkToken } from './middleware';
const router = express.Router();

router.use('/users', checkToken, usersRouter);
router.use('/vehicles', checkToken, vehiclesRoutes);
router.use('/auth', authRouter);
/* GET home page. */
router.get("/", function (req, res) {
  res.render("index", { title: "Express" });
});


export { router as indexRouter };
