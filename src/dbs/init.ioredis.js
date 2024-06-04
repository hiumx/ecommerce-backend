'use strict';

const Redis = require('ioredis');
const { RedisResponseError } = require('../core/error.response');

const clients = {};
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
        console.log(`IORedis connection - Connect status: connected`);
        clearTimeout(connectionTimeout);
    })

    redisConnection.on(statusConnectRedis.END, () => {
        console.log(`IORedis connection - Connect status: disconnected`);
        handleTimeoutError();
    })

    redisConnection.on(statusConnectRedis.RECONNECT, () => {
        console.log(`IORedis connection - Connect status: reconnecting`);
        // clearTimeout(connectionTimeout);
        handleTimeoutError();
    })

    redisConnection.on(statusConnectRedis.ERROR, (err) => {
        console.log(`IORedis connection - Connect status: error`, err);
        handleTimeoutError(); 
    })

}

const init = async ({
    IOREDIS_IS_ENABLE,
    IOREDIS_HOSTS = process.env.REDIS_CACHE_HOSTS,
    IOREDIS_PORT = process.env.REDIS_CACHE_PORT
}) => {
    if(IOREDIS_IS_ENABLE) {
        const instanceRedis = new Redis({
            host: IOREDIS_HOSTS,
            port: IOREDIS_PORT
        })
        clients.instanceConnect = instanceRedis;
        handleEventConnection({ redisConnection: instanceRedis });
    
        // await instanceRedis.connect();
    }
}

const getIORedis = () => clients;

const closeIORedis = () => {
    //...
}

module.exports = {
    init,
    getIORedis,
    closeIORedis
}