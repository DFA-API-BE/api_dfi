import { Partners } from "../Partner";
import { PartnerHelpers } from "../PartnerHelper";
import { Users } from "../Users";

PartnerHelpers.belongsTo(Users, {
  foreignKey: 'helperId',
  as: 'helper', // this determines the name in `associations`!
});
PartnerHelpers.belongsTo(Partners, {
  foreignKey: 'partnerId',
  as: 'partner', // this determines the name in `associations`!
});

export {PartnerHelpers as PartnerHelperRelation}