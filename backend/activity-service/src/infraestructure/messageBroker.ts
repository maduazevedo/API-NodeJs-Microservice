import amqp from 'amqplib';

let channel: amqp.Channel;

export async function connectRabbitMQ() {
    const connection = await amqp.connect('amqp://rabbitmq');
    channel = await connection.createChannel();
}

export function getChannel() {
    if (!channel) {
        throw new Error('RabbitMQ channel not initialized');
    }
    return channel;
}
