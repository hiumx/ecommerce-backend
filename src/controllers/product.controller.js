const ProductService = require('../services/product.service');
const { SuccessResponse } = require('../core/success.response');

class ProductController {

    async createProduct(req, res, next) {
        new SuccessResponse({
            message: 'Create new product success',
            metadata:  await ProductService.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user.userId
            })
        }).send(res);
    }

    async updateProduct(req, res, next) {
        new SuccessResponse({
            message: 'Update product success',
            metadata:  await ProductService.updateProduct({
                type: req.body.product_type,
                productId: req.params.productId,
                shopId: req.user.userId,
                payload: {
                ...req.body,
                product_shop: req.user.userId
            }})
        }).send(res);
    }

    async getAllDraftProductByShop(req, res, next) {
        new SuccessResponse({
            message: 'Get list draft product success',
            metadata: await ProductService.findAllDraftProductByShop({
                product_shop: req.user.userId
            })
        }).send(res)
    }

    async getAllPublishedProductByShop(req, res, next) {
        new SuccessResponse({
            message: 'Get list published product success',
            metadata: await ProductService.findAllPublishedProductByShop({
                product_shop: req.user.userId
            })
        }).send(res)
    }

    async publishProductByShop(req, res, next) {
        new SuccessResponse({
            message: 'Published product success',
            metadata: await ProductService.publishProductByShop({
                product_shop: req.user.userId,
                product_id: req.params.id
            })
        }).send(res)
    }

    async unPublishProductByShop(req, res, next) {
        new SuccessResponse({
            message: 'Unpublished success',
            metadata: await ProductService.unPublishProductByShop({
                product_shop: req.user.userId,
                product_id: req.params.id
            })
        }).send(res);
    }

    async searchProductsByUser(req, res, next) {
        new SuccessResponse({
            message: 'Search products by user success',
            metadata: await ProductService.searchProductsByUser(req.params)
        }).send(res);
    }

    async findAllProducts(req, res, next) {
        new SuccessResponse({
            message: 'Find all products success',
            metadata: await ProductService.findAllProducts(req.query)
        }).send(res);
    }

    async findProductByUser(req, res, next) {
        new SuccessResponse({
            message: 'Find product by user success',
            metadata: await ProductService.findProduct(req.params.id)
        }).send(res);
    }
}

module.exports = new ProductController();

