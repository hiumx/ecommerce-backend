'use strict';

const { BadRequestError, NotFoundError } = require('../core/error.response');
const discountModel = require('../models/discount.model');
const { convertToObjectIdMongoDb, removeUndefinedValue } = require('../utils');
const { findDiscount, getAllDiscountsByShop } = require('../models/repositories/discount.repo');
const { findAllProducts, findProduct } = require('../models/repositories/product.repo');


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
                select: ['product_name', 'product_price']
            })
        }

        if (foundDiscount.discount_applies_to === 'specific') {
            products = await findAllProducts({
                limit: +limit,
                page: +page,
                sort,
                filter: {
                    _id: { $in: foundDiscount.discount_product_ids.map(id => convertToObjectIdMongoDb(id)) },
                    isPublished: true
                },
                select: ['product_name', 'product_price']
            })
        }

        return {
            discountCode,
            shopId,
            products
        };
    }

    static async getAllDiscountsByShop({ shopId }) {
        return getAllDiscountsByShop({ shopId, unSelect: ['__v'] })
    }

    static async getDiscountAmount({ discountCode, shopId, userId, products }) {
        const foundDiscount = await findDiscount({ discountCode, shopId });

        if (!foundDiscount) throw new NotFoundError('Discount does not exist!');

        const {
            discount_is_active, discount_max_uses,
            discount_start_date, discount_end_date,
            discount_min_order_use, discount_max_uses_per_user,
            discount_users_used, discount_type, discount_value
        } = foundDiscount;

        if (!discount_is_active) throw new BadRequestError('Discount has expired!');
        if (!discount_max_uses) throw new BadRequestError('Discount are out!');

        // if (new Date() < new Date(discount_start_date) || new Date() > new Date(discount_end_date))
        //     throw new BadRequestError('Discount not start or expired!');

        // const productsFound = products.filter(product => findProduct({ query: { _id: product.productId } }))
        // console.log(productsFound);

        let totalOrder = 0;
        if (discount_min_order_use > 0) {
            totalOrder = products.reduce((acc, product) =>
                acc + (product.productQuantity * product.productPrice)
                , 0);

            if (totalOrder < discount_min_order_use)
                throw new BadRequestError(`Discount required minimum amount ${discount_min_order_use}`);
        }

        if (discount_max_uses_per_user > 0) {
            const foundUser = discount_users_used.filter(user => user.userId === userId);

            if (foundUser && foundUser.length === discount_max_uses_per_user)
                throw new BadRequestError('User used maximum per person');
        }

        const amount = discount_type === 'fixed amount' ? discount_value : totalOrder * (discount_value / 100);

        return {
            totalOrder,
            discountAmount: amount,
            totalPrice: totalOrder - amount
        }
    }

    static async deleteDiscount({ discountCode, shopId }) {
        return await discountModel.findOneAndDelete({
            discount_code: discountCode,
            discount_shopId: convertToObjectIdMongoDb(shopId)
        });
    }

    static async cancelDiscountByUser({ discountCode, shopId, userId }) {
        const foundDiscount = await findDiscount({ discountCode, shopId });

        if (!foundDiscount) throw new NotFoundError('Discount does not exits!');

        const result = await discountModel.findByIdAndUpdate(foundDiscount._id, {
            $pull: {
                discount_users_used: userId
            },
            $inc: {
                discount_max_uses: 1,
                discount_uses_count: -1
            }
        });
        return result;
    }

}

module.exports = DiscountService;