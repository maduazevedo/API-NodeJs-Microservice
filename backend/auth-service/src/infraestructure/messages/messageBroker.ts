import amqp from 'amqplib';

let channel: amqp.Channel;

export async function connectRabbitMQ() {

    const amqpUrl = process.env.RABBITMQ_URL!;

  console.log('Conectando no RabbitMQ em:', amqpUrl);

  const connection = await amqp.connect(amqpUrl);

  channel = await connection.createChannel();

  await channel.assertQueue('auth.response', { durable: false });
}

export function getChannel() {
  if (!channel) {
    throw new Error('RabbitMQ channel not initialized');
  }
  return channel;
}
