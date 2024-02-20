'use strict'

const { Types, Schema, model } = require('mongoose');

const COLLECTION_NAME = 'Products';
const DOCUMENT_NAME = 'Product';
// const a = {
//     "product_name": "New jeans",
//     "product_thumb": "product_thumb",
//     "product_description": "High-quantity jeans",
//     "product_price": 100,
//     "product_quantity": 5,
//     "product_type": "Clothing",
//     "product_shop": "65c300d46ec5f62e4747558a",
//     "product_attributes": {
//         "brand": "LV",
//         "size": "free-size",
//         "material": "Denim"
//     }

// }

const productSchema = new Schema({
    product_name: { type: String, required: true },
    product_thumb: { type: String, required: true },
    product_description: String,
    product_price: { type: Number, required: true },
    product_quantity: { type: Number, required: true },
    product_type: { type: String, required: true, enum: ['Electronic', 'Clothing', 'Furniture'] },
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
    product_attributes: { type: Schema.Types.Mixed, required: true }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
});

const clothingSchema = new Schema({
    brand: { type: String, required: true },
    size: { type: String },
    material: { type: String },
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop'}
}, {
    collection: 'Clothes',
    timestamps: true
});

const electronicSchema = new Schema({
    manufacturer: { type: String, required: true },
    model: { type: String },
    color: { type: String },
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop'}
}, {
    collection: 'Electronics',
    timestamps: true
});

module.exports = {
    productModel: model(DOCUMENT_NAME, productSchema),
    clothingModel: model('Clothing', clothingSchema),
    electronicModel: model('Electronic', electronicSchema),
}
