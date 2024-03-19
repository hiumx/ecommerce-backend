'use strict';

const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = 'Notification';
const COLLECTION_NAME = 'Notifications';

const notificationSchema = new Schema({
    notify_type: { type: String, enum: ['ORDER-001', 'ORDER-002', 'PROMOTION-001', 'SHOP-001'], required: true },
    notify_senderId: { type: Schema.Types.ObjectId, ref: 'Shop', required: true },
    notify_receiverId: { type: Number, required: true },
    notify_content: { type: String, required: true },
    notify_options: { type: Object, default: {} }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, notificationSchema);