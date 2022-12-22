import { Request, Response } from 'express';
import Joi from 'joi';
import { PaymentData, Payments } from '../database/models/Payment';
import { PaymentDetailBanks } from '../database/models/PaymentDetailBanks';
import { PaymentDetails } from '../database/models/PaymentDetails';
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
    const { PaymentDetailsData, PaymentDetailBanksData, ...paymentData } = req.body;
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

export default { storePayment };
