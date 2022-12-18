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
    const result: Array<{
      Id: number;
      village: string;
      countVillage: number;
    }> = await dbConnection.query(
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
    
    const newArray = data.map((pl)=>{
      const villageList = result.filter(v => v.Id === pl.dataValues.id)
      return ({
        ...pl.dataValues,
        village: villageList
      })
    })

    return responseHandler({
      res,
      statusCode: 200,
      message: 'Get Picking List',
      data: newArray,
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
