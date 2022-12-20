import { DataTypes, Model } from 'sequelize';
import { dbConnection } from '../config/config';

class DeliveryDetailProducts extends Model {}
DeliveryDetailProducts.init(
  {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true,
    },
    deliveryDetailId: {
      type: DataTypes.INTEGER,
    },
    deliveryId: {
      type: DataTypes.INTEGER,
    },
    productCode: {
      type: DataTypes.STRING,
    },
    qtyAfterCheck: {
      type: DataTypes.INTEGER,
    },
    qtyTerima: {
      type: DataTypes.INTEGER,
    },
    qtyPartial: {
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
    modelName: 'DeliveryDetailProducts',
  },
);

export { DeliveryDetailProducts };
