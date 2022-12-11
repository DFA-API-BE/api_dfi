import express, { Request, Response } from 'express';
import { Users } from '../database/models/Users';
import Joi from 'joi';
import bcrypt from 'bcryptjs';

type RegisterRequest = {
  name: string;
  email: string;
  password: string;
};

const router = express.Router();
const registerSchema = Joi.object().keys({
  name: Joi.string().max(64).required(),
  email: Joi.string().required(),
  password: Joi.string().required(),
});

// register user
router.post(
  '/register',
  async function (
    req: Omit<Request, 'body'> & { body: RegisterRequest },
    res: Response,
  ) {
    try {
      const validateRegisterSchema = registerSchema.validate(req.body);
      if (validateRegisterSchema.error) {
        res.status(400).send(validateRegisterSchema.error);
      }
      const hashedPassword = await bcrypt.hash(req.body.password, 12).then(password => password);
      const insertDB = await Users.create({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        isActive: 1
      });
      res.send(insertDB);
    } catch (e) {
      console.log(e);
      res.status(500).send(e);
    }
  },
);

export { router as authRouter };
