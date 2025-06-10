import express from "express";
import { json } from "express";
import { userController } from "./presentation/controller/user-controller";
import dotenv from "dotenv";
import { startUserValidationConsumer } from './infraestructure/messaging/user-auth-consumer';
import { startUserRegisterConsumer } from "./infraestructure/messaging/user-register-consumer";
import { createBucket } from "./application/service/s3-service";
import cors from "cors";

const server = express();
dotenv.config();
server.use(json());

server.use(cors({
  origin: 'http://localhost:3000', // ou '*' para liberar todos (não recomendado em produção)
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // métodos que vai aceitar
  credentials: true, // se precisar enviar cookies, tokens etc.
}));

userController(server);

startUserValidationConsumer()
startUserRegisterConsumer();

const start = async () => {
  await createBucket();
};

start().catch((error) => {
  console.error("Erro ao iniciar o serviço:", error);
});

const port = process.env.PORT;

server.listen(port, () => {
  console.log("Rodando na porta " + port);
});

