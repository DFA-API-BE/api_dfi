import { Sequelize } from 'sequelize';
import * as dotenv from 'dotenv';

dotenv.config();

const host = process.env.DB_HOST || '';
const username = process.env.DB_USER || '';
const password = process.env.DB_PASSWORD || '';
const dbName = process.env.DB_NAME || '';
const dbPort = process.env.DB_PORT || '';

const sequelize = new Sequelize(dbName, username, password, {
  dialect: 'mssql',
  host: host,
  port: parseInt(dbPort),
  dialectOptions: {
    // Observe the need for this nested `options` field for MSSQL
    options: {
      // Your tedious options here
      useUTC: false,
      dateFirst: 1,
    },
  },
  
});

export { sequelize as dbConnection };
