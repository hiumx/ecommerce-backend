const amqp = require('amqplib');

const messages = 'Hello, I am RabbitMQ';

const runProducer = async () => {
    try {
        const connection = await amqp.connect('amqp://guest:sa123456@localhost');
        const channel = await connection.createChannel();
    
        const queueName = 'test-topic';
        await channel.assertQueue(queueName, {
            durable: true
        });
    
        //send message to customer
        channel.sendToQueue(queueName, Buffer.from(messages));

        console.log('Messages send: ', messages);
    } catch (error) {
        console.error(error);
    }
}

runProducer().catch(console.error);