import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { NextFunction, Request, Response } from 'express';
import { responseHandler } from '../utils/responseHandler';
import { UserRequest } from '../domain/user';

dotenv.config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || '';

function checkToken(
  req: Omit<Request, 'user'> & { user?: UserRequest | undefined },
  res: Response,
  next: NextFunction,
) {
  console.log('auth check');
  const authHeader = req.get('Authorization');
  if (authHeader) {
    try {
      const decoded = jwt.verify(authHeader, JWT_SECRET_KEY) as UserRequest;
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
  } else {
    responseHandler({
      res,
      statusCode: 403,
      message: 'route unauthorized',
    });
  }
}

export { checkToken };
