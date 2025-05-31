import { ServerError } from "../../domain/exceptions/server-error";
import UserData from "../../domain/types/user-data";
import {getUser, saveUser, deleteUser, getUserByEmail, getUserByPassword, updateUser, getDeletedAtById } from "../../infraestructure/repository/user-repository";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET!;

// 1. POST AUTH/REGISTER
export async function createUser(name: string, email: string, cpf: string, password: string, ) {

    
    if (await getUserByEmail(email) || await getUserByPassword(email, password)) {
        throw new ServerError ("E3 - O e-mail ou CPF informado já pertence a outro usuário. ", 409);
    }

    //const avatarDefault = await uploadLocalImage('src/public/imgs/default.png')
    
    const encryptedPassword = await bcrypt.hash(password, 10);
    password = encryptedPassword;


    return await saveUser(name, email, cpf, password);
}

// 2. POST AUTH/SIGNIN
export async function loginUser(data: UserData){

    const user = await getUserByEmail(data.email);
    if(!user){
        throw new ServerError("E4- Usuário não encontrado", 404)
    }

    const deletedAt = await getDeletedAtById (user.id)
    if(deletedAt){
        throw new ServerError("E6 - Esta conta foi desativada e não pode ser utilizada. ", 403)
    }

    const senhaValida = await bcrypt.compare(data.password, user.password);
    if(!senhaValida){
        throw new ServerError ("E5 - Senha incorreta. ", 401)
    }

    const token = await jwt.sign({id: user.id, email: data.email, password: data.password}, jwtSecret, { expiresIn: "1d" });
    //const achievements = await getAchievementsById(user.id);

    const response = {
        token,
        id: user.id,
        name: user.name,
        email: user.email,
        cpf: user.cpf,
        avatar: user.avatar,
        //xp: user.xp,
        //level: user.level,
        //achievements
    };

    return response;
}

export async function getDeletedAtByIdService(id:string) {
    
    return await getDeletedAtById(id)
}

// 3 . GET USER
export async function getUsers(id : string) {

    const user = await getUser(id)

    //const achievements = await getAchievementsById(id);
    
    const response = {
        id: user!.id,
        name: user!.name,
        email: user!.email,
        cpf: user!.cpf,
        avatar: user!.avatar,
        //xp: user!.xp,
        //level: user!.level,
        //achievements, 
    };

    return response;
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
export async function updateUserService(name: string, email: string, password: string,  id: string){
    
    const userExt = await getUserByEmail(email)

    if (userExt || await getUserByPassword(email, password) ) {
        throw new ServerError ("E3 - O email ou CPF informado já pertence a outro usuário. ", 409);
    }
    
    const encryptedPassword = await bcrypt.hash(password, 10);
    password = encryptedPassword;

    const user =  await updateUser(name, email, password, id)
    
    const newUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        cpf: user.cpf,
        //avatar: user.avatar,
        //xp: user.xp,
        //level: user.level
    }
    return newUser
}

// 8. DELETE USER/DEACTIVATE
export async function deleteUsers(id:string) {

    return await deleteUser(id)
}


