'use strict';

const redis = require('redis');
const { RedisResponseError } = require('../core/error.response');

const client = {};
const statusConnectRedis = {
    CONNECT: 'connect',
    END: 'end',
    RECONNECT: 'reconnecting',
    ERROR: 'error'
}

const REDIS_CONNECT_TIMEOUT = 10000, REDIS_CONNECT_MESSAGE = {
    code: -99,
    message: {
        vi: 'Redis ket noi that bai!',
        en: 'Redis connect failed!'
    }
};

let connectionTimeout;

const handleTimeoutError = () => {
    connectionTimeout = setTimeout(() => {
        throw new RedisResponseError(REDIS_CONNECT_MESSAGE.message.vi, REDIS_CONNECT_MESSAGE.code);
    }, REDIS_CONNECT_TIMEOUT);
}


const handleEventConnection = ({ redisConnection }) => {
    // if(redisConnection === null) {
    //     console.log('Redis connection instance is null');
    // }
    redisConnection.on(statusConnectRedis.CONNECT, () => {
        console.log(`Redis connection - Connect status: connected`);
        clearTimeout(connectionTimeout);
    })

    redisConnection.on(statusConnectRedis.END, () => {
        console.log(`Redis connection - Connect status: disconnected`);
        handleTimeoutError();
    })

    redisConnection.on(statusConnectRedis.RECONNECT, () => {
        console.log(`Redis connection - Connect status: reconnecting`);
        clearTimeout(connectionTimeout);
    })

    redisConnection.on(statusConnectRedis.ERROR, (err) => {
        console.log(`Redis connection - Connect status: error`, err);
        handleTimeoutError(); 
    })

}

const initRedis = async () => {
    const instanceRedis = redis.createClient();
    client.instanceConnect = instanceRedis;
    handleEventConnection({ redisConnection: instanceRedis });

    await instanceRedis.connect();
}

const getRedis = () => client;

const closeRedis = () => {
    //...
}

module.exports = {
    initRedis,
    getRedis,
    closeRedis
}