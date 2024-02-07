'use strict';

const shopModel = require('../models/shop.model');
const crypto = require('node:crypto');
const keyTokenService = require('./keyToken.service');
const { createTokensPair, verifyJWT } = require('../auth/authUtils');
const bcrypt = require('bcrypt');
const { getInfoData, getPubPriPairKey } = require('../utils');
const { BadRequestError, ConflictRequestError, UnauthorizedError, ForbiddenError } = require('../core/error.response');
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
            metadata: {
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
        return delKey;
    }

    static async handleRefreshToken(refreshToken) {
        const foundToken = await keyTokenService.findRefreshTokenUsed(refreshToken);
        if (foundToken) {
            const { userId, email } = verifyJWT(refreshToken, foundToken.privateKey);
            const delToken = await keyTokenService.deleteByUserId(userId);

            if (delToken) throw new ForbiddenError('Something went wrong! Please login again');
        } else {

            const holderToken = await keyTokenService.findByRefreshToken(refreshToken);
            if (!holderToken) throw new UnauthorizedError('Shop does not registered!');

            const { userId, email } = verifyJWT(refreshToken, holderToken.privateKey);

            const tokens = createTokensPair({ userId, email }, holderToken.privateKey, holderToken.publicKey);

            await holderToken.updateOne({
                $set: {
                    refreshToken: tokens.refreshToken
                },
                $addToSet: {
                    refreshTokensUsed: refreshToken
                }
            });

            return {
                shop: {
                    userId, email
                },
                tokens
            }
        }
    }
}

module.exports = AccessService;