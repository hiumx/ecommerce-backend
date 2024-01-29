'use strict';

const {model, Schema} = require('mongoose');

const COLLECTION_NAME = 'ApiKeys';
const DOCUMENT_NAME = 'ApiKey';

const apiKeySchema = new Schema({
    key: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: Boolean,
        default: true
    },
    permissions: {
        type: [String],
        required: true,
        default: ['0000', '1111', '2222']
    }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
});

module.exports = model(DOCUMENT_NAME, apiKeySchema);