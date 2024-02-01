'use strict';

const shopModel = require('../models/shop.model');
const crypto = require('node:crypto');
const keyTokenService = require('./keyToken.service');
const { createKeysPair } = require('../auth/authUtils');
const bcrypt = require('bcrypt');
const { getInfoData } = require('../utils');
const { BadRequestError, ConflictRequestError } = require('../core/error.response');

const ROLES = {
    READ: '001',
    WRITE: '002'
}

class AccessService {

    static async signUp({ name, email, password }) {

        const existShop = await shopModel.findOne({ email }).lean();
        if (existShop) {
            throw new BadRequestError('Email already register!')
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const newShop = await shopModel.create({
            name, email, password: hashPassword, roles: [ROLES.READ]
        });

        if (newShop) {
            const publicKey = crypto.randomBytes(64).toString('hex');
            const privateKey = crypto.randomBytes(64).toString('hex');

            const keyStore = await keyTokenService.createKeyToken({
                userId: newShop._id,
                publicKey,
                privateKey
            });

            if (!keyStore) {
                throw new ConflictRequestError('Public key string error!');
            }

            const tokens = createKeysPair(
                { userId: newShop._id, email }, privateKey, publicKey
            );

            return {
                code: 201,
                metadata: {
                    userInfo: getInfoData({
                        fields: ['_id', 'name', 'email'],
                        object: newShop
                    }),
                    tokens
                }
            }
        }

        return {
            code: 200,
            metadata: null
        }
    }
}

module.exports = AccessService;