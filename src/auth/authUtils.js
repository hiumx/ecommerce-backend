'use strict';

const JWT = require('jsonwebtoken');

const createTokensPair = ( payload, privateKey, publicKey ) => {
    const accessToken = JWT.sign(payload, publicKey, {
        expiresIn: '2 days'
    });
    
    const refreshToken = JWT.sign(payload, privateKey, {
        expiresIn: '7 days'
    });
    
    return {
        accessToken, refreshToken
    }
}

const verifyJWT = (token, keySecret) => {
    try {
        return JWT.verify(token, keySecret);
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    createTokensPair,
    verifyJWT
}