"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = AuthController;
const express_1 = require("express");
const server_error_1 = require("../../domain/exceptions/server-error");
const auth_service_1 = require("../../application/service/auth-service");
function AuthController(server) {
    const router = (0, express_1.Router)();
    //  router.post('/register', async (req: Request, res) =>{
    //     try{
    //         const {name, email, cpf, password} = req.body;
    //         await createUser(name, email, cpf, password);
    //         res.status(201).send({message: "Usuário criado com sucesso."})
    //     }catch(error){
    //         if (error instanceof ServerError){
    //             res.status(error.statusCode).send({error: error.message})
    //             return
    //         }else{
    //             res.status(500).send({error: "Erro inesperado. "})
    //             return
    //         }
    //     }
    // });
    router.post('/sign-in', (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const data = req.body;
            const userData = yield (0, auth_service_1.loginUser)(data);
            res.status(200).send(userData);
        }
        catch (error) {
            if (error instanceof server_error_1.ServerError) {
                res.status(error.statusCode).send({ error: error.message });
                return;
            }
            else {
                res.status(500).send({ error: "Erro inesperado. " });
                return;
            }
        }
    }));
    server.use('/auth', router);
}
