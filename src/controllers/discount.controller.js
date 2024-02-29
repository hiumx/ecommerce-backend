const { SuccessResponse } = require("../core/success.response");
const { createNewDiscount, updateDiscount, getAllProductsWithDiscount, getAllDiscountsByShop } = require("../services/discount.service");

class DiscountController {
    async createNewDiscount(req, res, next) {
        new SuccessResponse({
            message: 'Create new discount success',
            metadata: await createNewDiscount({
                ...req.body,
                shopId: req.user.userId
            })
        }).send(res);
    }

    async updateDiscount(req, res, next) {
        new SuccessResponse({
            message: 'Update discount success',
            metadata: await updateDiscount({
                ...req.body,
                shopId: req.user.userId,
                discountId: req.params.discountId
            })
        }).send(res);
    }

    async getAllProductWithDiscountCode(req, res, next) {
        new SuccessResponse({
            message: 'Update discount success',
            metadata: await getAllProductsWithDiscount({
                shopId: req.user.userId,
                discountCode: req.params.discountCode
            })
        }).send(res);
    }

    async getAllDiscountsByShop(req, res, next) {
        new SuccessResponse({
            message: 'Get all discount by shop success',
            metadata: await getAllDiscountsByShop({
                shopId: req.user.userId
            })
        }).send(res);
    }
}

module.exports = new DiscountController();