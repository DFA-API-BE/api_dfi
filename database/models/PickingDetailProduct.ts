import { DataTypes, Model } from 'sequelize';
import { dbConnection } from '../config/config';

export type PickingDetailProductData = {
  productName: string,
  UOMSmallestSell: string,
  isiKoliSmallestSell: number,
  qtySmallReal: number,
  qtyBig: number,
  qtySmall: number,
}
class PickingDetailProducts extends Model {}

PickingDetailProducts.init(
  {
    pickingId: {
      type: DataTypes.INTEGER,
    },
    pickingDetailId: {
      type: DataTypes.INTEGER,
    },
    siteCode: {
      type: DataTypes.STRING,
    },
    vendorCode: {
      type: DataTypes.STRING,
    },
    productCode: {
      type: DataTypes.STRING,
    },
    productName: {
      type: DataTypes.STRING,
    },
    UOMSmallestSell: {
      type: DataTypes.STRING,
    },
    isiKoliSmallestSell: {
      type: DataTypes.INTEGER,
    },
    qtySmallReal: {
      type: DataTypes.INTEGER,
    },
    qtyBig: {
      type: DataTypes.INTEGER,
    },
    qtySmall: {
      type: DataTypes.INTEGER,
    },
    isActive: {
      type: DataTypes.INTEGER,
    },
    reasonID: {
      type: DataTypes.INTEGER,
    },
    Sequence: {
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
    modelName: 'PickingDetailProducts',
  },
);

export { PickingDetailProducts };
