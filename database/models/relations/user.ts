import { Employees } from '../Employee';
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

export { Users as UsersRelation };
