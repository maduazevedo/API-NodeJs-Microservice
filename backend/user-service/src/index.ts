import express from "express";
import { json } from "express";
import { userController } from "./presentation/controller/user-controller";
import dotenv from "dotenv";
import { startUserValidationConsumer } from './infraestructure/messaging/user-auth-consumer';
import { startUserRegisterConsumer } from "./infraestructure/messaging/user-register-consumer";

const server = express();
dotenv.config();
server.use(json());
userController(server);

startUserValidationConsumer()
startUserRegisterConsumer();

const port = process.env.PORT;

server.listen(port, () => {
  console.log("Rodando na porta " + port);
});
