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

    async getAllDraftProductByShop(req, res, next) {
        new SuccessResponse({
            message: 'Get list draft product success',
            metadata: await ProductServiceV2.findAllDraftProductByShop({
                product_shop: req.user.userId
            })
        }).send(res)
    }

    async getAllPublishedProductByShop(req, res, next) {
        new SuccessResponse({
            message: 'Get list published product success',
            metadata: await ProductServiceV2.findAllPublishedProductByShop({
                product_shop: req.user.userId
            })
        }).send(res)
    }

    async publishProductByShop(req, res, next) {
        new SuccessResponse({
            message: 'Published product success',
            metadata: await ProductServiceV2.publishProductByShop({
                product_shop: req.user.userId,
                product_id: req.params.id
            })
        }).send(res)
    }

    async unPublishProductByShop(req, res, next) {
        new SuccessResponse({
            message: 'Unpublished success',
            metadata: await ProductServiceV2.unPublishProductByShop({
                product_shop: req.user.userId,
                product_id: req.params.id
            })
        }).send(res);
    }

    async searchProductsByUser(req, res, next) {
        new SuccessResponse({
            message: 'Search products by user success',
            metadata: await ProductServiceV2.searchProductsByUser(req.params)
        }).send(res);
    }

    async findAllProducts(req, res, next) {
        new SuccessResponse({
            message: 'Find all products success',
            metadata: await ProductServiceV2.findAllProducts(req.query)
        }).send(res);
    }

    async findProductByUser(req, res, next) {
        new SuccessResponse({
            message: 'Find product by user success',
            metadata: await ProductServiceV2.findProduct(req.params.id)
        }).send(res);
    }
}

module.exports = new ProductController();

