import { Request, Response } from 'express';
import { Vehicles } from '../database/models/Vehicles';
import Joi from 'joi';
import { responseHandler } from '../utils/responseHandler';

type VehicleRequest = {
  code: string;
  siteCode: string;
};

const vehicleSchema = Joi.object().keys({
  code: Joi.string().required(),
  siteCode: Joi.string().required(),
});

const statusCodeRenderer = (status: string) => {
  switch (status) {
    case 'EREQUEST':
      return 400;
    default:
      return 500;
  }
};

const getVehicles = async (req: Request, res: Response) => {
  try {
    const data = await Vehicles.findAll();
    responseHandler({
      res,
      statusCode: 200,
      message: 'Get All Vehicles Success',
      data,
    });
  } catch (e:any) {
    responseHandler({
      res: res,
      statusCode: statusCodeRenderer(e.parent.code),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      message: e.errors.map((err: any) => {
        return `${err.value} is ${err.validatorKey}`;
      }),
    });
  }
};

const storeVehicles = async (
  req: Omit<Request, 'body'> & { body: VehicleRequest },
  res: Response,
) => {
  try {
    const name = 'yusuf';
    const validationVehicleSchema = vehicleSchema.validate(req.body);
    if (validationVehicleSchema.error) {
      responseHandler({
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

    responseHandler({
      res,
      message: 'Create Vehicle Success!',
      data: storeVehicle,
    });
  } catch (e: any) {
    responseHandler({
      res: res,
      statusCode: statusCodeRenderer(e.parent.code),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      message: e.errors.map((err: any) => {
        return `${err.value} is ${err.validatorKey}`;
      }),
    });
  }
};

const updateVehicles = async (
  req: Omit<Request, 'body'> & { body: VehicleRequest },
  res: Response,
) => {
  try {
    const name = 'yusuf';
    const id : string = req.params.id;
    const validationVehicleSchema = vehicleSchema.validate(req.body);
    if (validationVehicleSchema.error) {
      responseHandler({
        res,
        message: validationVehicleSchema.error.message,
        statusCode: 400,
      });
    }
    const vehicle = await Vehicles.findOne({
      where:{
        id:id
      }
    });
    if (vehicle === null) {
      responseHandler({
        res,
        statusCode: 404,
        message: 'vehicle not found',
      });
    }else {
     await vehicle.update({
        ...req.body,
        updatedBy:name
      });
      responseHandler({
        res,
        message: 'Update Vehicle Success!',
        data: vehicle,
      });
    }
   
  } catch (e: any) {
    responseHandler({
      res: res,
      statusCode: statusCodeRenderer(e.parent.code),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      message: e.errors.map((err: any) => {
        return `${err.value} is ${err.validatorKey}`;
      }),
    });
  }
};


const deleteVehicles = async (req:Request,res:Response) => {
  try {
    const id:string = req.params.id;
    const vehicle = await Vehicles.findOne({
      where:{
        id:id
      }
    });
    if (vehicle === null) {
      responseHandler({
        res,
        statusCode: 404,
        message: 'vehicle not found',
      });
    }else {
     await vehicle.destroy()
      responseHandler({
        res,
        message: 'Delete Vehicle Success!',
      });
    }
  } catch (e:any) {
    responseHandler({
      res: res,
      statusCode: statusCodeRenderer(e.parent.code),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      message: e.errors.map((err: any) => {
        return `${err.value} is ${err.validatorKey}`;
      }),
    });
  }
}
export default { getVehicles, storeVehicles,updateVehicles,deleteVehicles };
