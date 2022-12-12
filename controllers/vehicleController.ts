import { Request, Response } from 'express';
import { Vehicles } from '../database/models/Vehicles';
// import Joi from 'joi';

// type VehicleRequest = {
//   code: string;
//   siteCode: string;
// };

// const vehicleSchema = Joi.object().keys({
//   code: Joi.string().required(),
//   siteCode: Joi.string().required(),
// });

const getVehicles = async (req: Request, res: Response) => {
  try {
    const data = await Vehicles.findAll();
    res.status(200).send(data);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

// const storeVehicles = async (
//   req: Omit<Request, 'body'> & { body: VehicleRequest },
//   res: Response,
// ) => {
//   try {
//   } catch (e) {}
// };

export default { getVehicles };
