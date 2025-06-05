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
exports.createUser = createUser;
exports.loginUser = loginUser;
exports.getDeletedAtByIdService = getDeletedAtByIdService;
exports.getUsers = getUsers;
exports.updateUserService = updateUserService;
exports.deleteUsers = deleteUsers;
exports.getUserByEmailService = getUserByEmailService;
const server_error_1 = require("../../domain/exceptions/server-error");
const user_repository_1 = require("../../infraestructure/repository/user-repository");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwtSecret = process.env.JWT_SECRET;
// 1. POST AUTH/REGISTER
function createUser(name, email, cpf, password) {
    return __awaiter(this, void 0, void 0, function* () {
        if ((yield (0, user_repository_1.getUserByEmail)(email)) || (yield (0, user_repository_1.getUserByPassword)(email, password))) {
            throw new server_error_1.ServerError("E3 - O e-mail ou CPF informado já pertence a outro usuário. ", 409);
        }
        //const avatarDefault = await uploadLocalImage('src/public/imgs/default.png')
        const encryptedPassword = yield bcrypt_1.default.hash(password, 10);
        password = encryptedPassword;
        return yield (0, user_repository_1.saveUser)(name, email, cpf, password);
    });
}
// 2. POST AUTH/SIGNIN
function loginUser(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield (0, user_repository_1.getUserByEmail)(data.email);
        if (!user) {
            throw new server_error_1.ServerError("E4- Usuário não encontrado", 404);
        }
        const deletedAt = yield (0, user_repository_1.getDeletedAtById)(user.id);
        if (deletedAt) {
            throw new server_error_1.ServerError("E6 - Esta conta foi desativada e não pode ser utilizada. ", 403);
        }
        const senhaValida = yield bcrypt_1.default.compare(data.password, user.password);
        if (!senhaValida) {
            throw new server_error_1.ServerError("E5 - Senha incorreta. ", 401);
        }
        const token = yield jsonwebtoken_1.default.sign({ id: user.id, email: data.email, password: data.password }, jwtSecret, { expiresIn: "1d" });
        //const achievements = await getAchievementsById(user.id);
        const response = {
            token,
            id: user.id,
            name: user.name,
            email: user.email,
            cpf: user.cpf,
            //avatar: user.avatar,
            //xp: user.xp,
            //level: user.level,
            //achievements
        };
        return response;
    });
}
function getDeletedAtByIdService(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield (0, user_repository_1.getDeletedAtById)(id);
    });
}
// 3 . GET USER
function getUsers(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield (0, user_repository_1.getUser)(id);
        //const achievements = await getAchievementsById(id);
        const response = {
            id: user.id,
            name: user.name,
            email: user.email,
            cpf: user.cpf,
            //avatar: user!.avatar,
            //xp: user!.xp,
            //level: user!.level,
            //achievements, 
        };
        return response;
    });
}
// // 4 . GET USER/PREFERENCES
// export async function getUsersPreferences(id: string) {
//     const preferences  = getUserPreferences(id)
//     return preferences
// }
// 5. POST USER/PREFERENCES/DEFINE
// export async function defineUserPreferences (typeId: string[], id: string) {
//     const searchId = await getActivityTypeById(typeId)
//     if(searchId == false){
//         throw new ServerError("Um ou mais IDs informados são inválidos. ", 400)
//     }
//     return await definePreferences(typeId, id)
// }
// // 6. UPDATE USER/AVATAR
// export async function updateImageService(avatar: string, id: string) {
//     const regex = /\.(jpg|png)$/i;
//     const result = regex.test(avatar);
//     if (!result) {
//         throw new ServerError("E2 - A imagem deve ser um arquivo PNG ou JPG.", 400);
//     }
//     void addAchievement(id, 'Alterar Foto de Perfil');
//     return await updateImage(avatar, id);
// }
// 7. UPDATE USER/UPDATE
function updateUserService(name, email, password, id) {
    return __awaiter(this, void 0, void 0, function* () {
        const userExt = yield (0, user_repository_1.getUserByEmail)(email);
        if (userExt || (yield (0, user_repository_1.getUserByPassword)(email, password))) {
            throw new server_error_1.ServerError("E3 - O email ou CPF informado já pertence a outro usuário. ", 409);
        }
        const encryptedPassword = yield bcrypt_1.default.hash(password, 10);
        password = encryptedPassword;
        const user = yield (0, user_repository_1.updateUser)(name, email, password, id);
        const newUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            cpf: user.cpf,
            //avatar: user.avatar,
            //xp: user.xp,
            //level: user.level
        };
        return newUser;
    });
}
// 8. DELETE USER/DEACTIVATE
function deleteUsers(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield (0, user_repository_1.deleteUser)(id);
    });
}
function getUserByEmailService(email) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield (0, user_repository_1.getUserByEmail)(email);
        if (!user) {
            throw new server_error_1.ServerError("E4 - Usuário não encontrado", 404);
        }
        return user;
    });
}
