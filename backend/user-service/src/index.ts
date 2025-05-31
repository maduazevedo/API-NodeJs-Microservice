import express from "express";
import { json } from "express";
import { userController } from "./presentation/controller/user-controller";
import dotenv from "dotenv";

const server = express();
dotenv.config();
server.use(json());
userController(server);

const port = process.env.PORT;

server.listen(port, () => {
  console.log("Rodando na porta " + port);
});
