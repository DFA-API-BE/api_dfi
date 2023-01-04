import { DataTypes, Model } from 'sequelize';
import { dbConnection } from '../config/config';

class ProductUOMs extends Model {}
ProductUOMs.init(
  {
    ID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    ProductID: {
      type: DataTypes.INTEGER,
    },
    ProductUOMID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    Qty:{
      type: DataTypes.INTEGER,
    },
    UOM: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize: dbConnection,
    modelName: 'productUOMs',
  },
);

export { ProductUOMs };
