import { PartnerPickingListAuthorizeds } from '../PartnerPickingListAuthorized';
import { PickingLists } from '../PickingList';
import { Users } from '../Users';

PartnerPickingListAuthorizeds.belongsTo(Users, {
  foreignKey: 'driverId',
  as: 'driver',
});
PartnerPickingListAuthorizeds.belongsTo(PickingLists, {
  foreignKey: 'pickingListId',
  as: 'picking_list',
});
export {PartnerPickingListAuthorizeds as PartnerPickingListAuthorizedsRelation}
