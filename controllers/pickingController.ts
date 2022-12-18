import { Request, Response } from 'express';
import {
  PickingDetailsRelation,
  PickingListRelation,
} from '../database/models/relations/Picking';
import { responseHandler } from '../utils/responseHandler';
import { statusCodeRenderer } from '../utils/statusCodeRenderer';
import moment from 'moment-timezone';
import { Op } from 'sequelize';
import {
  PickingDetailProducts,
} from '../database/models/PickingDetailProduct';

const getPickingLists = async (req: Request, res: Response) => {
  try {
    const data = await PickingListRelation.findAll({
      where: {
        created_at: {
          [Op.gte]: moment().tz('Asia/Jakarta').startOf('day'),
          [Op.lte]: moment().tz('Asia/Jakarta').endOf('day'),
        },
      },
      include: [
        {
          model: PickingDetailsRelation,
          as: 'pickingdetails',
        },
        {
          model: PickingDetailProducts,
          as: 'pickingdetailproducts',
        },
      ],
    });
    return responseHandler({
      res,
      statusCode: 200,
      message: 'Get Picking List',
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


export default { getPickingLists };
