import express from 'express';
import { Drivers } from '../database/models/Drivers';
const router = express.Router();

/* GET example router. */
router.get('/', async function (req, res) {
  try {
    const dbTestData = await Drivers.findAll();
    res.send(dbTestData);
  } catch (e) {
    console.log(e)
    res.status(400).send(e)
  }
});

export { router as driversRouter };
