const { convertToObjectIdMongoDb } = require("../../utils");
const discountModel = require("../discount.model");

const findDiscount = async ({ discountCode, shopId }) => await discountModel.findOne({
    discount_code: discountCode,
    discount_shopId: convertToObjectIdMongoDb(shopId)
}).lean();

const getAllDiscountsByShop = async ({ shopId }) => await discountModel.find({
    discount_shopId: convertToObjectIdMongoDb(shopId),
    discount_is_active: true
}).lean();

module.exports = {
    findDiscount,
    getAllDiscountsByShop
}