import { Request, Response } from 'express';
import Joi from 'joi';
import { Customers } from '../database/models/Customer';
import { PaymentData, Payments } from '../database/models/Payment';
import { PaymentDetailBanks } from '../database/models/PaymentDetailBanks';
import { PaymentDetails } from '../database/models/PaymentDetails';
import { PaymentsRelation } from '../database/models/relations/Payment';
import { UserRequest } from '../domain/user';
import { responseHandler } from '../utils/responseHandler';
import { statusCodeRenderer } from '../utils/statusCodeRenderer';
const paymentSchema = Joi.object().keys({
  paymentNumber: Joi.number().required(),
  customerId: Joi.number().required(),
  paymentDate: Joi.string().required(),
  cash: Joi.number(),
  giro: Joi.number(),
  retur: Joi.number(),
  otherPayment: Joi.number(),
  grandTotal: Joi.number().required(),
  transfer: Joi.number(),
  siteCode: Joi.string(),
  shipperNumber: Joi.string().required(),
  note: Joi.string(),
  PaymentDetailsData: Joi.array(),
  PaymentDetailBanksData: Joi.array(),
});
const paramsSchema = Joi.object().keys({
  id: Joi.number().required(),
});

const storePayment = async (
  req: Omit<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Request<never, never, PaymentData, never, Record<string, any>>,
    'user'
  > & {
    user?: UserRequest;
  },
  res: Response,
) => {
  try {
    const validationPaymentSchema = paymentSchema.validate(req.body);
    if (validationPaymentSchema.error) {
      return responseHandler({
        res,
        message: validationPaymentSchema.error.message,
        statusCode: 400,
      });
    }
    const { PaymentDetailsData, PaymentDetailBanksData, ...paymentData } =
      req.body;

    // check total payments
    const paymentValue = PaymentDetailsData.map((item) => item.value).reduce(
      (prev, next) => prev + next,
    );

    if (paymentValue < paymentData.grandTotal) {
      return responseHandler({
        res,
        message: 'Pembayaran Kurang',
      });
    }
    const storePayment = await Payments.create({ ...paymentData });
    const storePaymentDetails = PaymentDetailsData.map((e) => {
      e.paymentId = storePayment.dataValues.id;
      return e;
    });
    if (PaymentDetailBanksData.length !== 0) {
      const storePaymentDetailBanks = PaymentDetailBanksData.map((e) => {
        e.paymentId = storePayment.dataValues.id;
        return e;
      });
      PaymentDetailBanks.bulkCreate(storePaymentDetailBanks);
    }

    PaymentDetails.bulkCreate(storePaymentDetails);
    return responseHandler({
      res,
      message: 'Create Payment Success!',
      data: storePayment,
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

const cashReceipt = async (
  req: Omit<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Request<{ id: string }, never, never, never, Record<string, any>>,
    'user'
  > & {
    user?: UserRequest;
  },
  res: Response,
) => {
  try {
    const params = {
      id: req.params.id,
    };

    const validationParams = paramsSchema.validate(params);
    if (validationParams.error) {
      return responseHandler({
        res,
        message: validationParams.error.message,
        statusCode: 400,
      });
    }
    const data = await PaymentsRelation.findOne({
      where: {
        id: params.id,
      },
      include: [
        {
          model: PaymentDetails,
          as: 'payment_details',
        },
        {
          model: PaymentDetailBanks,
          as: 'payment_detail_banks',
        },
        {
          model: Customers,
          as: 'customer',
        },
      ],
    });
    return responseHandler({
      res,
      message: 'Detail Payment Success!',
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
export default { storePayment, cashReceipt };
