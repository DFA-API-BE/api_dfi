import { Request, Response } from 'express';
import Joi from 'joi';
import {
  PickingDetailProductData,
  PickingDetailProducts,
} from '../database/models/PickingDetailProduct';
import { UserRequest } from '../domain/user';
import { responseHandler } from '../utils/responseHandler';
import { statusCodeRenderer } from '../utils/statusCodeRenderer';

const pickingUpdateSchema = Joi.object().keys({
  productName: Joi.string(),
  UOMSmallestSell: Joi.number(),
  isiKoliSmallestSell: Joi.number(),
  qtySmallReal: Joi.number(),
  qtyBig: Joi.number(),
  qtySmall: Joi.number(),
});

const updateParamsSchema = Joi.object().keys({
  id: Joi.number().required(),
});
const updatePickingDetailProduct = async (
  req: Omit<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Request<
      { productId: string },
      never,
      PickingDetailProductData,
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
    const { id } = req.user as UserRequest;
    const params = {
      productId: parseInt(req.params.productId),
    };
    const validationPickingUpdateSchema = pickingUpdateSchema.validate(
      req.body,
    );
    if (validationPickingUpdateSchema.error) {
      return responseHandler({
        res,
        message: validationPickingUpdateSchema.error.message,
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
    const pickingProduct = await PickingDetailProducts.findOne({
      where: {
        id: params.productId,
      },
    });
    await pickingProduct?.update({
      ...req.body,
      updatedBy: id,
    });
    return responseHandler({
      res,
      message: 'Update Picking Detail Product Success!',
      data: pickingProduct,
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
export default { updatePickingDetailProduct };
