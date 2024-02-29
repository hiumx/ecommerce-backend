const { SuccessResponse } = require("../core/success.response");
const { createNewDiscount, updateDiscount, getAllProductsWithDiscount, getAllDiscountsByShop, getDiscountAmount, deleteDiscount, cancelDiscountByUser } = require("../services/discount.service");

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
            message: 'Get all product with discount code success',
            metadata: await getAllProductsWithDiscount({
                shopId: req.query.shop,
                discountCode: req.query.code
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

    async getDiscountAmount(req, res, next) {
        new SuccessResponse({
            message: 'Get discount amount success',
            metadata: await getDiscountAmount({
                ...req.body
            })
        }).send(res);
    }

    async cancelDiscountByUser(req, res, next) {
        new SuccessResponse({
            message: 'Get all discount by shop success',
            metadata: await cancelDiscountByUser(req.body)
        }).send(res);
    }

    async deleteDiscount(req, res, next) {
        new SuccessResponse({
            message: 'Delete discount success',
            metadata: await deleteDiscount(req.body)
        }).send(res);
    }
}

module.exports = new DiscountController();