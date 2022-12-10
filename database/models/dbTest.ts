import { DataTypes } from 'sequelize';
import { dbConnection } from '../config/config';

//exmaple model
const dbTest = dbConnection.define('_dbtest', {
  ID: {
    type: DataTypes.INTEGER,
  },
  Name: {
    type: DataTypes.STRING,
  },
});

export { dbTest };
