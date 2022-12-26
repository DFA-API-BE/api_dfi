import { DataTypes, Model } from 'sequelize';
import { dbConnection } from '../config/config';

export type DeliveryAuthorizedData = {
  deliveryId: number;
  driverId: number;
  checkerId: number;
  checkerAuthorizationAt: string;
  driverAuthorizationAt: string;
};

class DeliveryAuthorizeds extends Model {}
DeliveryAuthorizeds.init(
  {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true,
    },
    deliveryId: {
      type: DataTypes.INTEGER,
    },
    driverId: {
      type: DataTypes.INTEGER,
    },
    checkerId: {
      type: DataTypes.INTEGER,
    },
    checkerAuthorizationAt: {
      type: DataTypes.DATE,
    },
    driverAuthorizationAt: {
      type: DataTypes.DATE,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  },
  {
    sequelize: dbConnection,
    modelName: 'DeliveryAuthorizeds',
  },
);

export { DeliveryAuthorizeds };
