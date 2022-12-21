import { Employees } from '../Employee';
import { Partners } from '../Partner';
import { PartnerHelpers } from '../PartnerHelper';
import { Users } from '../Users';

Users.hasMany(PartnerHelpers, {
  foreignKey: 'helperId',
  as: 'helpers',
});
Users.hasOne(Employees, {
  foreignKey: 'userId',
  as: 'employees',
});
Users.hasOne(Partners, {
  foreignKey: 'driverId',
  as: 'partners',
});

export { Users as UsersRelation };
