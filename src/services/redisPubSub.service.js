'use strict';

const redis = require('redis')

class RedisPubSubService {
    constructor() {
        this.publisher = redis.createClient();
        this.subscriber = redis.createClient();
    }

    publish(channel, message) {
        return new Promise((resolve, reject) => {
            this.publisher.publish(channel, message, (err, reply) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(reply);
                }
            })
        })
    }

    subscribe(channel, callback) {
        this.subscriber.subscribe(channel);
        this.subscriber.on('message', (subChannel, message) => {
            if(channel === subChannel) {
                callback(channel, message);
            }
        })
    }
}

module.exports = new RedisPubSubService();