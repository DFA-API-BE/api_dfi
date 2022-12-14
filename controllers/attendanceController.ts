import { Request, Response } from 'express';
import Joi from 'joi';
import { Attendances, AttendancesData } from '../database/models/Attendaces';
import { UserRequest } from '../domain/user';
import { responseHandler } from '../utils/responseHandler';
import { statusCodeRenderer } from '../utils/statusCodeRenderer';

const checkinSchema = Joi.object().keys({
  time: Joi.date().required(),
  photoUrl: Joi.string().required(),
  lat: Joi.string().required(),
  long: Joi.string().required(),
  isArrival: Joi.boolean().required(),
});

const checkIn = async (
  req: Omit<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Request<never, never, AttendancesData, never, Record<string, any>>,
    'user'
  > & {
    user?: UserRequest;
  },
  res: Response,
) => {
  const { id } = req.user as UserRequest;

  const validationCheckInSchema = checkinSchema.validate(req.body);
  if (validationCheckInSchema.error) {
    return responseHandler({
      res,
      message: validationCheckInSchema.error.message,
      statusCode: 400,
    });
  } else {
    try {
      const storeEmployee = await Attendances.create({
        ...req.body,
        userId: id as number,
      });

      return responseHandler({
        res,
        message: 'CheckIn Success!',
        data: storeEmployee,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      return responseHandler({
        res: res,
        statusCode: statusCodeRenderer(e.parent?.code ?? 'EREQUEST'),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        message: e.errors.map((err: any) => {
          return `${err.value} is ${err.validatorKey}`;
        }),
      });
    }
  }
};

export default { checkIn };
