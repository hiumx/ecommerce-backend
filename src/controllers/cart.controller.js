
const { SuccessResponse } = require('../core/success.response');
const { addToCart, updateToCart, deleteToCart, listToCart } = require('../services/cart.service');

class CartController {
    async addToCart(req, res, next) {
        new SuccessResponse({
            message: 'Add to cart success',
            metadata: await addToCart(req.body)
        }).send(res);
    }

    async updateToCart(req, res, next) {
        new SuccessResponse({
            message: 'Update cart success',
            metadata: await updateToCart(req.body)
        }).send(res);
    }

    async deleteToCart(req, res, next) {
        new SuccessResponse({
            message: 'Delete product in cart success',
            metadata: await deleteToCart(req.body)
        }).send(res);
    }

    async listToCart(req, res, next) {
        new SuccessResponse({
            message: 'List product in cart success',
            metadata: await listToCart(req.body)
        }).send(res);
    }

}

module.exports = new CartController();