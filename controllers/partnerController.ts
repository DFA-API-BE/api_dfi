import { PartnerData, Partners } from './../database/models/Partner';
import { Request, Response } from 'express';
import Joi from 'joi';
import { UserRequest } from '../domain/user';
import { responseHandler } from '../utils/responseHandler';
import { Users } from '../database/models/Users';
import { statusCodeRenderer } from '../utils/statusCodeRenderer';
import { PartnerHelpers } from '../database/models/PartnerHelper';
import { Vehicles } from '../database/models/Vehicles';
import { PartnersRelation } from '../database/models/relations/partner';
import { PartnerHelpersRelation } from '../database/models/relations/partnerHelper';

const partnerSchema = Joi.object().keys({
  vehicleId: Joi.number().required(),
  helpers: Joi.array().min(1).required(),
});
const partnerUpdateSchema = Joi.object().keys({
  helpers: Joi.array().min(1),
  vehicleId: Joi.number().integer(),
});

const updateParamsschema = Joi.object().keys({
  id: Joi.number().required(),
});

const getPartner = async (
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
    const data = await PartnersRelation.findOne({
      where: {
        driverId: id,
      },
      include: [
        {
          model: PartnerHelpersRelation,
          as: 'helpers',
          include: [
            {
              model: Users,
              as: 'helper',
              attributes: ['name'],
            },
          ],
        },
        {
          model: Users,
          as: 'driver',
          attributes: ['name', 'profilePic'],
        },
        {
          model: Vehicles,
          as: 'vehicle',
          attributes: ['code'],
        },
      ],
    });
    return responseHandler({
      res,
      statusCode: 200,
      message: 'Get Detail Partner',
      data,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    return responseHandler({
      res: res,
      statusCode: statusCodeRenderer(e.parent?.code ?? 'EREQUEST'),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      message: e.message,
    });
  }
};

const storePartners = async (
  req: Omit<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Request<never, never, PartnerData, never, Record<string, any>>,
    'user'
  > & {
    user?: UserRequest;
  },
  res: Response,
) => {
  try {
    const { id } = req.user as UserRequest;

    const validationPartnerSchema = partnerSchema.validate(req.body);
    if (validationPartnerSchema.error) {
      return responseHandler({
        res,
        message: validationPartnerSchema.error.message,
        statusCode: 400,
      });
    }
    const storePartner = await Partners.create({
      driverId: id,
      vehicleId: req.body.vehicleId,
    });
    const data: Array<{ partnerId: number; helperId: number }> = [];
    req.body.helpers.forEach((e) => {
      data.push({
        partnerId: storePartner.dataValues.id,
        helperId: e,
      });
    });
    PartnerHelpers.bulkCreate(data);
    return responseHandler({
      res,
      message: 'Create Partner Success!',
      data: storePartner,
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

const updatePartner = async (
  req: Omit<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Request<{ id: string }, never, PartnerData, never, Record<string, any>>,
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
    const validationPartnerSchema = partnerUpdateSchema.validate(req.body);
    if (validationPartnerSchema.error) {
      return responseHandler({
        res,
        message: validationPartnerSchema.error.message,
        statusCode: 400,
      });
    }
    // const id: string = req.params.id;
    const validationUpdateParams = updateParamsschema.validate(params);
    if (validationUpdateParams.error) {
      return responseHandler({
        res,
        message: validationUpdateParams.error.message,
        statusCode: 400,
      });
    }

    const partner = await Partners.findOne({
      where: {
        id: params.id,
      },
    });
    if (req.body.vehicleId) {
      await partner?.update({
        vehicleId: req.body.vehicleId,
      });
    }
    if (req.body.helpers) {
      await PartnerHelpers.destroy({
        where: {
          partnerId: partner?.dataValues.id,
        },
      });
      const data: Array<{ partnerId: number; helperId: number }> = [];
      req.body.helpers.forEach((e) => {
        data.push({
          partnerId: partner?.dataValues.id,
          helperId: e,
        });
      });
      PartnerHelpers.bulkCreate(data);
    }
    return responseHandler({
      res,
      message: 'Update Partner Success!',
      data: partner,
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
  getPartner,
  storePartners,
  updatePartner,
};
