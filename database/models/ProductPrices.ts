import { DataTypes, Model } from 'sequelize';
import { dbConnection } from '../config/config';

class ProductPriceCurrents extends Model {}
ProductPriceCurrents.init(
  {
    ID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    ProductPriceID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    ChannelID: {
      type: DataTypes.INTEGER,
    },
    ProductUOMID: {
      type: DataTypes.INTEGER,
    },
    Price:{
      type: DataTypes.INTEGER
    },
    Tax:{
      type: DataTypes.INTEGER
    },
  },
  {
    sequelize: dbConnection,
    modelName: 'productPriceCurrents',
  },
);

export { ProductPriceCurrents };
