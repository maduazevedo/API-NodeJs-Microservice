import { ServerError } from "../../domain/exceptions/server-error";
import UserData from "../../domain/types/user-data";
import jwt from "jsonwebtoken";
import { getChannel } from '../../infraestructure/messages/messageBroker';
import { v4 as uuidv4 } from 'uuid';
import { Channel } from "amqplib";
import dotenv from 'dotenv';
dotenv.config();

const jwtSecret = process.env.JWT_SECRET!;


//1. POST AUTH/REGISTER
export async function createUser(name: string, email: string, cpf: string, password: string, ) {

    
    const channel = getChannel();
    const correlationId = uuidv4();

    const resp = await sendAndWait(channel, 'user.create', { name, email, cpf, password }, correlationId);

    if ('error' in resp) {
        throw new Error(typeof resp.error === 'string' ? resp.error : 'Unknown error');
    }

    return;
}

//2. POST AUTH/SIGNIN

export async function loginUser(data: UserData){

    const channel = getChannel();
    const correlationId = uuidv4();

    const resp = await sendAndWait(channel, 'user.validate', data, correlationId);
    const user = resp;

    if ('error' in resp) {
        throw new Error(typeof resp.error === 'string' ? resp.error : 'Unknown error');
    }

    const token = jwt.sign({ id: user.id, email: user.email }, jwtSecret, { expiresIn: "1d" });

    const response = {
        token,
        id: user.id,
        name: user.name,
        email: user.email,
        cpf: user.cpf,
    };

    return response;
}



//sendawit do rabbitmq
export async function sendAndWait(
    channel: Channel,
    queueName: string,
    data: any,
    correlationId: string
): Promise<UserData> {
    return new Promise(async (resolve, reject) => {
        try {
            // Cria uma replyQueue exclusiva e temporária
            const { queue: replyQueue } = await channel.assertQueue('', {
                exclusive: true,
                autoDelete: true
            });

            // Consome a replyQueue
            const consumerTag = await channel.consume(replyQueue, msg => {
                if (msg?.properties.correlationId === correlationId) {
                    const userData = JSON.parse(msg.content.toString()) as UserData;
                    channel.ack(msg);

                    // Cancela o consumer após receber a resposta
                    channel.cancel(consumerTag.consumerTag);
                    clearTimeout(timeout);
                    resolve(userData);
                }
            }, { noAck: false }); // sempre com noAck: false

            // Envia a mensagem
            channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)), {
                correlationId,
                replyTo: replyQueue
            });

            // Timeout de segurança
            const timeout = setTimeout(() => {
                channel.cancel(consumerTag.consumerTag);
                reject(new Error('Timeout na resposta do RabbitMQ'));
            }, 5000); // ajuste o tempo se quiser

        } catch (err) {
            reject(err);
        }
    });
}

// export async function getUserByEmailService(email: string) {
//     const user = await getUserByEmail(email);
//     if (!user) {
//         throw new ServerError("E4 - Usuário não encontrado", 404);
//     }
//     return user;
// }


