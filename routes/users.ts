import express from 'express';
import { Users } from '../database/models/Users';
const router = express.Router();

/* GET users listing. */
router.get('/', async function(req, res) {
  try {
    const dbTestData = await Users.findAll();
    res.send(dbTestData);
  } catch (e) {
    console.log(e)
    res.status(400).send(e)
  }
});

export {router as usersRouter};
