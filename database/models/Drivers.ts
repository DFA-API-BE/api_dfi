import { DataTypes } from 'sequelize';
import { dbConnection } from '../config/config';

//exmaple model
const Drivers = dbConnection.define('Drivers', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  DriverCode: {
    type: DataTypes.STRING,
  },
  Name: {
    type: DataTypes.STRING,
  },
  VehicleCode: {
    type: DataTypes.STRING,
  },
  HelperCode: {
    type: DataTypes.STRING,
  },
  SiteCode: {
    type: DataTypes.STRING,
  },
  IsActive: {
    type: DataTypes.INTEGER,
  },
});

export { Drivers };
