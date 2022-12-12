import { DataTypes, Model } from 'sequelize';
import { dbConnection } from '../config/config';

class Vehicles extends Model {}

Vehicles.init({
  code: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  siteCode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdBy: {
    type: DataTypes.STRING,
  },
  updatedBy: {
    type: DataTypes.STRING,
  },
  isActive: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
},{
  sequelize: dbConnection,
  modelName: 'Vehicles'
})

export { Vehicles };
