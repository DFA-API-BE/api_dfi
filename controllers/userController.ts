import { Request, Response } from 'express';
import { Users } from '../database/models/Users';
import { UserRequest } from '../domain/user';
import { responseHandler } from '../utils/responseHandler';
import { statusCodeRenderer } from '../utils/statusCodeRenderer';
import { PartnersRelation, VehiclePartnerRelation } from '../database/models/relations/partner';
import { PartnerHelpers } from '../database/models/PartnerHelper';
import { UsersRelation } from '../database/models/relations/user';

const getUser = async (
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
    
    const user = await Users.findOne({
      where: {
        id:id,
      },
      attributes: { exclude: ['password'] },
      include: [
        {
          model: PartnersRelation,
          as: 'partners',
          include: [
            {
              model:  VehiclePartnerRelation,
              as: 'vehicle'
            },
            {
              model: PartnerHelpers,
              as: 'helpers',
              include: [
                {
                  model: UsersRelation,
                  as: 'helper',
                  attributes: { exclude: ['password'] },
                }
              ]
            }
          ]
        }
      ]
    });

    return responseHandler({
      res,
      message: 'Detail User Success!',
      data: user,
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    return responseHandler({
      res: res,
      statusCode: statusCodeRenderer(e.parent?.code ?? 'EREQUEST'),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      message: e.message
    });
  }
};

export default { getUser };
