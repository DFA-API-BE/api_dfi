import { DataTypes, Model } from 'sequelize';
import { dbConnection } from '../config/config';


class PickingDetails extends Model {}

PickingDetails.init(
  {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true
    },
    pickingId: {
      type: DataTypes.INTEGER,
    },
    siteCode: {
      type: DataTypes.STRING,
    },
    vendorCode: {
      type: DataTypes.STRING,
    },
    shipperNumber: {
      type: DataTypes.STRING,
    },
    shipperDate: {
      type: DataTypes.DATE,
    },
    top: {
      type: DataTypes.INTEGER,
    },
    salesmanCode: {
      type: DataTypes.STRING,
    },
    customerCode: {
      type: DataTypes.STRING,
    },
    customerName: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.STRING,
    },
    village: {
      type: DataTypes.STRING,
    },
    cityType: {
      type: DataTypes.STRING,
    },
    city: {
      type: DataTypes.STRING,
    },
    province: {
      type: DataTypes.STRING,
    },
    zipCode: {
      type: DataTypes.STRING,
    },
    channelId: {
      type: DataTypes.INTEGER,
    },
    totalNetto: {
      type: DataTypes.DECIMAL(18, 2),
    },
    isCheck: {
      type: DataTypes.INTEGER,
    },
    createdBy: {
      type: DataTypes.STRING,
    },
    updatedBy: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize: dbConnection,
    modelName: 'PickingDetails',
  },
);

export { PickingDetails };
