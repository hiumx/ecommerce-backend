'use strict';

const { getIORedis } = require("../../dbs/init.ioredis");

const redisCache = getIORedis().instanceConnect;

const setCacheIO = async ({ key, value }) => {
    if(!redisCache) 
        throw new Error("Redis client is not initialize!");
    try {
        return await redisCache.set(key, value);
    } catch (error) {
        throw new Error(error.message);
    }
}

const setCacheIOExpiration = async ({
    key, value, expirationOnSeconds 
}) => {
    if(!redisCache)
        throw new Error("Redis client is not initialize!");
    try {
        return await redisCache.set(key, value, "EX", expirationOnSeconds);
    } catch (error) {
        throw new Error(error.message)
    }
}

const getCacheIO = async ({ key }) => {
    if(!redisCache)
        throw new Error("Redis client is not initialize!");
    try {
        return await redisCache.get(key);
    } catch (error) {
        throw new Error(error.message)
    }
}

module.exports = {
    setCacheIO,
    setCacheIOExpiration,
    getCacheIO
}