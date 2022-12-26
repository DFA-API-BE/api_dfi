import { Deliveries } from '../Deliveries';
import { DeliveryAuthorizeds } from '../DeliveryAuthorized';
import { Users } from '../Users';

DeliveryAuthorizeds.belongsTo(Users, {
  foreignKey: 'driverId',
  as: 'driver',
});

DeliveryAuthorizeds.belongsTo(Deliveries, {
  foreignKey: 'deliveryId',
  as: 'delivery',
});

export { DeliveryAuthorizeds as DeliveryAuthorizedsRelation };
