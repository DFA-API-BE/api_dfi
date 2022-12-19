import { Deliveries } from "../Deliveries";
import { DeliveryDetailProducts } from "../DeliveryDetailProducts";
import { DeliveryDetails } from "../DeliveryDetails";
import { PickingLists } from "../PickingList";
import { Users } from "../Users";

//DeliveriesUserPickingRelations
Deliveries.hasMany(DeliveryDetails,{
    foreignKey: 'deliveryId'
})
Deliveries.hasMany(DeliveryDetailProducts,{
    foreignKey: 'deliveryId'
})
Deliveries.belongsTo(Users,{
    foreignKey: 'driverId'
})
Deliveries.belongsTo(PickingLists, {
    foreignKey: 'pickingId'
})
PickingLists.hasOne(Deliveries, {
    foreignKey: 'pickingId'
})
Users.hasMany(Deliveries, {
    foreignKey: 'driverId'
})

//DeliveriesDetailRelation
DeliveryDetails.belongsTo(Deliveries,{
    foreignKey: 'deliveryId'
})
DeliveryDetails.hasMany(DeliveryDetailProducts, {
    foreignKey: 'deliveryDetailId'
})
//DeliveriesDetailProductRelation
DeliveryDetailProducts.belongsTo(Deliveries,{
    foreignKey: 'deliveryId'
})
DeliveryDetailProducts.belongsTo(DeliveryDetails,{
    foreignKey: 'deliveryDetailid'
})

export {Deliveries as DeliveriesUserPickingRelations, DeliveryDetails as DeliveriesDetailRelation, DeliveryDetailProducts as DeliveriesDetailProductRelation }