import { PartnerPickingListAuthorizeds } from '../PartnerPickingListAuthorized';
import { Users } from '../Users';

PartnerPickingListAuthorizeds.belongsTo(Users, {
  foreignKey: 'driverId',
  as: 'driver',
});

export {PartnerPickingListAuthorizeds as PartnerPickingListAuthorizedsRelation}
