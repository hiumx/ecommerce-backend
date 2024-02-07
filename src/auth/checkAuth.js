const { findKey } = require("../services/apiKey.service");

const HEADER = {
    apiKey: 'x-api-key',
    authorization: 'authorization'
}

const checkApiKey = async (req, res, next) => {
    try {
        const key = req.headers[HEADER.apiKey]?.toString();
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

const asyncHandler = fn => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    }
}

module.exports = {
    checkApiKey,
    checkPermission,
    asyncHandler
}