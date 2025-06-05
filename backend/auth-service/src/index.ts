import express from "express";
import { json } from "express";
import dotenv from "dotenv";

const server = express();
dotenv.config();
server.use(json());

const port = process.env.PORT;

server.listen(port, () => {
  console.log("Rodando na porta " + port);
});
