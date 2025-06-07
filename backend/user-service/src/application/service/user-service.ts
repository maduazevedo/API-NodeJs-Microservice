import { ServerError } from "../../domain/exceptions/server-error";
import UserData from "../../domain/types/user-data";
import {getUser, saveUser, deleteUser, getUserByEmail, updateUser, getDeletedAtById, getUserByCPF, getUserByPassword, updateImage } from "../../infraestructure/repository/user-repository";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET!;


// 1. GET user
export async function getUsers(id : string) {

    const user = await getUser(id)
    
    const response = {
        id: user!.id,
        name: user!.name,
        email: user!.email,
        cpf: user!.cpf,
        avatar: user!.avatar,
    };

    return response;
}

// 2. PUT user/avatar
export async function updateImageService(avatar: string, id: string) {

    const regex = /\.(jpg|png)$/i;
    const result = regex.test(avatar);

    if (!result) {
        throw new ServerError("E2 - A imagem deve ser um arquivo PNG ou JPG.", 400);
    }

    return await updateImage(avatar, id);
}

// 3. PUT user/update
export async function updateUserService(name: string, email: string, cpf: string, password: string,  id: string){
    
    const userByEmail = await getUserByEmail(email)

    if (userByEmail) {
        throw new ServerError ("E3 - O email informado já pertence a outro usuário. ", 409);
    }

    const userByCPF = await getUserByCPF(cpf);    

    if (userByCPF) {
            throw new ServerError("E3 - O CPF informado já pertence a outro usuário.", 409);
    }
    
    const encryptedPassword = await bcrypt.hash(password, 10);
    password = encryptedPassword;

    const user =  await updateUser(name, email, cpf, password, id)
    
    const newUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        cpf: user.cpf,
        avatar: user.avatar,
    }
    return newUser
}

// 4. DELETE user/deactivate
export async function deleteUsers(id:string) {

    return await deleteUser(id)
}


export async function getUserByEmailService(email: string) {
    const user = await getUserByEmail(email);
    if (!user) {
        throw new ServerError("E4 - Usuário não encontrado", 404);
    }
    return user;
    
}

export async function getDeletedAtByIdService(id:string) {
    
    return await getDeletedAtById(id)
}