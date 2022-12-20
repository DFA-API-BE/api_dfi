import { Deliveries } from "../Deliveries";
import { DeliveryDetailProducts } from "../DeliveryDetailProducts";
import { DeliveryDetails } from "../DeliveryDetails";
import { PickingLists } from "../PickingList";
import { Products } from "../Product";
import { Reasons } from "../Reasons";
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
PickingLists.belongsTo(Reasons,{
    foreignKey: 'reasonId'
})
Reasons.hasMany(PickingLists,{
    foreignKey: 'reasonId'
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
DeliveryDetails.belongsTo(Reasons,{
    foreignKey: 'reasonId'
})
Reasons.hasMany(DeliveryDetails,{
    foreignKey: 'reasonId'
})
//DeliveriesDetailProductRelation
DeliveryDetailProducts.belongsTo(Deliveries,{
    foreignKey: 'deliveryId'
})
DeliveryDetailProducts.belongsTo(DeliveryDetails,{
    foreignKey: 'deliveryDetailid'
})
DeliveryDetailProducts.belongsTo(Products,{
    foreignKey: 'productCode'
})
Products.hasMany(DeliveryDetailProducts,{
    foreignKey: 'productCode'
})
DeliveryDetailProducts.belongsTo(Reasons,{
    foreignKey: 'reasonId'
})
Reasons.hasMany(DeliveryDetailProducts,{
    foreignKey: 'reasonId'
})
export {
    Deliveries as DeliveriesUserPickingRelations, 
    DeliveryDetails as DeliveriesDetailRelation, 
    DeliveryDetailProducts as DeliveriesDetailProductRelation, 
    Products as ProductDeliveryDetailRelation,
    Reasons as ReasonDeliveryRelation
}