import { Customers } from "../Customer";
import { Deliveries } from "../Deliveries";
import { DeliveryDetailProducts } from "../DeliveryDetailProducts";
import { DeliveryDetails } from "../DeliveryDetails";
import { PickingLists } from "../PickingList";
import { Products } from "../Product";
import { ProductPriceCurrents } from "../ProductPrices";
import { ProductUOMs } from "../ProductUOM";
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
Deliveries.belongsTo(Reasons,{
    foreignKey: 'reasonId'
})
Reasons.hasMany(Deliveries,{
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

//product uom price
Products.hasMany(ProductUOMs,{
    sourceKey: 'ProductID',
    foreignKey: 'ProductID',
})
ProductUOMs.belongsTo(Products,{
    foreignKey: 'ProductID',
    targetKey: 'ProductID',
})
ProductUOMs.hasMany(ProductPriceCurrents,{
    foreignKey: 'ProductUOMID'
})
ProductPriceCurrents.belongsTo(ProductUOMs,{
    foreignKey: 'ProductUOMID'
})

//customer detaildelivery
Customers.hasMany(DeliveryDetails,{
    sourceKey: 'customerCode',
    foreignKey: 'customerCode'
})
DeliveryDetails.belongsTo(Customers,{
    foreignKey: 'customerCode',
    targetKey: 'customerCode'
})
export {
    Deliveries as DeliveriesUserPickingRelations, 
    DeliveryDetails as DeliveriesDetailRelation, 
    DeliveryDetailProducts as DeliveriesDetailProductRelation, 
    Products as ProductDeliveryDetailRelation,
    Reasons as ReasonDeliveryRelation,
    ProductUOMs as ProductUOMRelation,
    ProductPriceCurrents as ProductPriceCurrentRelation,
    Customers as CustomerDeliveryRelation
}