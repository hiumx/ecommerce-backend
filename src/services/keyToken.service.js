'use strict';

const keyTokenModel = require('../models/keyToken.model');

class keyTokenService {

    static async createKeyToken({ userId, publicKey, privateKey }) {
        try {
            const token = await keyTokenModel.create({
                user: userId,
                publicKey,
                privateKey
            });

            return token ? token.publicKey : null;
        } catch (error) {
            return error;
        }
    }
}

module.exports = keyTokenService;