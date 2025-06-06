import amqp from 'amqplib';
import bcrypt from 'bcrypt';
import { getUserByEmail, getUserByCPF, saveUser } from '../repository/user-repository';

export async function startUserRegisterConsumer() {
    const amqpUrl = process.env.RABBITMQ_URL!;
    console.log('Conectando no RabbitMQ em:', amqpUrl);

    const connection = await amqp.connect(amqpUrl);
    const channel = await connection.createChannel();

    const queue = 'user.create';
    await channel.assertQueue(queue, { durable: false });

    channel.consume(queue, async (msg) => {
        if (!msg) return;

        // Espera receber name, email, cpf, password no data
        const data = JSON.parse(msg.content.toString()) as {
        name: string;
        email: string;
        cpf: string;
        password: string;
        };
        const correlationId = msg.properties.correlationId;
        const replyQueue = msg.properties.replyTo;

        try {
        const userByEmail = await getUserByEmail(data.email);
        if (userByEmail) {
            const errorResponse = { error: 'E-mail já cadastrado' };
            channel.sendToQueue(replyQueue, Buffer.from(JSON.stringify(errorResponse)), { correlationId });
            channel.ack(msg);
            return;
        }

        const userByCPF = await getUserByCPF(data.cpf);
        if (userByCPF) {
            const errorResponse = { error: 'CPF já cadastrado' };
            channel.sendToQueue(replyQueue, Buffer.from(JSON.stringify(errorResponse)), { correlationId });
            channel.ack(msg);
            return;
        }

 
        const hashedPassword = await bcrypt.hash(data.password, 10);
        await saveUser(data.name, data.email, data.cpf, hashedPassword);

        channel.sendToQueue(replyQueue, Buffer.from(JSON.stringify({ ok: true })), { correlationId });
        channel.ack(msg);

        } catch (error) {
        const errorResponse = { error: 'Erro inesperado' };
        channel.sendToQueue(replyQueue, Buffer.from(JSON.stringify(errorResponse)), { correlationId });
        channel.ack(msg);
        }
    });
}
