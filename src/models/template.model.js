'use strict';

const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = 'Template';
const COLLECTION_NAME = 'Templates';

const templateSchema = new Schema({
    tem_id: { type: Number, required: true },
    tem_name: { type: String, required: true },
    tem_status: { type: String, default: 'active', enum: ['active', 'pending', 'block'] },
    tem_html: { type: String, required: true }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
});

module.exports = model(DOCUMENT_NAME, templateSchema);