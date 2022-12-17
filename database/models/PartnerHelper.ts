import { DataTypes, Model } from 'sequelize';
import { dbConnection } from '../config/config';
// import { Partners } from './Partner';
// import { Users } from './Users';


class PartnerHelpers extends Model {}

PartnerHelpers.init(
  {
    partnerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    helperId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize: dbConnection,
    modelName: 'PartnerHelpers',
  },
);

// PartnerHelpers.belongsTo(Users, {
//   foreignKey: 'helperId',
//   as: 'helper', // this determines the name in `associations`!
// });
// PartnerHelpers.belongsTo(Partners, {
//   foreignKey: 'partnerId',
//   as: 'partner', // this determines the name in `associations`!
// });
export { PartnerHelpers };
