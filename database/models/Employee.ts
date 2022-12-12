import { DataTypes, Model } from 'sequelize';
import { dbConnection } from '../config/config';
import { Users } from './Users';

export type EmployeeData = {
  code: string;
  siteCode: string;
  type: string;
  userId: number;
};
class Employees extends Model {}

Employees.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('Driver', 'Helper'),
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
  },
  {
    sequelize: dbConnection,
    modelName: 'Employees',
  },
);

Employees.belongsTo(Users, {
  foreignKey: 'userId',
  as: 'user', // this determines the name in `associations`!
});
export { Employees };
