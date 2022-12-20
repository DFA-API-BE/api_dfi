import { DataTypes, Model } from 'sequelize';
import { dbConnection } from '../config/config';

export type ReasonsData = {
  id: number,
  name: string,
}

class Reasons extends Model<ReasonsData> {}

Reasons.init(
  {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  },
  {
    sequelize: dbConnection,
    modelName: 'Reasons',
  },
);
export { Reasons };
