import { Request, Response } from 'express';
import { responseHandler } from '../utils/responseHandler';
import { statusCodeRenderer } from '../utils/statusCodeRenderer';


const getTodayReport = async (req: Request, res: Response) => {
  try {
   

    return responseHandler({
      res,
      statusCode: 200,
      message: 'Get Today Report',
      data: [],
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

export default { getTodayReport };
