const amqp = require('amqplib');

const runConsumer = async () => {
    try {
        const connection = await amqp.connect('amqp://guest:sa123456@localhost');
        const channel = await connection.createChannel();
    
        const queueName = 'test-topic';
        await channel.assertQueue(queueName, {
            durable: true
        });
    
        //send message to customer
        channel.consume(queueName, (messages) => {
            console.log('Received messages: ', messages.content.toString());
        }, {
            noAck: true
        });

    } catch (error) {
        console.error(error);
    }
}

runConsumer().catch(console.error);