const amqp = require('amqplib');

const orderProducer = async () => {
    try {
        const connection = await amqp.connect('amqp://guest:sa123456@localhost');
        const channel = await connection.createChannel();

        const queueName = 'order-queue';
        await channel.assertQueue(queueName, {
            durable: true // when restart don't lose messages in message queue
        });

        //send message to customer
        let message;
        for (let i = 0; i < 10; i++) {
            message = `Order message :: ${(i + 1)}`;
            console.log('Order send message: ', message);

            channel.sendToQueue(queueName, Buffer.from(message), {
                // expiration: '10000', // TTL - Time To Live of message
                persistent: true // message dc persistent lien tuc vao cache or disk (neu cache co van de)
            });
        }

    } catch (error) {
        console.error(error);
    }
}

orderProducer().catch(console.error);