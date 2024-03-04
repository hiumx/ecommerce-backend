
const { SuccessResponse } = require('../core/success.response');
const CartService = require('../services/cart.service');

class CartController {
    async addToCart(req, res, next) {
        new SuccessResponse({
            message: 'Add to cart success',
            metadata: await CartService.addToCart(req.body)
        }).send(res);
    }

    async updateToCart(req, res, next) {
        new SuccessResponse({
            message: 'Update cart success',
            metadata: await CartService.updateToCart(req.body)
        }).send(res);
    }

    async deleteToCart(req, res, next) {
        new SuccessResponse({
            message: 'Delete product in cart success',
            metadata: await CartService.deleteToCart(req.body)
        }).send(res);
    }

    async listToCart(req, res, next) {
        new SuccessResponse({
            message: 'List product in cart success',
            metadata: await CartService.listToCart(req.body)
        }).send(res);
    }

}

module.exports = new CartController();