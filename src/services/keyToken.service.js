'use strict';

const keyTokenModel = require('../models/keyToken.model');

class keyTokenService {

    static async createKeyToken({ userId, publicKey }) {
        try {
            const publicKeyString = publicKey.toString();
            const token = await keyTokenModel.create({
                user: userId,
                publicKey: publicKeyString
            });

            return token ? publicKeyString : null;
        } catch (error) {
            return error;
        }
    }
}

module.exports = keyTokenService;