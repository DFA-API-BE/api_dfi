import { DataTypes, Model } from 'sequelize';
import { dbConnection } from '../config/config';

class PickingLists extends Model {}

PickingLists.init(
  {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true
    },
    pickingNumber: {
      type: DataTypes.STRING,
      unique: true,
    },
    pickingDate: {
      type: DataTypes.DATE,
    },
    siteId: {
      type: DataTypes.INTEGER,
    },
    siteCode: {
      type: DataTypes.STRING,
    },
    siteName: {
      type: DataTypes.STRING,
    },
    vendorId: {
      type: DataTypes.INTEGER,
    },
    vendorName: {
      type: DataTypes.STRING,
    },
    vendorCode: {
      type: DataTypes.STRING,
    },
    groupVendorId: {
      type: DataTypes.INTEGER,
    },
    warehouseFromId: {
      type: DataTypes.INTEGER,
    },
    warehouseFromCode: {
      type: DataTypes.STRING,
    },
    warehouseToId: {
      type: DataTypes.INTEGER,
    },
    warehouseToCode: {
      type: DataTypes.STRING,
    },
    imageListAuthorized: {
      type: DataTypes.STRING,
    },
    isAssign: {
      type: DataTypes.INTEGER,
    },
    pickerId: {
      type: DataTypes.INTEGER,
    },
    driverId: {
      type: DataTypes.INTEGER,
    },
    helerpId: {
      type: DataTypes.INTEGER,
    },
    kubikasi: {
      type: DataTypes.DECIMAL(18, 2),
    },
    tonase: {
      type: DataTypes.DECIMAL(18, 2),
    },
    stockMoveId: {
      type: DataTypes.INTEGER,
    },
    interBranchId: {
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
    modelName: 'PickingLists',
  },
);

export { PickingLists };
