import { DataTypes, Model } from 'sequelize';
import { dbConnection } from '../config/config';
// import { Vehicles } from './Vehicles';
// import { PartnerHelpers } from './PartnerHelper';
// import { Users } from './Users';

export type PartnerData = {
  driverId: number;
  vehicleId: number;
  partnerId: number;
  helpers: Array<any>;
};
class Partners extends Model {}

Partners.init(
  {
    driverId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    vehicleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize: dbConnection,
    modelName: 'Partners',
  },
);

// Partners.belongsTo(Users, {
//   foreignKey: 'driverId',
//   as: 'driver', // this determines the name in `associations`!
// });
// Partners.belongsTo(Vehicles, {
//   foreignKey: 'vehicleId',
//   as: 'vehicle', // this determines the name in `associations`!
// });
// Partners.hasMany(PartnerHelpers,{
//   foreignKey: 'partnerId',
//   as:'helpers'
// });
export { Partners };
