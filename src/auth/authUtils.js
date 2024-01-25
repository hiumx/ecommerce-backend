'use strict';

const JWT = require('jsonwebtoken');

const createKeysPair = ( payload, privateKey, publicKey ) => {
    const accessToken = JWT.sign(payload, privateKey, {
        algorithm: 'RS256',
        expiresIn: '2 days'
    });
    
    const refreshToken = JWT.sign(payload, privateKey, {
        algorithm: 'RS256',
        expiresIn: '7 days'
    });

    // JWT.verify(accessToken, publicKey, (err, decoded) => {
    //     if(!err) {
    //         console.log('Decode::', decoded);
    //     } else {
    //         console.log(err);
    //     }
    // })

    return {
        accessToken, refreshToken
    }
}

module.exports = {
    createKeysPair
}