const { convertToObjectIdMongoDb, getDataUnSelect } = require("../../utils");
const discountModel = require("../discount.model");

const findDiscount = async ({ discountCode, shopId }) => await discountModel.findOne({
    discount_code: discountCode,
    discount_shopId: convertToObjectIdMongoDb(shopId)
}).lean();

const getAllDiscountsByShop = async ({ shopId, unSelect, page = 1, limit = 50 }) => {
    const skip = (page - 1) * limit;
    return await discountModel.find({
        discount_shopId: convertToObjectIdMongoDb(shopId),
        discount_is_active: true
    })
    .limit(limit)
    .skip(skip)
    .select(getDataUnSelect(unSelect))
    .lean();
} 

    

module.exports = {
    findDiscount,
    getAllDiscountsByShop
}