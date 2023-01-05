import { Request, Response } from 'express';
import Joi from 'joi';
import { Op } from 'sequelize';
import { dbConnection } from '../database/config/config';
import {
  CustomerDeliveryRelation,
  DeliveriesDetailProductRelation,
  DeliveriesDetailRelation,
  DeliveriesUserPickingRelations,
  ProductDeliveryDetailRelation,
  ProductPriceCurrentRelation,
  ProductUOMRelation,
  ReasonDeliveryRelation,
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
  paymentNumber: Joi.string(),
  reasonId: Joi.number(),
  imageDelivery: Joi.string(),
});
const updateDeliveryDetailProductSchema = Joi.object().keys({
  qtyTerima: Joi.number(),
  qtyPartial: Joi.number(),
  reasonId: Joi.number(),
  qtyActualAfterDelivery: Joi.number(),
});

const getDeliveryList = async (
  req: Request & {
    user?: UserRequest;
  },
  res: Response,
) => {
  const TODAY_START = new Date().setHours(0, 0, 0, 0);
  const NOW = new Date();
  try {
    const result = await DeliveriesUserPickingRelations.findOne({
      where: {
        driverId: req.user?.id,
        createdAt: {
          [Op.gt]: TODAY_START,
          [Op.lt]: NOW,
        },
      },
      include: [
        {
          model: DeliveriesDetailRelation,
          include: [
            {
              model: ReasonDeliveryRelation,
            },
            {
              model: CustomerDeliveryRelation
            }
          ],
        },
      ],
    });

    const newResponse = await Promise.all(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      result?.dataValues?.DeliveryDetails?.map(async (v: any) => {
        const DeliveryDetailProducts = await DeliveriesDetailProductRelation.findAll({
          where: {
            deliveryDetailId: v.dataValues.id,
          },
          include: [
            {
              model: ProductDeliveryDetailRelation,
              include: [
                {
                  model: ProductUOMRelation,
                  include: [
                    {
                      model: ProductPriceCurrentRelation,
                      where: {
                        ChannelID: v.dataValues.channelId
                      }
                    },
                  ],
                },
              ],
            },
            {
              model: ReasonDeliveryRelation,
            },
          ],
        });
        return { ...v.dataValues, DeliveryDetailProducts };
      }) ?? [],
    );
    return responseHandler({
      res,
      statusCode: 200,
      message: `Get today outlet Success`,
      data: newResponse ?? [],
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
    const { name, id } = req.user as UserRequest;
    await dbConnection.transaction(async (t) => {
      for await (const delivery of req.body) {
        const deliveryResult = await DeliveriesUserPickingRelations.create(
          {
            ...delivery,
            driverId: id,
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

const updateDeliveryDetailProduct = async (
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
    const validationUpdateDetailProductBody =
      updateDeliveryDetailProductSchema.validate(req.body);
    if (validationUpdateDetailProductBody.error) {
      return responseHandler({
        res,
        message: validationUpdateDetailProductBody.error.message,
        statusCode: 400,
      });
    }
    const deliveryDetailProductData =
      await DeliveriesDetailProductRelation.findOne({
        where: {
          id: params.id,
        },
      });
    if (deliveryDetailProductData === null) {
      return responseHandler({
        res,
        message: 'data delivery product tidak ditemukan',
        statusCode: 404,
      });
    } else {
      await deliveryDetailProductData.update({
        ...deliveryDetailProductData.dataValues,
        ...req.body,
        updatedBy: name,
      });
      return responseHandler({
        res,
        message: 'Update delivery detail Success!',
        data: deliveryDetailProductData,
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
  updateDeliveryDetailProduct,
};
