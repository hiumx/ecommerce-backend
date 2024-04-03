'use strict';

const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = 'OtpLog';
const COLLECTION_NAME = 'OtpLogs';

const otpSchema = new Schema({
    otp_token: { type: String, required: true },
    otp_email: { type: String, required: true },
    otp_status: { type: String, default: 'pending', enum: ['pending', 'active', 'block'] },
    expireAt: {
        type: Date, default: Date.now, expires: 60
    }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
});

module.exports = model(DOCUMENT_NAME, otpSchema);