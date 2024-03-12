'use strict';

const redis = require('redis');
const redisClient = redis.createClient();
const { promisify } = require('util');
const { reservationInventory } = require('../models/repositories/inventory.repo');

// redisClient.ping((err, result) => {
//     if(err) {
//         console.log('Error connecting Redis: ', err);
//     } else {
//         console.log('Connect Redis DB successfully.');
//     }
// });

const connectRedis = async () => {
    redisClient.on('error', err => console.log('Redis Client Error', err));
    await redisClient.connect();
}

connectRedis();



const pExpireAsync = promisify(redisClient.pExpire).bind(redisClient);
const setNxAsync = promisify(redisClient.setNX).bind(redisClient);

const acquireLock = async ({ cartId, productId, quantity }) => {
    const key = `lock_v2024_${productId}`;
    const tryTimes = 10;
    const expireTime = 3000;

    for (let i = 0; i < tryTimes; i++) {
        const result = await setNxAsync(key, expireTime);

        if (result === 1) {
            const isReservation = await reservationInventory({
                cartId, productId, quantity
            });

            if (isReservation.modifiedCount) {
                await pExpireAsync(key, expireTime);
                return key;
            }
            return null;
        } else {
            await new Promise((resolve) => setTimeout(resolve, 50));
        }

    }
}

const releaseLock = async keyLock => {
    const delAsync = promisify(redisClient.del).bind(redisClient);
    return await delAsync(keyLock);
}

module.exports = {
    acquireLock,
    releaseLock
}