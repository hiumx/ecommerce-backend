'use strict';

const amqp = require('amqplib');

const message = 'Add new product';

const runProducer = async () => {
    try {
        const connection = await amqp.connect('amqp://guest:sa123456@localhost');
        const channel = await connection.createChannel();

        // 1 .Define exchange
        const notificationEx = 'notificationEx';
        const notificationQueue = 'notificationQueueProcess';
        const notificationExDLX = 'notificationExDLX';
        const notificationRoutingKeyDLX = 'notificationRoutingKeyDLX';

        // 2. Create exchange
        await channel.assertExchange(notificationEx, 'direct', {
            durable: true
        });

        // 3. Create queue
        const queueResult = await channel.assertQueue(notificationQueue, {
            exclusive: false,
            deadLetterExchange: notificationExDLX,
            deadLetterRoutingKey: notificationRoutingKeyDLX
        });

        // 4. Binding ex & queue
        await channel.bindQueue(queueResult.queue, notificationEx);

        console.log(`Producer send message:: ${message}`);
        // 5. Send message
        await channel.sendToQueue(queueResult.queue, Buffer.from(message), {
            expiration: '10000'
        });

        setTimeout(async () => {
            await connection.close();
            process.exit(0);
        }, 500);

    } catch (error) {
        console.error(error);
    }
}

runProducer();