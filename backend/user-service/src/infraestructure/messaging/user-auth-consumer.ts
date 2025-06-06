import amqp from 'amqplib';
import bcrypt from 'bcrypt';
import { getUserByEmail } from '../repository/user-repository';


export async function startUserValidationConsumer() {

    const amqpUrl = process.env.RABBITMQ_URL!;
    console.log('Conectando no RabbitMQ em:', amqpUrl);

    const connection = await amqp.connect(amqpUrl);
    const channel = await connection.createChannel();

    const queue = 'user.validate';
    await channel.assertQueue(queue, { durable: false });

    channel.consume(queue, async (msg) => {
        if (!msg) return;

        const data = JSON.parse(msg.content.toString()) as { email: string; password: string };
        const correlationId = msg.properties.correlationId;
        const replyQueue = msg.properties.replyTo;

        try {
            const user = await getUserByEmail(data.email);

            if (!user || user.deletedAt) {
                const errorResponse = { error: 'Usuário não encontrado ou desativado' };
                channel.sendToQueue(replyQueue, Buffer.from(JSON.stringify(errorResponse)), { correlationId });
                channel.ack(msg);
                return;
            }

            const senhaValida = await bcrypt.compare(data.password, user.password);
            if (!senhaValida) {
                const errorResponse = { error: 'Senha incorreta' };
                channel.sendToQueue(replyQueue, Buffer.from(JSON.stringify(errorResponse)), { correlationId });
                channel.ack(msg);
                return;
            }

            const userResponse = {
                id: user.id,
                name: user.name,
                email: user.email,
                cpf: user.cpf,
            };

            channel.sendToQueue(replyQueue, Buffer.from(JSON.stringify(userResponse)), { correlationId });
            channel.ack(msg);
        } catch (error) {
            const errorResponse = { error: 'Erro inesperado' };
            channel.sendToQueue(replyQueue, Buffer.from(JSON.stringify(errorResponse)), { correlationId });
            channel.ack(msg);
        }
    });
}
