import express from "express";
import { json } from "express";
import dotenv from "dotenv";
import { connectRabbitMQ } from "./infraestructure/messages/messageBroker";
import { AuthController } from "./presentation/controller/auth-controller";
import cors from "cors";

const server = express();
dotenv.config();
server.use(json());

server.use(cors({
  origin: 'http://localhost:3000', // ou '*' para liberar todos (não recomendado em produção)
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // métodos que vai aceitar
  credentials: true, // se precisar enviar cookies, tokens etc.
}));


AuthController(server);

const port = process.env.PORT;

connectRabbitMQ()
  .then(() => {
    server.listen(port, () => {
      console.log(`Auth Service rodando na porta ${port}`);
    });
  })
  .catch((err) => {
    console.error("Erro ao conectar RabbitMQ:", err);
    process.exit(1);
  });

