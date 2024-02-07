const JWT = require("jsonwebtoken");
const { UnauthorizedError, NotFoundError } = require("../core/error.response");
const asyncHandler = require("../helpers/asyncHandler");
const { findKey } = require("../services/apiKey.service");
const keyTokenService = require("../services/keyToken.service");

const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization'
}

const checkApiKey = async (req, res, next) => {
    try {
        const key = req.headers[HEADER.API_KEY]?.toString();
        if (!key) {
            return res.status(403).json({
                message: 'Forbidden error'
            })
        };
        const keyObj = await findKey(key);

        if (!keyObj) {
            return res.status(403).json({
                message: 'Forbidden error'
            })
        };
        req.keyObj = keyObj;
        return next();
    } catch (error) {

    }
}

const checkPermission = permission => {
    return (req, res, next) => {
        if (!req.keyObj.permissions) {
            return res.status(403).json({
                message: 'Permission denied'
            })
        }
        const keyValid = req.keyObj.permissions.includes(permission);
        if (!keyValid) {
            return res.status(403).json({
                message: 'Permission denied'
            })
        }
        return next();
    }
}

const authentication = asyncHandler( async (req, res, next) => {
    const userId = req.headers[HEADER.CLIENT_ID]
    if(!userId) throw new UnauthorizedError('Request invalid!');

    const keyStore = await keyTokenService.findByUserId(userId);
    if(!keyStore) throw new NotFoundError('Key store not found!');

    const accessToken = req.headers[HEADER.AUTHORIZATION];
    if(!accessToken) throw new UnauthorizedError('Request invalid!');

    try {
        const decoded = JWT.verify(accessToken, keyStore.publicKey);
        if(userId !== decoded.userId) throw new UnauthorizedError('User id invalid!');

        req.keyStore = keyStore;

        return next();
    } catch (error) {
        next(error);
    }

});

module.exports = {
    checkApiKey,
    checkPermission,
    authentication
}