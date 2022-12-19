import { Request, Response } from 'express';
import Joi from 'joi';
import { dbConnection } from '../database/config/config';
import {
  DeliveriesDetailProductRelation,
  DeliveriesDetailRelation,
  DeliveriesUserPickingRelations,
} from '../database/models/relations/delivery';
import { UserRequest } from '../domain/user';
import { responseHandler } from '../utils/responseHandler';
import { statusCodeRenderer } from '../utils/statusCodeRenderer';

const updateParamsschema = Joi.object().keys({
  id: Joi.number().required(),
});

const getDeliveryList = async (req: Request, res: Response) => {
  try {
    return responseHandler({
      res,
      statusCode: 200,
      message: `Get All Employees ${req.query.type} Success`,
      data: [],
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

type CreateBody = Array<{
  pickingId: string;
  driverId: string;
  deliveryNumber: string;
  reasonId: number | null | undefined;
  outlets: Array<{
    customerCode: string;
    isSent: boolean | undefined;
    products: Array<{
      productCode: string;
      QtyAfterCheck: number;
    }>;
  }>;
}>;

const createDelivery = async (
  req: Omit<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Request<never, never, CreateBody, never, Record<string, any>>,
    'user'
  > & {
    user?: UserRequest;
  },
  res: Response,
) => {
  try {
    const { name } = req.user as UserRequest;
    await dbConnection.transaction(async (t) => {
      for await (const delivery of req.body) {
        const deliveryResult = await DeliveriesUserPickingRelations.create({
          ...delivery,
          createdBy: name,
          updatedBy: name,
        }, { transaction: t});
        for await (const details of delivery.outlets) {
          const detailsResult = await DeliveriesDetailRelation.create({
            ...details,
            deliveryId: deliveryResult.dataValues.id,
            createdBy: name,
            updatedBy: name,
          }, { transaction: t});
          for await (const products of details.products) {
            await DeliveriesDetailProductRelation.create({
              deliveryId: deliveryResult.dataValues.id,
              deliveryDetailId: detailsResult.dataValues.id,
              ...products,
              createdBy: name,
              updatedBy: name,
            }, { transaction: t});
          }
        }
      }
    });
    // const resultDelivery = await DeliveriesUserPickingRelations.bulkCreate(req.body);
    return responseHandler({
      res,
      message: 'Create Delivery Success!',
      data: [],
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    console.log(e);
    return responseHandler({
      res: res,
      statusCode: statusCodeRenderer(e.parent?.code ?? 'EREQUEST'),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      message: e.parent?.code === 'EREQUEST' ? "check your request" : "internal server error",
    });
  }
};

const updateDeliveryDetail = async (
  req: Omit<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Request<{ id: string }, never, any, never, Record<string, any>>,
    'user'
  > & {
    user?: UserRequest;
  },
  res: Response,
) => {
  try {
    // const { name } = req.user as UserRequest;
    const params = {
      id: req.params.id,
    };
    const validationUpdateParams = updateParamsschema.validate(params);
    if (validationUpdateParams.error) {
      return responseHandler({
        res,
        message: validationUpdateParams.error.message,
        statusCode: 400,
      });
    }
    return responseHandler({
      res,
      message: 'Update EMployee Success!',
      data: [],
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
  getDeliveryList,
  createDelivery,
  updateDeliveryDetail,
};
