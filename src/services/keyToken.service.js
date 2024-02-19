'use strict';

const keyTokenModel = require('../models/keyToken.model');
const { Types } = require('mongoose');

class keyTokenService {

    static async createKeyToken({ userId, publicKey, privateKey, refreshToken }) {
        try {

            const filter = { user: userId }, update = {
                privateKey, publicKey, refreshToken, refreshTokensUsed: []
            }, options = { upsert: true, new: true }

            const tokens = await keyTokenModel.findOneAndUpdate(filter, update, options);

            return tokens ? tokens.publicKey : null;
        } catch (error) {
            return error;
        }
    }

    static async findByUserId(userId) {
        return await keyTokenModel.findOne({ user: new Types.ObjectId(userId) });
    }

    static async deleteById(id) {
        return await keyTokenModel.deleteOne(id).lean();
    }

    static async findRefreshTokenUsed( refreshToken ) {
        return await keyTokenModel.findOne({ refreshTokensUsed: refreshToken}).lean();
    }

    static async findByRefreshToken(refreshToken) {
        return await keyTokenModel.findOne({ refreshToken });
    }

    static async deleteByUserId(userId) {
        return await keyTokenModel.deleteOne({user: new Types.ObjectId(userId)});
    }
}

module.exports = keyTokenService;