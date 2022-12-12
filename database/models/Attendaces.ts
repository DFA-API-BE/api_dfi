import { DataTypes, Model } from 'sequelize';
import { dbConnection } from '../config/config';
import { Users } from './Users';

export type AttendancesData = {
  userId: number,
  time: Date,
  photoUrl: string,
  lat: string,
  long: string,
  isArrival: boolean
}

class Attendances extends Model<AttendancesData> {}

Attendances.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    photoUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lat: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    long: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isArrival: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    sequelize: dbConnection,
    modelName: 'Attendances',
  },
);

Attendances.belongsTo(Users, {
  foreignKey: 'userId',
  as: 'user', // this determines the name in `associations`!
});
export { Attendances };
