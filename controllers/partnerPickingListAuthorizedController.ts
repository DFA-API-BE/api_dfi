import { Request, Response } from 'express';
import Joi from 'joi';
import { UserRequest } from '../domain/user';
import {
  PartnerPickingAuthorizedData,
  PartnerPickingListAuthorizeds,
} from '../database/models/PartnerPickingListAuthorized';
import { responseHandler } from '../utils/responseHandler';
import { statusCodeRenderer } from '../utils/statusCodeRenderer';
import { PartnerPickingListAuthorizedsRelation } from '../database/models/relations/PartnerPickingAuthorized';
import { Users } from '../database/models/Users';
import { Op } from 'sequelize';
import moment from 'moment';
import { UsersRelation } from '../database/models/relations/user';
import { Partners } from '../database/models/Partner';
import { Vehicles } from '../database/models/Vehicles';
import { PartnerHelpers } from '../database/models/PartnerHelper';
import { PickingLists } from '../database/models/PickingList';

const pickingAuthorizedSchema = Joi.object().keys({
  image: Joi.string(),
  checkerAuthorizationAt: Joi.string(),
  driverAuthorizationAt: Joi.string(),
  pickingListId: Joi.number(),
  driverId: Joi.number(),
  checkerId: Joi.number(),
  isAuthorization: Joi.number(),
});

const updateParamsSchema = Joi.object().keys({
  pickingAuthorizedId: Joi.number().required(),
});
const getPartnerPickingAuthorized = async (
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

    const data = await PartnerPickingListAuthorizedsRelation.findOne({
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
      message: 'Get Partner Picking Authorized',
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
const storePickingAuthorized = async (
  req: Omit<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Request<
      never,
      never,
      PartnerPickingAuthorizedData,
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
    const validationPickingAuthorizedSchema = pickingAuthorizedSchema.validate(
      req.body,
    );
    if (validationPickingAuthorizedSchema.error) {
      return responseHandler({
        res,
        message: validationPickingAuthorizedSchema.error.message,
        statusCode: 400,
      });
    }

    const pickingAuthorized = await PartnerPickingListAuthorizeds.create({
      ...req.body,
    });
    return responseHandler({
      res,
      message: 'Create Partner Picking Authorized Success!',
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
const updatePickingAuthorized = async (
  req: Omit<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Request<
      { pickingAuthorizedId: string },
      never,
      PartnerPickingAuthorizedData,
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
      pickingAuthorizedId: parseInt(req.params.pickingAuthorizedId),
    };
    const validationPickingAuthorizedSchema = pickingAuthorizedSchema.validate(
      req.body,
    );
    if (validationPickingAuthorizedSchema.error) {
      return responseHandler({
        res,
        message: validationPickingAuthorizedSchema.error.message,
        statusCode: 400,
      });
    }
    // const id: string = req.params.id;
    const validationUpdateParams = updateParamsSchema.validate(params);
    if (validationUpdateParams.error) {
      return responseHandler({
        res,
        message: validationUpdateParams.error.message,
        statusCode: 400,
      });
    }
    const partnerPickingAuthorized =
      await PartnerPickingListAuthorizeds.findOne({
        where: {
          id: params.pickingAuthorizedId,
        },
      });
    await partnerPickingAuthorized?.update({
      ...req.body,
    });
    return responseHandler({
      res,
      message: 'Update Partner Picking Authorized Success!',
      data: partnerPickingAuthorized,
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

const getDispatchNote = async (
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
    const data = await PartnerPickingListAuthorizedsRelation.findAll({
      where: {
        createdAt: {
          [Op.gte]: moment().tz('Asia/Jakarta').startOf('day'),
          [Op.lte]: moment().tz('Asia/Jakarta').endOf('day'),
        },
        driverId: id,
      },
      include: [
        {
          model: UsersRelation,
          as: 'driver',
          attributes: ['name'],
          include: [
            {
              model: Partners,
              as: 'partners',
              attributes: ['id', 'driverId', 'vehicleId'],
              include: [
                {
                  model: Vehicles,
                  as: 'vehicle',
                  attributes: ['code'],
                },
                {
                  model: PartnerHelpers,
                  as: 'helpers',
                  attributes: ['id', 'partnerId', 'helperId'],
                  include: [
                    {
                      model: Users,
                      as: 'helper',
                      attributes: ['name'],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          model: PickingLists,
          as: 'picking_list',
        },
      ],
    });
    return responseHandler({
      res,
      statusCode: 200,
      message: 'Get Dispatch Note',
      data,
    });
  } catch (e: any) {
    return responseHandler({
      res: res,
      statusCode: statusCodeRenderer(e.parent?.code ?? 'EREQUEST'),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      message: e.message,
    });
  }
};
export default {
  storePickingAuthorized,
  updatePickingAuthorized,
  getPartnerPickingAuthorized,
  getDispatchNote,
};
