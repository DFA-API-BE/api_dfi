import { DataTypes, Model } from 'sequelize';
import { dbConnection } from '../config/config';

class Deliveries extends Model {}
Deliveries.init(
  {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true,
    },
    pickingId: DataTypes.INTEGER,
    driverId: DataTypes.INTEGER,
    reasonId: DataTypes.INTEGER,
    deliveryNumber: DataTypes.INTEGER,
    deliveryDate: DataTypes.DATE,
    isLuarKota: DataTypes.INTEGER,
    createdBy: DataTypes.STRING,
    updatedBy: DataTypes.STRING,
  },
  {
    sequelize: dbConnection,
    modelName: 'Deliveries',
  },
);

export { Deliveries };
