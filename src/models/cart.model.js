'use strict';

const { model, Schema } = require('mongoose');

const COLLECTION_NAME = 'Carts';
const DOCUMENT_NAME = 'Cart';

const cartModel = new Schema({
    cart_state: {
        type: String,
        enum: ['active', 'completed', 'failed', 'pending'],
        default: 'active'
    },
    cart_userId: {
        type: Number,
        required: true
    },
    cart_products: {
        type: Array,
        required: true,
        default: []
    },
    cart_count_product: { type: Number, default: 0 }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
});

module.exports = model(DOCUMENT_NAME, cartModel);