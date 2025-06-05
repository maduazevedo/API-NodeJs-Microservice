import amqp from 'amqplib';

let channel: amqp.Channel;

export async function connectRabbitMQ() {
  const user = process.env.RABBITMQ_USER;
  const pass = process.env.RABBITMQ_PASS;
  const host = process.env.RABBITMQ_HOST;
  const port = process.env.RABBITMQ_PORT;

  const amqpUrl = `amqp://${user}:${pass}@${host}:${port}`;

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
