import express from 'express';
import { Users } from '../database/models/Users';
import { responseHandler } from '../utils/responseHandler';
const router = express.Router();

/* GET users listing. */
router.get('/', async function(req, res) {
  try {
    const users = await Users.findAll();
    responseHandler({
      res,
      data: users.map(user=>{
        return {
          ...user.dataValues,
          password: undefined
        }

      })
    })
  } catch (e) {
    console.log(e)
    res.status(400).send(e)
  }
});

export {router as usersRouter};
