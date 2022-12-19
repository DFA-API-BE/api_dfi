import { Request, Response } from 'express';
import Joi from 'joi';
import { Op } from 'sequelize';
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
const updateDeliveryDetailSchema = Joi.object().keys({
  driverIdAuthorized: Joi.number(),
  checkerIdAuthorized: Joi.number(),
  isSent: Joi.number(),
  claim: Joi.number(),
  tunai: Joi.number(),
  isLunas: Joi.boolean(),
});

const getDeliveryList = async (req: Request, res: Response) => {
  const TODAY_START = new Date().setHours(0, 0, 0, 0);
  const NOW = new Date();
  try {
    const result = await DeliveriesDetailRelation.findAll({
      where: {
        createdAt: {
          [Op.gt]: TODAY_START,
          [Op.lt]: NOW,
        },
      },
      include: [
        {
          model: DeliveriesDetailProductRelation,
        },
      ],
    });
    return responseHandler({
      res,
      statusCode: 200,
      message: `Get today outlet Success`,
      data: result,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    console.log(e);
    return responseHandler({
      res: res,
      statusCode: statusCodeRenderer(e.parent?.code ?? 'EREQUEST'),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      message: e,
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
        const deliveryResult = await DeliveriesUserPickingRelations.create(
          {
            ...delivery,
            createdBy: name,
            updatedBy: name,
          },
          { transaction: t },
        );
        for await (const details of delivery.outlets) {
          // harusnya ambil sequence dari PL
          const detailsResult = await DeliveriesDetailRelation.create(
            {
              ...details,
              deliveryId: deliveryResult.dataValues.id,
              createdBy: name,
              updatedBy: name,
            },
            { transaction: t },
          );
          for await (const products of details.products) {
            await DeliveriesDetailProductRelation.create(
              {
                deliveryId: deliveryResult.dataValues.id,
                deliveryDetailId: detailsResult.dataValues.id,
                ...products,
                createdBy: name,
                updatedBy: name,
              },
              { transaction: t },
            );
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
      message:
        e.parent?.code === 'EREQUEST'
          ? 'check your request'
          : 'internal server error',
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
    const { name } = req.user as UserRequest;
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
    const validationUpdateDetailBody = updateDeliveryDetailSchema.validate(
      req.body,
    );
    if (validationUpdateDetailBody.error) {
      return responseHandler({
        res,
        message: validationUpdateDetailBody.error.message,
        statusCode: 400,
      });
    }
    const deliveryDetailData = await DeliveriesDetailRelation.findOne({
      where: {
        id: params.id,
      },
    });
    if (deliveryDetailData === null) {
      return responseHandler({
        res,
        message: 'data delivery tidak ditemukan',
        statusCode: 404,
      });
    } else {
      await deliveryDetailData.update({
        ...deliveryDetailData.dataValues,
        ...req.body,
        updatedBy: name,
      });
      return responseHandler({
        res,
        message: 'Update delivery detail Success!',
        data: deliveryDetailData,
      });
    }
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
