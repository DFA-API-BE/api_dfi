import { DeliveryAuthorizedData } from './../database/models/DeliveryAuthorized';
import { Request, Response } from 'express';
import Joi from 'joi';
import { UserRequest } from '../domain/user';
import { responseHandler } from '../utils/responseHandler';
import { statusCodeRenderer } from '../utils/statusCodeRenderer';
import { Users } from '../database/models/Users';
import { DeliveryAuthorizeds } from '../database/models/DeliveryAuthorized';
import { DeliveryAuthorizedsRelation } from '../database/models/relations/DeliveryAuthorized';

const deliveryAuthorizedSchema = Joi.object().keys({
  checkerAuthorizationAt: Joi.string(),
  driverAuthorizationAt: Joi.string(),
  deliveryId: Joi.number(),
  driverId: Joi.number(),
  checkerId: Joi.number(),
  isAuthorization: Joi.number(),
});

const updateParamsSchema = Joi.object().keys({
  id: Joi.number().required(),
});
const getDeliveryAuthorized = async (
  req: Omit<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Request<never, never, never, never, Record<string, any>>,
    'user'
  > & {
    user?: UserRequest;
  },
  res: Response,
) => {
  try {
    const { id } = req.user as UserRequest;

    const data = await DeliveryAuthorizedsRelation.findOne({
      where: {
        driverId: id,
      },
      include: [
        {
          model: Users,
          as: 'driver',
          attributes: ['name', 'email'],
        },
      ],
    });
    return responseHandler({
      res,
      statusCode: 200,
      message: 'Get Delivery Authorized',
      data,
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
};
const storeDeliveryAuthorized = async (
  req: Omit<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Request<never, never, DeliveryAuthorizedData, never, Record<string, any>>,
    'user'
  > & {
    user?: UserRequest;
  },
  res: Response,
) => {
  try {
    const validationDeliveryAuthorizedSchema =
      deliveryAuthorizedSchema.validate(req.body);
    if (validationDeliveryAuthorizedSchema.error) {
      return responseHandler({
        res,
        message: validationDeliveryAuthorizedSchema.error.message,
        statusCode: 400,
      });
    }

    const pickingAuthorized = await DeliveryAuthorizeds.create({
      ...req.body,
    });
    return responseHandler({
      res,
      message: 'Create Delivery Authorized Success!',
      data: pickingAuthorized,
    });
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
};
const updateDeliveryAuthorized = async (
  req: Omit<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Request<
      { id: string },
      never,
      DeliveryAuthorizedData,
      never,
      Record<string, any>
    >,
    'user'
  > & {
    user?: UserRequest;
  },
  res: Response,
) => {
  try {
    const params = {
      id: parseInt(req.params.id),
    };
    const validationDeliveryAuthorizedSchema =
      deliveryAuthorizedSchema.validate(req.body);
    if (validationDeliveryAuthorizedSchema.error) {
      return responseHandler({
        res,
        message: validationDeliveryAuthorizedSchema.error.message,
        statusCode: 400,
      });
    }

    const validationUpdateParams = updateParamsSchema.validate(params);
    if (validationUpdateParams.error) {
      return responseHandler({
        res,
        message: validationUpdateParams.error.message,
        statusCode: 400,
      });
    }
    const deliveryAuthorized = await DeliveryAuthorizeds.findOne({
      where: {
        id: params.id,
      },
    });
    await deliveryAuthorized?.update({
      ...req.body,
    });
    return responseHandler({
      res,
      message: 'Update Delivery Authorized Success!',
      data: deliveryAuthorized,
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
};

export default {
  storeDeliveryAuthorized,
  updateDeliveryAuthorized,
  getDeliveryAuthorized,
};
