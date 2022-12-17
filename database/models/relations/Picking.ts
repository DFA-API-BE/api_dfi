import { PickingDetails } from "../PickingDetail";
import { PickingDetailProducts } from "../PickingDetailProduct";
import { PickingLists } from "../PickingList";

PickingLists.hasMany(PickingDetails,{
  foreignKey:"pickingId",
  as:"pickingdetails"
});
PickingLists.hasMany(PickingDetailProducts,{
  foreignKey:"pickingId",
  as:"pickingdetailproducts"
});

PickingDetails.belongsTo(PickingLists,{
  foreignKey:"pickingId",
  as:"pickinglist"
});

PickingDetails.hasMany(PickingDetailProducts,{
  foreignKey:"pickingDetailId",
  as:"pickingdetailproducts"
});

