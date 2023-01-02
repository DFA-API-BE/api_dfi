import { DataTypes, Model } from 'sequelize';
import { dbConnection } from '../config/config';

export type PartnerPickingAuthorizedData = {
  pickingListId: Array<number>;
  image: string;
  partnerId: number;
  checkerId: number;
  checkerAuthorizationAt: string;
  driverAuthorizationAt: string;
};

class PartnerPickingListAuthorizeds extends Model {}

PartnerPickingListAuthorizeds.init(
  {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true,
    },
    pickingListId: {
      type: DataTypes.INTEGER,
    },
    driverId: {
      type: DataTypes.INTEGER,
    },
    checkerId: {
      type: DataTypes.INTEGER,
    },
    isAuthorization: {
      type: DataTypes.INTEGER,
    },
    image: {
      type: DataTypes.STRING,
    },
    checkerAuthorizationAt: {
      type: DataTypes.DATE,
    },
    driverAuthorizationAt: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize: dbConnection,
    modelName: 'PartnerPickingListAuthorizeds',
  },
);

export { PartnerPickingListAuthorizeds };
