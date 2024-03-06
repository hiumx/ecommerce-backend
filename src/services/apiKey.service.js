'use strict';

const apiKeyModel = require("../models/apiKey.model");
const crypto = require('node:crypto');

const findKey = async (key) => {
    try {
        // await apiKeyModel.create({
        //     key: crypto.randomBytes(64).toString('hex'), status: true, permissions: ['0000']
        // })
        const keyFind = await apiKeyModel.findOne({
            key, status: true
        }).lean();
        return keyFind;
    } catch (error) {
        
    }
}

module.exports = {
    findKey
}