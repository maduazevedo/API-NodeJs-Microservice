import express from "express";
import { json } from "express";
import { activityController  } from "./presentation/controller/activity-controller";
import dotenv from "dotenv";
import { createBucket } from "./application/service/s3-service";

const server = express();
dotenv.config();
server.use(json());
activityController(server);

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
