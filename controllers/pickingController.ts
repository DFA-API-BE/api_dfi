import { Request, Response } from 'express';
import {
  PickingDetailsRelation,
  PickingListRelation,
} from '../database/models/relations/Picking';
import { responseHandler } from '../utils/responseHandler';
import { statusCodeRenderer } from '../utils/statusCodeRenderer';
import moment from 'moment-timezone';
import { Op, QueryTypes } from 'sequelize';
import { PickingDetailProducts } from '../database/models/PickingDetailProduct';
import { dbConnection } from '../database/config/config';

const getPickingLists = async (req: Request, res: Response) => {
  try {
    const data = await PickingListRelation.findAll({
      where: {
        pickingDate: {
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
    const result: any = await dbConnection.query(
      `
    select pickingLists.Id, pickingDetails.village, COUNT(pickingDetails.village) as countVillage from pickingLists 
    join pickingDetails 
    on pickingLists.id =pickingDetails.pickingId
    GROUP BY pickingLists.Id , pickingDetails.village
    order by pickingLists.Id ASC`,
      {
        type: QueryTypes.SELECT,
      },
    );

    // const newArray = data
    //   .filter((el: any) => result.some((f: any) => f.Id === el.id))
    //   .map((item: any) => ({
    //     ...item,
    //     village: result.find((f: any) => f.Id === item.id),
    //   }));
    data.reduce((acc: any, curr: any) => {
      const item = result.find((f: any) => f.Id === curr.id);

      const village: Array<any> = [];
      if (item) {
        village.push(item);

        acc.push({
          ...curr,
          village: village,
        });
      }
      return acc;
    }, []);
    // console.log(data);

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
      message: e.message,
    });
  }
};

export default { getPickingLists };
