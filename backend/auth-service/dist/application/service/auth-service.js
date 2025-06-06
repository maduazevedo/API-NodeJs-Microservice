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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = loginUser;
const server_error_1 = require("../../domain/exceptions/server-error");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const axios_1 = __importDefault(require("axios"));
const jwtSecret = process.env.JWT_SECRET;
const USER_SERVICE_URL = 'http://localhost:3002';
// 1. POST AUTH/REGISTER
// export async function createUser(name: string, email: string, cpf: string, password: string, ) {
//     if (await getUserByEmail(email) || await getUserByPassword(email, password)) {
//         throw new ServerError ("E3 - O e-mail ou CPF informado já pertence a outro usuário. ", 409);
//     }
//     //const avatarDefault = await uploadLocalImage('src/public/imgs/default.png')
//     const encryptedPassword = await bcrypt.hash(password, 10);
//     password = encryptedPassword;
//     return await saveUser(name, email, cpf, password);
// }
// 2. POST AUTH/SIGNIN
function loginUser(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const userResponse = yield axios_1.default.get(`${USER_SERVICE_URL}/user/${encodeURIComponent(data.email)}`);
        const user = userResponse.data;
        if (!user) {
            throw new server_error_1.ServerError("E4- Usuário não encontrado", 404);
        }
        if (user.deletedAt) {
            throw new server_error_1.ServerError("E6 - Esta conta foi desativada e não pode ser utilizada. ", 403);
        }
        const senhaValida = yield bcrypt_1.default.compare(data.password, user.password);
        if (!senhaValida) {
            throw new server_error_1.ServerError("E5 - Senha incorreta. ", 401);
        }
        const token = yield jsonwebtoken_1.default.sign({ id: user.id, email: data.email, password: data.password }, jwtSecret, { expiresIn: "1d" });
        const response = {
            token,
            id: user.id,
            name: user.name,
            email: user.email,
            cpf: user.cpf,
        };
        return response;
    });
}
// export async function getUserByEmailService(email: string) {
//     const user = await getUserByEmail(email);
//     if (!user) {
//         throw new ServerError("E4 - Usuário não encontrado", 404);
//     }
//     return user;
// }
