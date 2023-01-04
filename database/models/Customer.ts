import { DataTypes, Model } from 'sequelize';
import { dbConnection } from '../config/config';

class Customers extends Model {}

Customers.init(
  {
    customerCode: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    typeBussines: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.STRING,
    },
    categoryAddress: {
      type: DataTypes.STRING,
    },
    addressName: {
      type: DataTypes.STRING,
    },
    village: {
      type: DataTypes.STRING,
    },
    city: {
      type: DataTypes.STRING,
    },
    cityType: {
      type: DataTypes.STRING,
    },
    province: {
      type: DataTypes.STRING,
    },
    zipCode: {
      type: DataTypes.INTEGER,
    },
    isActive: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize: dbConnection,
    modelName: 'Customers',
  },
);

export { Customers };
