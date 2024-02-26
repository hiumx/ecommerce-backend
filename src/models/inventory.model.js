'use strict';

const { model, Schema, Types } = require('mongoose');

const COLLECTION_NAME = 'Inventories';
const DOCUMENT_NAME = 'Inventory';

const inventorySchema = new Schema({
    inventory_productId: { type: Schema.Types.ObjectId, ref: 'Product' },
    inventory_shopId: { type: Schema.Types.ObjectId, ref: 'Shop' },
    inventory_stock: { type: Number, required: true },
    inventory_location: { type: String, default: 'UnKnown' },
    inventory_reservations: { type: Array, default: [] },
}, {
    collection: COLLECTION_NAME,
    timestamps: true
});

module.exports = model(DOCUMENT_NAME, inventorySchema);