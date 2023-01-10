import { Request, Response } from 'express';
import { Op } from 'sequelize';
import {
  DeliveriesDetailProductRelation,
  DeliveriesDetailRelation,
  DeliveriesUserPickingRelations,
} from '../database/models/relations/delivery';
import { PaymentsRelation } from '../database/models/relations/Payment';
import { UserRequest } from '../domain/user';
import { responseHandler } from '../utils/responseHandler';
import { statusCodeRenderer } from '../utils/statusCodeRenderer';

const getTodayReport = async (
  req: Request & {
    user?: UserRequest;
  },
  res: Response,
) => {
  const TODAY_START = new Date().setHours(0, 0, 0, 0);
  const NOW = new Date();
  try {
    let totalNominal = 0;
    const totalCredit = 0;
    let totalTunai = 0;
    let totalRetur = 0;
    let totalGiro = 0;
    const totalIntensif = 0;
    let totalGap = 0;
    const reporting = await DeliveriesUserPickingRelations.findOne({
      where: {
        driverId: req.user?.id,
        createdAt: {
          [Op.gt]: TODAY_START,
          [Op.lt]: NOW,
        },
      },
      include: [
        {
          model: DeliveriesDetailRelation,
          include: [
            {
              model: DeliveriesDetailProductRelation,
            },
          ],
        },
      ],
    });
    let newReporting:any;
    if (reporting && reporting.dataValues.DeliveryDetails) {
      newReporting = await Promise.all(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        reporting.dataValues.DeliveryDetails.map(async (ship: any) => {
          const payment = await PaymentsRelation.findOne({
            where: {
              shipperNumber: ship.shipperNumber,
            },
          });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ship.DeliveryDetailProducts.forEach((product: any) => {
            totalGap += product.qtyActualAfterDelivery ?? 0;
          });
          delete ship.dataValues.DeliveryDetailProducts;
          // console.log('payment baru', payment);
          totalGiro += payment?.dataValues.giro;
          totalNominal += payment?.dataValues.grandTotal;
          totalRetur += payment?.dataValues.retur;
          totalTunai += payment?.dataValues.cash;
          return { ...ship.dataValues, payment: payment?.dataValues };
        }),
      );
      delete reporting.dataValues.DeliveryDetails;
    }else{
      newReporting = []
    }
    
    
    return responseHandler({
      res,
      statusCode: 200,
      message: 'Get Today Report',
      data: {
        delivery: reporting,
        deliveryDetail: newReporting,
        totalCustomer: newReporting ? newReporting.length : 0,
        totalCredit,
        totalGap,
        totalGiro,
        totalIntensif,
        totalNominal,
        totalRetur,
        totalTunai,
      },
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
