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
exports.saveUser = saveUser;
exports.getUser = getUser;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
exports.getUserByEmail = getUserByEmail;
exports.getUserByPassword = getUserByPassword;
exports.getDeletedAtById = getDeletedAtById;
const prisma_client_1 = __importDefault(require("../prisma/prisma-client"));
// 1. POST AUTH/REGISTER
function saveUser(name, email, cpf, password) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma_client_1.default.users.create({
            data: {
                name: name,
                email: email,
                cpf: cpf,
                password: password,
                //avatar: avatar
            }
        });
    });
}
// 3. GET USER
function getUser(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma_client_1.default.users.findUnique({
            where: {
                id
            },
        });
    });
}
// // 4. GET USER/PREFERENCES
// export async function getUserPreferences(userId: string) {
//     const preferencesData = await prisma.preferences.findMany({
//         where:{
//             userId
//         },
//         select: {
//             typesId: {
//                 select: {
//                     id: true,
//                     name: true,
//                     description: true,
//                 },
//             },
//         }, 
//     })
//     return preferencesData.map(item => ({
//         typeId: item.typesId.id,
//         typeName: item.typesId.name,
//         typeDescription: item.typesId.description,
//     }));
// }
// // 5. POST USER/PREFERENCES/DEFINE
// export async function definePreferences(typeID: string[], id: string) {
//     const preferencesData = typeID.map((type) => ({
//         userId: id, 
//         typeId: type,  
//     }));
//     await prisma.preferences.createMany({
//         data: preferencesData, 
//     });
// }
// // 6 . PUT USER/AVATAR
// export async function updateImage(avatar: string, idUser: string) {
//     await prisma.users.update({
//         data: {
//             avatar: avatar, 
//         },
//         where: {
//             id: idUser, 
//         },
//     });
// }
// 7. PUT USER/UPDATE
function updateUser(name, email, password, id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma_client_1.default.users.update({
            data: {
                name,
                email,
                password,
            },
            where: {
                id
            }
        });
    });
}
//8. DELETE USER/DEACTIVATE
function deleteUser(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma_client_1.default.users.update({
            where: {
                id,
            },
            data: {
                deletedAt: new Date(),
            },
        });
    });
}
//VERIFICAÇÕES
function getUserByEmail(email) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma_client_1.default.users.findUnique({
            where: {
                email
            }
        });
    });
}
function getUserByPassword(password, userEmail) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield prisma_client_1.default.users.findUnique({
            where: {
                email: userEmail
            }
        });
        if (user && user.password === password) {
            return user;
        }
        else {
            return null;
        }
    });
}
function getDeletedAtById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield prisma_client_1.default.users.findUnique({
            where: {
                id: id,
            },
            select: {
                deletedAt: true
            },
        });
        return user ? !!user.deletedAt : false;
    });
}
;
// export async function getAchievementsById(userId: string) {
//     const userAchievements = await prisma.userAchievements.findMany({
//         where: {
//             userId: userId,
//         },
//         select: {
//             achievements: {
//                 select: {
//                     name: true,
//                     criterion: true,
//                 },
//             },
//         },
//     });
//     return userAchievements.map(item => ({
//         name: item.achievements.name,
//         criterion: item.achievements.criterion,
//     }));
// }
