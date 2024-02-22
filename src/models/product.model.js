'use strict'

const { Types, Schema, model } = require('mongoose');
const slugify = require('slugify');

const COLLECTION_NAME = 'Products';
const DOCUMENT_NAME = 'Product';

const productSchema = new Schema({
    product_name: { type: String, required: true },
    product_thumb: { type: String, required: true },
    product_description: String,
    product_price: { type: Number, required: true },
    product_quantity: { type: Number, required: true },
    product_slug: String,
    product_type: { type: String, required: true, enum: ['Electronic', 'Clothing', 'Furniture'] },
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
    product_attributes: { type: Schema.Types.Mixed, required: true },
    product_variations: { type: Array, default: [] },
    product_ratingsAverage: {
        type: Number,
        min: [1, 'rating must be above 1'],
        max: [1, 'rating must be below 5'],
        set: val => Math.round(val * 10) / 10
    },
    isDraft: { type: Boolean, default: true },
    isPublished: { type: Boolean, default: false }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
});

productSchema.index({ product_name: 'text', product_description: 'text' });

//Product model middleware
productSchema.pre('save', function (next) {
    this.product_slug = slugify(this.product_name);
    next();
})

const clothingSchema = new Schema({
    brand: { type: String, required: true },
    size: { type: String },
    material: { type: String },
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' }
}, {
    collection: 'Clothes',
    timestamps: true
});

const electronicSchema = new Schema({
    manufacturer: { type: String, required: true },
    model: { type: String },
    color: { type: String },
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' }
}, {
    collection: 'Electronics',
    timestamps: true
});

const FurnitureSchema = new Schema({
    brand: { type: String, required: true },
    size: { type: String },
    material: { type: String },
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' }
}, {
    collection: 'Furnitures',
    timestamps: true
});

module.exports = {
    productModel: model(DOCUMENT_NAME, productSchema),
    clothingModel: model('Clothing', clothingSchema),
    electronicModel: model('Electronic', electronicSchema),
    furnitureModel: model('Furniture', FurnitureSchema),
}
