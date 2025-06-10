import express from "express";
import { json } from "express";
import { activityController  } from "./presentation/controller/activity-controller";
import dotenv from "dotenv";
import cors from "cors";

const server = express();
dotenv.config();
server.use(json());

server.use(cors({
  origin: 'http://localhost:3000', // ou '*' para liberar todos (não recomendado em produção)
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // métodos que vai aceitar
  credentials: true, // se precisar enviar cookies, tokens etc.
}));

activityController(server);

const port = process.env.PORT;

server.listen(port, () => {
  console.log("Rodando na porta " + port);
});
