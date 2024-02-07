'use strict';

const keyTokenModel = require('../models/keyToken.model');

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
}

module.exports = keyTokenService;