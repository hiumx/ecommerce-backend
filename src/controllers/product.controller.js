// const ProductService = require('../services/product.service');
const ProductServiceV2 = require('../services/product.service.xxx');
const { SuccessResponse } = require('../core/success.response');

class ProductController {

    async createProduct(req, res, next) {
        new SuccessResponse({
            message: 'Create new product success',
            metadata:  await ProductServiceV2.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user.userId
            })
        }).send(res);
    }
}

module.exports = new ProductController();

