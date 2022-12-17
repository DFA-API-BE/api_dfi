import { Request, Response } from 'express';
import { Vehicles, VehicleData } from '../database/models/Vehicles';
import Joi from 'joi';
import { UserRequest } from '../domain/user';
import { responseHandler } from '../utils/responseHandler';
import { statusCodeRenderer } from '../utils/statusCodeRenderer';

const vehicleSchema = Joi.object().keys({
  code: Joi.string().required(),
  siteCode: Joi.string().required(),
});
const updateParamsschema = Joi.object().keys({
  id: Joi.number().required()
})

const getVehicles = async (req: Request, res: Response) => {
  try {
    const data = await Vehicles.findAll();
    return responseHandler({
      res,
      statusCode: 200,
      message: 'Get All Vehicles Success',
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

const storeVehicles = async (
  req: Omit<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Request<never, never, VehicleData, never, Record<string, any>>,
    'user'
  > & {
    user?: UserRequest;
  },
  res: Response,
) => {
  try {
    const { name } = req.user as UserRequest;
    const validationVehicleSchema = vehicleSchema.validate(req.body);
    if (validationVehicleSchema.error) {
      return responseHandler({
        res,
        message: validationVehicleSchema.error.message,
        statusCode: 400,
      });
    }
    const storeVehicle = await Vehicles.create({
      ...req.body,
      createdBy: name,
      isActive: 1,
    });

    return responseHandler({
      res,
      message: 'Create Vehicle Success!',
      data: storeVehicle,
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

const updateVehicles = async (
  req: Omit<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Request<{ id: string }, never, VehicleData, never, Record<string, any>>,
    'user'
  > & {
    user?: UserRequest;
  },
  res: Response,
) => {
  try {
    const { name } = req.user as UserRequest;
    const params = {
      id: parseInt(req.params.id)
    }
    const validationVehicleSchema = vehicleSchema.validate(req.body);
    if (validationVehicleSchema.error) {
      return responseHandler({
        res,
        message: validationVehicleSchema.error.message,
        statusCode: 400,
      });
    }
    const validationUpdateParams = updateParamsschema.validate(params);
    if(validationUpdateParams.error){
      return responseHandler({
        res,
        message: validationUpdateParams.error.message,
        statusCode: 400
      })
    }
    const vehicle = await Vehicles.findOne({
      where: {
        id: params.id,
      },
    });
    if (vehicle === null) {
      return responseHandler({
        res,
        statusCode: 404,
        message: 'vehicle not found',
      });
    } else {
      await vehicle.update({
        ...req.body,
        updatedBy: name,
      });
      return responseHandler({
        res,
        message: 'Update Vehicle Success!',
        data: vehicle,
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

const deleteVehicles = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    const vehicle = await Vehicles.findOne({
      where: {
        id: id,
      },
    });
    if (vehicle === null) {
      return responseHandler({
        res,
        statusCode: 404,
        message: 'vehicle not found',
      });
    } else {
      await vehicle.destroy();
      return responseHandler({
        res,
        message: 'Delete Vehicle Success!',
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
export default { getVehicles, storeVehicles, updateVehicles, deleteVehicles };
