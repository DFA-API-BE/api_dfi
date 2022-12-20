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
    deliveryId: {
      type: DataTypes.INTEGER,
    },
    customerCode: {
      type: DataTypes.STRING,
    },
    salesmanCode: {
      type: DataTypes.STRING,
    },
    shipperNumber: {
      type: DataTypes.STRING,
    },
    paymentNumber: {
      type: DataTypes.STRING,
    },
    shipperDate: {
      type: DataTypes.STRING,
    },
    driverIdAuthorized: {
      type: DataTypes.INTEGER,
    },
    checkerIdAuthorized: {
      type: DataTypes.INTEGER,
    },
    isSent: {
      type: DataTypes.INTEGER,
    },
    claim: {
      type: DataTypes.INTEGER,
    },
    tunai: {
      type: DataTypes.INTEGER,
    },
    isLunas: {
      type: DataTypes.INTEGER,
    },
    sequence: {
      type: DataTypes.INTEGER,
    },
    reasonId: {
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
