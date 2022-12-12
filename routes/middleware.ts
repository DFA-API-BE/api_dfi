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
    try {
      const decoded = jwt.verify(authHeader, JWT_SECRET_KEY);
      req.user = decoded;
      next();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      responseHandler({
        res,
        statusCode: 403,
        message: e.message,
      });
    }
    // jwt.verify(authHeader, JWT_SECRET_KEY, (err, user) => {
    //   if (err) {
    //     responseHandler({
    //       res,
    //       statusCode: 403,
    //       message: err.message,
    //     });
    //   } else {
    //     const payload = jwt.decode(user)
    //     req.user = user;
    //     next();
    //   }
    // });
  } else {
    responseHandler({
      res,
      statusCode: 403,
      message: 'route unauthorized',
    });
  }
}

export { checkToken };
