import { ServerError } from "../../domain/exceptions/server-error";
import UserData from "../../domain/types/user-data";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import { getChannel } from '../../infraestructure/messageBroker';
import { v4 as uuidv4 } from 'uuid';
import { Channel } from "amqplib";

const jwtSecret = process.env.JWT_SECRET!


const USER_SERVICE_URL = 'http://localhost:3002';

// 1. POST AUTH/REGISTER
// export async function createUser(name: string, email: string, cpf: string, password: string, ) {

    
//     if (await getUserByEmail(email) || await getUserByPassword(email, password)) {
//         throw new ServerError ("E3 - O e-mail ou CPF informado já pertence a outro usuário. ", 409);
//     }

//     //const avatarDefault = await uploadLocalImage('src/public/imgs/default.png')
    
//     const encryptedPassword = await bcrypt.hash(password, 10);
//     password = encryptedPassword;


//     return await saveUser(name, email, cpf, password);
// }

// 2. POST AUTH/SIGNIN
export async function loginUser(data: UserData){

    const channel = getChannel();
    const correlationId = uuidv4();

    const resp = await sendAndWait(channel, 'user.validate', data, correlationId, 'auth.response');

    const user = resp;
   
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



// exemplo: src/messaging/rabbitmq.ts (ou onde você colocou o código da fila)
export async function sendAndWait(
    channel: Channel,
    queueName: string,
    data: any,
    correlationId: string,
    replyQueue: string
): Promise<UserData> {   // <- aqui você ajusta o tipo de retorno
    return new Promise((resolve, reject) => {
        channel.consume(replyQueue, msg => {
            if (msg?.properties.correlationId === correlationId) {
                const userData = JSON.parse(msg.content.toString()) as UserData;
                resolve(userData);
            }
        }, { noAck: true });

        channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)), {
            correlationId,
            replyTo: replyQueue
        });
    });
}


// export async function getUserByEmailService(email: string) {
//     const user = await getUserByEmail(email);
//     if (!user) {
//         throw new ServerError("E4 - Usuário não encontrado", 404);
//     }
//     return user;
// }


