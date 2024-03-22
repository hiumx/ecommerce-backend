const amqp = require('amqplib');

const messages = 'Add new product:: Title: @abc';

const runProducer = async () => {
    try {
        const connection = await amqp.connect('amqp://guest:sa123456@localhost');
        const channel = await connection.createChannel();
    
        const queueName = 'test-topic';
        await channel.assertQueue(queueName, {
            durable: true // when restart don't lose messages in message queue
        });
    
        //send message to customer
        channel.sendToQueue(queueName, Buffer.from(messages), {
           // expiration: '10000', // TTL - Time To Live of message
            persistent: true // message dc persistent lien tuc vao cache or disk (neu cache co van de)
        });

        console.log('Messages send: ', messages);
    } catch (error) {
        console.error(error);
    }
}

runProducer().catch(console.error);