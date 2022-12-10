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

const openConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

openConnection();

export { sequelize as dbConnection, openConnection };
