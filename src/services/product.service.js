const { BadRequestError } = require('../core/error.response');
const { productModel, clothingModel, electronicModel } = require('../models/product.model')

class ProductService {

    static createProduct(type, payload) {
        switch (type) {
            case 'Clothing':
                return new Clothing(payload).createClothing();
            case 'Electronic':
                return new Electronic(payload).createElectronic();
            default:
                throw new BadRequestError(`Invalid product Type = ${type}`);
        }
    }
}

class Product {
    constructor(
        { product_name,
            product_thumb,
            product_price,
            product_quantity,
            product_type,
            product_shop,
            product_attributes }
    ) {
        this.product_name = product_name,
            this.product_thumb = product_thumb,
            this.product_price = product_price,
            this.product_quantity = product_quantity,
            this.product_type = product_type,
            this.product_shop = product_shop,
            this.product_attributes = product_attributes
    }

    async createProduct(product_id) {
        return await productModel.create({
            ...this,
            _id: product_id
        });
    }
}

class Electronic extends Product {

    async createElectronic() {
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

    async createClothing() {
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

module.exports = ProductService;