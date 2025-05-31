import { Request, Response, NextFunction, request } from "express";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

const jwtSecret = process.env.JWT_SECRET!;

//pegando o user da sessao
declare module 'express-serve-static-core'{
    interface Response {
        userId?: string;
    }
}

export async function authGuard(
    req: Request,
    res: Response,
    next: NextFunction
    ) {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.status(401).send({error: "E19 - Autenticação necessária."});
        return;
    }

    const token = authHeader.replace("Bearer ", "");

    try {
        const userPayload = jwt.verify(token, jwtSecret) as {
            id: string,
            email : string, 
            password: string, 
            iat: number, 
            exp: number
        };

        
        
        res.userId = userPayload.id;
        next();
    } catch (error: any) {
        res.status(401).send({ error: "Token inválido ou expirado."});
        return;
    }
}
