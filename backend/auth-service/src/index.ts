import express from "express";
import { json } from "express";
import dotenv from "dotenv";
import { connectRabbitMQ } from "./infraestructure/messageBroker";
import { AuthController } from "./presentation/controller/auth-controller";

const server = express();
dotenv.config();
server.use(json());
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
