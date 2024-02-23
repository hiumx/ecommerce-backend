const { BadRequestError } = require('../core/error.response');
const { productModel, clothingModel, electronicModel, furnitureModel } = require('../models/product.model');
const {
    findAllDraftProductByShop,
    publishProductByShop,
    findAllPublishedProductByShop,
    unPublishProductByShop,
    searchProductsByUser,
    findAllProducts,
    findProductByUser
} = require('../models/repositories/product.repo');

class ProductService {

    static productClassRegistry = {};

    static registerProductType(type, classRef) {
        this.productClassRegistry[type] = classRef;
    }

    static createProduct(type, payload) {
        const classProduct = this.productClassRegistry[type];
        if (!classProduct) throw new BadRequestError(`Invalid product Type = ${type}`);

        return new classProduct(payload).createProduct();
    }

    static async publishProductByShop({ product_shop, product_id }) {
        return await publishProductByShop({ product_shop, product_id });
    }

    static async unPublishProductByShop({ product_shop, product_id }) {
        return await unPublishProductByShop({ product_shop, product_id })
    }

    static async findAllDraftProductByShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isDraft: true };
        return await findAllDraftProductByShop({ query, limit, skip });
    }

    static async findAllPublishedProductByShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isPublished: true };
        return await findAllPublishedProductByShop({ query, limit, skip });
    }

    static async searchProductsByUser({ keySearch }) {
        return await searchProductsByUser({ keySearch });
    }

    static async findAllProducts({ limit = 50, page = 1, sort = 'ctime', filter = { isPublished: true } }) {
        return await findAllProducts({ limit, page, sort, filter, select: ['product_name', 'product_thumb', 'product_price'] });
    }

    static async findProduct(product_id) {
        return findProductByUser({ product_id, unSelect: ['__v', 'product_variations'] });
    }

}

class Product {
    constructor(
        { product_name,
            product_thumb,
            product_price,
            product_quantity,
            product_description,
            product_type,
            product_shop,
            product_attributes }
    ) {
        this.product_name = product_name,
            this.product_thumb = product_thumb,
            this.product_price = product_price,
            this.product_quantity = product_quantity,
            this.product_description = product_description,
            this.product_type = product_type,
            this.product_shop = product_shop,
            this.product_attributes = product_attributes
    }

    async createProduct(product_id) {
        console.log(this);
        return await productModel.create({
            ...this,
            _id: product_id
        });
    }
}

class Electronic extends Product {

    async createProduct() {
        const newElectronic = await electronicModel.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        });
        if (!newElectronic) throw new BadRequestError('Create new electronic failure!');

        const newProduct = await super.createProduct();
        if (!newProduct) throw new BadRequestError('Create product failure!');

        return newProduct;
    }
}

class Clothing extends Product {

    async createProduct() {
        const newClothing = await clothingModel.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        });
        if (!newClothing) throw new BadRequestError('Create new clothing failure!');

        const newProduct = await super.createProduct(newClothing._id);
        if (!newProduct) throw new BadRequestError('Create product failure!');

        return newProduct;
    }
}

class Furniture extends Product {

    async createProduct() {
        const newFurniture = await furnitureModel.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        });
        console.log(this);
        if (!newFurniture) throw new BadRequestError('Create new furniture failure!');

        const newProduct = await super.createProduct(newFurniture._id);
        if (!newProduct) throw new BadRequestError('Create product failure!');

        return newProduct;
    }
}

ProductService.registerProductType('Clothing', Clothing);
ProductService.registerProductType('Electronic', Electronic);
ProductService.registerProductType('Furniture', Furniture);

module.exports = ProductService;