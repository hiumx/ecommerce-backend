const { BadRequestError, NotFoundError } = require('../core/error.response');
const discountModel = require('../models/discount.model');
const { convertToObjectIdMongoDb, removeUndefinedValue } = require('../utils');
const { findDiscount, getAllDiscountsByShop } = require('../models/repositories/discount.repo');
const { findAllProducts } = require('../models/repositories/product.repo');


class DiscountService {

    static async createNewDiscount(payload) {
        const {
            name, description, type, value, code, startDate, endDate,
            maxUses, usesCount, userUsed, maxUsesPerUser, minOrderUse, shopId,
            isActive, appliesTo, productIds
        } = payload;

        if (new Date() < startDate || new Date() > endDate)
            throw new BadRequestError('Time of discount invalid!');

        const foundDiscount = await findDiscount({ code, shopId });

        if (foundDiscount) throw new BadRequestError('Discount existed!');

        const newDiscount = await discountModel.create({
            discount_name: name,
            discount_description: description,
            discount_type: type,
            discount_value: value,
            discount_code: code,
            discount_start_date: new Date(startDate),
            discount_end_date: new Date(endDate),
            discount_max_uses: maxUses,
            discount_uses_count: usesCount,
            discount_users_used: userUsed,
            discount_max_uses_per_user: maxUsesPerUser,
            discount_min_order_use: minOrderUse || 0,
            discount_shopId: shopId,
            discount_is_active: isActive,
            discount_applies_to: appliesTo,
            discount_product_ids: appliesTo === 'all' ? [] : productIds,
        });

        return newDiscount;
    }

    static async updateDiscount(bodyUpdate) {
        const { discountId, shopId } = bodyUpdate;

        const query = {
            _id: convertToObjectIdMongoDb(discountId),
            discount_shopId: convertToObjectIdMongoDb(shopId)
        };

        return await discountModel.findOneAndUpdate(query, removeUndefinedValue(bodyUpdate), { new: true }).lean();
    }

    static async getAllProductsWithDiscount({ discountCode, shopId, page = 1, limit = 50, sort = 'ctime' }) {

        const foundDiscount = await findDiscount({ discountCode, shopId });

        if (!foundDiscount) throw new NotFoundError('Discount not found');

        let products = [];
        if (foundDiscount.discount_applies_to === 'all') {
            products = await findAllProducts({
                limit: +limit,
                page: +page,
                sort,
                filter: {
                    product_shop: convertToObjectIdMongoDb(shopId),
                    isPublished: true
                },
                select: ['product_name']
            })
        }

        if (foundDiscount.discount_applies_to === 'specific') {
            products = await findAllProducts({
                limit: +limit,
                page: +page,
                sort,
                filter: {
                    _id: { $in: foundDiscount.discount_product_ids },
                    isPublished: true
                },
                select: ['product_name']
            })
        }

        return products;
    }

    static async getAllDiscountsByShop({ shopId }) {
        return getAllDiscountsByShop({ shopId })
    }

}

module.exports = DiscountService;