import { DataTypes, Model } from 'sequelize';
import { dbConnection } from '../config/config';

class Deliveries extends Model {}
Deliveries.init(
  {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true,
    },
    pickingId: {
      type: DataTypes.STRING,
    },
    driverId: {
      type: DataTypes.INTEGER,
    },
    reasonId: {
      type: DataTypes.INTEGER,
    },
    deliveryNumber: {
      type: DataTypes.STRING,
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
    modelName: 'Deliveries',
  },
);

export { Deliveries };
