import express, { Request, Response } from 'express';
import { Users } from '../database/models/Users';
import Joi from 'joi';
import bcrypt from 'bcryptjs';
import { responseHandler } from '../utils/responseHandler';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config();

type RegisterRequest = {
  name: string;
  email: string;
  password: string;
};

type LoginRequest = {
  email: string;
  password: string;
};

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || '';
const router = express.Router();
const registerSchema = Joi.object().keys({
  name: Joi.string().max(64).required(),
  email: Joi.string().required(),
  password: Joi.string().required(),
});
const loginSchema = Joi.object().keys({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

const statusCodeRenderer = (status: string) => {
  switch (status) {
    case 'EREQUEST':
      return 400;
    default:
      return 500;
  }
};

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
        return responseHandler({
          res: res,
          message: validateRegisterSchema.error.message,
          statusCode: 400,
        });
      }
      const hashedPassword = await bcrypt
        .hash(req.body.password, 12)
        .then((password) => password);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const insertDB = await Users.create({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        isActive: 1,
      });
      return responseHandler({ res: res, message: 'success', data: {} });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      return responseHandler({
        res: res,
        statusCode: statusCodeRenderer(e.parent.code),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        message: e.errors.map((err: any) => {
          return `${err.value} is ${err.validatorKey}`;
        }),
      });
    }
  },
);

router.post(
  '/login',
  async (
    req: Omit<Request, 'body'> & { body: LoginRequest },
    res: Response,
  ) => {
    try {
      const validateLoginSchema = loginSchema.validate(req.body);
      if (validateLoginSchema.error) {
        return responseHandler({
          res,
          message: validateLoginSchema.error.message,
          statusCode: 400,
        });
      }
      const findUser = await Users.findOne({
        where: {
          email: req.body.email,
        },
      });
      if (findUser === null) {
        return responseHandler({
          res,
          statusCode: 404,
          message: 'user not found',
        });
      } else {
        const isPasswordCorrect = await bcrypt
          .compare(req.body.password, findUser.dataValues.password)
          .then((result) => result);
        if (!isPasswordCorrect) {
          return responseHandler({
            res,
            statusCode: 422,
            message: 'wrong password',
          });
        } else {
          const payload = {
            id: findUser.dataValues.id,
            name: findUser.dataValues.name,
            email: findUser.dataValues.email,
          };

          jwt.sign(
            payload,
            JWT_SECRET_KEY,
            {
              expiresIn: '7d',
            },
            (error, token) => {
              if (error) {
                return responseHandler({
                  res,
                  statusCode: 422,
                  message: error.message,
                });
              } else {
                return responseHandler({
                  res,
                  data: { token: token },
                });
              }
            },
          );
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      res.send('err');
    }
  },
);

export { router as authRouter };
