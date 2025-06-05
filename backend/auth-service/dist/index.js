"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_2 = require("express");
const dotenv_1 = __importDefault(require("dotenv"));
const auth_controller_1 = require("./presentation/controller/auth-controller");
const server = (0, express_1.default)();
dotenv_1.default.config();
server.use((0, express_2.json)());
(0, auth_controller_1.AuthController)(server);
const port = process.env.PORT;
server.listen(port, () => {
    console.log("Rodando na porta " + port);
});
