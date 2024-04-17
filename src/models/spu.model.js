'use strict'

const { Types, Schema, model } = require('mongoose');
const slugify = require('slugify');

const DOCUMENT_NAME = 'Spu';
const COLLECTION_NAME = 'Spus';

const productSchema = new Schema({
    product_id: { type: String, required: true },
    product_name: { type: String, required: true },
    product_thumb: { type: String, required: true },
    product_description: String,
    product_price: { type: Number, required: true },
    product_quantity: { type: Number, required: true },
    product_category: { type: Array, default: [] },
    product_slug: String,
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
    product_attributes: { type: Schema.Types.Mixed, required: true },
    /*
        {
            attribute_id: 1234, style ao['han quoc', 'mua he', 'mua dong']
            attribute_values: [
                {
                    id: 23232
                }
            ]
        }
    */
    product_variations: { type: Array, default: [] },
    /*
        [
            {
                name: 'color',
                image: '',
                options: ['red', 'black', 'orange']
            },
            {
                name: 'size',
                image: '',
                options: ['S', 'M', 'L']
            },
        ]
    */
    product_ratingsAverage: {
        type: Number,
        min: [1, 'rating must be above 1'],
        max: [5, 'rating must be below 5'],
        set: val => Math.round(val * 10) / 10
    },
    isDraft: { type: Boolean, default: true, index: true, select: false },
    isPublished: { type: Boolean, default: false, index: true, select: false },
    isDeleted: { type: Boolean, default: false }
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

module.exports = model(DOCUMENT_NAME, productSchema);
