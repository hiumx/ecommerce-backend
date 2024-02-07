'use strict';

const shopModel = require('../models/shop.model');
const crypto = require('node:crypto');
const keyTokenService = require('./keyToken.service');
const { createTokensPair } = require('../auth/authUtils');
const bcrypt = require('bcrypt');
const { getInfoData, getPubPriPairKey } = require('../utils');
const { BadRequestError, ConflictRequestError, UnauthorizedError } = require('../core/error.response');
const { ShopService } = require('./shop.service');

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
            const { publicKey, privateKey } = getPubPriPairKey();

            const keyStore = await keyTokenService.createKeyToken({
                userId: newShop._id,
                publicKey,
                privateKey
            });

            if (!keyStore) {
                throw new ConflictRequestError('Public key string error!');
            }

            const tokens = createTokensPair(
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

    static async login({ email, password, refreshToken = null }) {
        const foundShop = await ShopService.findByEmail(email);
        if (!foundShop) throw new BadRequestError('Email does not existed!');

        const match = await bcrypt.compare(password, foundShop.password);
        if (!match) throw new UnauthorizedError('Password incorrect!');

        const { publicKey, privateKey } = getPubPriPairKey();

        const tokens = createTokensPair({ userId: foundShop._id, email }, privateKey, publicKey);

        await keyTokenService.createKeyToken({
            userId: foundShop._id,
            publicKey,
            privateKey,
            refreshToken: tokens.refreshToken
        });

        return {
            metadata : {
                userInfo: getInfoData({
                    fields: ['_id', 'name', 'email'],
                    object: foundShop
                }),
                tokens
            }
        }

    }

    static async logout(keyStore) {
        const delKey = await keyTokenService.deleteById(keyStore._id);
        console.log(delKey);
        return delKey;
    }
}

module.exports = AccessService;