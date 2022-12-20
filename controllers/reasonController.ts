import { Request, Response } from 'express';
import { Reasons } from '../database/models/Reasons';
import { responseHandler } from '../utils/responseHandler';
import { statusCodeRenderer } from '../utils/statusCodeRenderer';


const getReasonList = async (req: Request, res: Response) => {
  try {
    const result = await Reasons.findAll();
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

export default {
  getReasonList
};
