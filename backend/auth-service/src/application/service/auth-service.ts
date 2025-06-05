import { ServerError } from "../../domain/exceptions/server-error";
import UserData from "../../domain/types/user-data";
import {saveUser, getUserByEmail, getUserByPassword, getDeletedAtById } from "../../infraestructure/repository/user-repository";
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

    const response = {
        token,
        id: user.id,
        name: user.name,
        email: user.email,
        cpf: user.cpf,
    };

    return response;
}


export async function getUserByEmailService(email: string) {
    const user = await getUserByEmail(email);
    if (!user) {
        throw new ServerError("E4 - Usuário não encontrado", 404);
    }
    return user;
}


