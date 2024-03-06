'use strict';

const { model, Schema, Types } = require('mongoose');

const COLLECTION_NAME = 'Orders';
const DOCUMENT_NAME = 'Order';

const orderSchema = new Schema({
    order_userId: { type: Number, required: true },
    order_checkout: { type: Object, default: {} },
    order_shipping: { type: Object, default: {} },
    order_products: { type: Array, default: [] },
    order_trackingNumber: { type: String, default: '#0000106032024' },
    order_payment: { type: Object, default: {} },
    order_status: { type: String, enum: ['pending', 'confirmed', 'shipping', 'cancelled', 'delivered'], default: 'pending' }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
});

module.exports = model(DOCUMENT_NAME, orderSchema);