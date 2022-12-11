import { DataTypes, Model } from 'sequelize';
import { dbConnection } from '../config/config';

class Users extends Model {}

Users.init({
  name: DataTypes.STRING,
  email: DataTypes.STRING,
  password: DataTypes.STRING,
  isActive: DataTypes.STRING,
  profilePic: DataTypes.STRING
},{
  sequelize: dbConnection,
  modelName: 'Users'
})

export { Users };
