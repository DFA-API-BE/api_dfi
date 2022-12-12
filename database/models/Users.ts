import { DataTypes, Model } from 'sequelize';
import { dbConnection } from '../config/config';

class Users extends Model<{
  id?: number;
  name: string;
  email: string;
  password: string;
  isActive: number;
  profilePic?: string;
}> {}

Users.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    profilePic: DataTypes.STRING,
  },
  {
    sequelize: dbConnection,
    modelName: 'Users',
  },
);

export { Users };
