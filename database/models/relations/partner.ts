import { Partners } from "../Partner";
import { PartnerHelpers } from "../PartnerHelper";
import { Users } from "../Users";
import { Vehicles } from "../Vehicles";

Partners.belongsTo(Users, {
  foreignKey: 'driverId',
  as: 'driver', // this determines the name in `associations`!
});
Partners.belongsTo(Vehicles, {
  foreignKey: 'vehicleId',
  as: 'vehicle', // this determines the name in `associations`!
});
Partners.hasMany(PartnerHelpers,{
  foreignKey: 'partnerId',
  as:'helpers'
});


export {Partners as PartnersRelation}