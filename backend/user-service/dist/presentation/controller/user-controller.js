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
exports.userController = userController;
const express_1 = require("express");
const auth_guard_1 = require("../../infraestructure/middleware/auth-guard");
const server_error_1 = require("../../domain/exceptions/server-error");
const user_service_1 = require("../../application/service/user-service");
function userController(server) {
    const router = (0, express_1.Router)();
    router.get('/:email', (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const { email } = req.params;
            const response = yield (0, user_service_1.getUserByEmailService)(email);
            res.status(200).send(response);
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(500).send({
                    error: "Erro inesperado",
                    message: error.message,
                    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
                });
            }
            else {
                res.status(500).send({
                    error: "Erro inesperado",
                    message: "Erro desconhecido"
                });
            }
        }
    }));
    router.use(auth_guard_1.authGuard);
    router.post('/register', (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const { name, email, cpf, password } = req.body;
            yield (0, user_service_1.createUser)(name, email, cpf, password);
            res.status(201).send({ message: "Usuário criado com sucesso." });
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
    router.post('/sign-in', (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const data = req.body;
            const userData = yield (0, user_service_1.loginUser)(data);
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
    router.get('/', (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const id = res.userId;
            const user = yield (0, user_service_1.getUsers)(id);
            res.status(200).send(user);
        }
        catch (error) {
            if (error instanceof server_error_1.ServerError) {
                res.status(error.statusCode).send({ error: error.message });
                return;
            }
            else {
                res.status(500).send({ error: "Erro inesperado. " });
            }
        }
    }));
    // router.get('/preferences', async (req, res) =>{
    //     try{
    //     const id = res.userId as string;
    //     const preferencesData = await getUsersPreferences(id)
    //     res.status(200).send(preferencesData);
    // }catch(error){
    //     if (error instanceof ServerError){
    //         res.status(error.statusCode).send({error: error.message})
    //         return
    //     }else{
    //         res.status(500).send({error: "Erro inesperado. "})
    //     }
    // }
    // });
    // router.post('/preferences/define',  async (req: Request, res) =>{
    //     try{
    //     const id = res.userId as string;
    //     const preferences = req.body;
    //     await defineUserPreferences(preferences, id)
    //     res.status(200).send({message: 'Preferencias atualizadas com sucesso. '});
    // }catch(error){
    //     if (error instanceof ServerError){
    //         res.status(error.statusCode).send({error: error.message})
    //         return
    //     }else{
    //         res.status(500).send({error: "Erro inesperado. "})
    //     }
    // }
    // });
    // router.put('/avatar', upload.single("avatar"), async (req: Request, res)=>{
    //     try{
    //         const userId = res.userId as string
    //         const avatar = await uploadImage(req.file!)
    //         await updateImageService(avatar, userId)
    //         res.status(200).json({avatar: avatar});
    //     }catch(error){
    //         if (error instanceof ServerError){
    //             res.status(error.statusCode).send({error: error.message})
    //             return
    //         }else{
    //             res.status(500).send({error: "Erro inesperado. "})
    //         }
    //     }
    // });
    router.put('/update', (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const id = res.userId;
            const { name, email, password } = req.body;
            const userData = yield (0, user_service_1.updateUserService)(name, email, password, id);
            res.status(200).send(userData);
        }
        catch (error) {
            if (error instanceof server_error_1.ServerError) {
                res.status(error.statusCode).send({ error: error.message });
                return;
            }
            else {
                res.status(500).send({ error: "Erro inesperado. " });
            }
        }
    }));
    router.delete('/deactivate', (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const id = res.userId;
            yield (0, user_service_1.deleteUsers)(id);
            res.status(200).send({ message: "Conta desativada com sucesso. " });
        }
        catch (error) {
            if (error instanceof server_error_1.ServerError) {
                res.status(error.statusCode).send({ error: error.message });
                return;
            }
            else {
                res.status(500).send({ error: "Erro inesperado. " });
            }
        }
    }));
    server.use('/user', router);
}
