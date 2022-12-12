import jwt, { JwtPayload } from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { NextFunction, Request, Response } from 'express';
import { responseHandler } from '../utils/responseHandler';

dotenv.config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || '';

function checkToken(
  req: Omit<Request, 'user'> & { user?: string | JwtPayload | undefined },
  res: Response,
  next: NextFunction,
) {
  console.log('auth check');
  const authHeader = req.get('Authorization');
  if (authHeader) {
    jwt.verify(authHeader, JWT_SECRET_KEY, (err, user) => {
      if (err) {
        responseHandler({
          res,
          statusCode: 403,
          message: err.message,
        });
      } else {
        req.user = user;
        next();
      }
    });
  } else {
    responseHandler({
      res,
      statusCode: 403,
      message: 'route unauthorized',
    });
  }
}

export { checkToken };
