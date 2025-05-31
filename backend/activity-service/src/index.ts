import express from "express";
import { json } from "express";
import { activityController  } from "./presentation/controller/activity-controller";
import dotenv from "dotenv";

const server = express();
dotenv.config();
server.use(json());
activityController(server);

const port = process.env.PORT;

server.listen(port, () => {
  console.log("Rodando na porta " + port);
});
