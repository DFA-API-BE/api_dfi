import { DataTypes, Model } from 'sequelize';
import { dbConnection } from '../config/config';

class DeliveryDetails extends Model {}
DeliveryDetails.init(
  {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true,
    },
    pickingId: {
      type: DataTypes.INTEGER,
    },
    driverId: {
      type: DataTypes.INTEGER,
    },
    reasonId: {
      type: DataTypes.INTEGER,
    },
    deliveryNumber: {
      type: DataTypes.INTEGER,
    },
    createdBy: {
      type: DataTypes.STRING,
    },
    updatedBy: {
      type: DataTypes.STRING,
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
    modelName: 'DeliveryDetails',
  },
);

export { DeliveryDetails };
