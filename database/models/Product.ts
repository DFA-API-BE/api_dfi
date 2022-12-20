import { DataTypes, Model } from 'sequelize';
import { dbConnection } from '../config/config';

class Products extends Model {}
Products.init(
  {
    ID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    ProductID: {
      type: DataTypes.INTEGER,
    },
    ProductCode: {
      type: DataTypes.STRING,
      allowNull: true,
      primaryKey: true,
    },
    Name: {
      type: DataTypes.STRING,
    },
    VendorID: {
      type: DataTypes.INTEGER,
    },
    SmallestUOM: {
      type: DataTypes.STRING
    },
    SmallestSellUOM: {
      type: DataTypes.STRING
    },
    BiggestUOM: {
      type: DataTypes.STRING
    },
    IsMedicine: {
      type: DataTypes.TINYINT
    }
  },
  {
    sequelize: dbConnection,
    modelName: 'Products',
  },
);

export { Products };
