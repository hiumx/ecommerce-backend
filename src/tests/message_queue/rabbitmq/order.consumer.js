const amqp = require('amqplib');

const orderConsumer = async () => {
    try {
        const connection = await amqp.connect('amqp://guest:sa123456@localhost');
        const channel = await connection.createChannel();

        const queueName = 'order-queue';
        await channel.assertQueue(queueName, {
            durable: true // when restart don't lose messages in message queue
        });

        channel.prefetch(1);

        await channel.consume(queueName, msg => {
            const message = msg.content.toString();

            setTimeout(() => {
                console.log(message);
                channel.ack(msg)
            }, Math.random() * 1000);
        })


    } catch (error) {
        console.error(error);
    }
}

orderConsumer().catch(console.error);