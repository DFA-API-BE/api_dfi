import express from 'express';
import { dbTest } from '../database/models/dbTest';
const router = express.Router();

/* GET example router. */
router.get('/', async function (req, res) {
  try {
    const dbTestData = await dbTest.findAll();
    res.send(dbTestData);
  } catch (e) {
    console.log(e)
    res.status(400).send(e)
  }
});

export { router as testsRouter };
