import { Express, Router, Request} from "express";
import { ServerError } from "../../domain/exceptions/server-error";
import { createUser, loginUser, } from "../../application/service/auth-service";


export function AuthController (server: Express){

    const router = Router();

     router.post('/register', async (req: Request, res) =>{
        try{
            const {name, email, cpf, password} = req.body;
            await createUser(name, email, cpf, password);
            res.status(201).send({message: "Usuário criado com sucesso."})
            
        } catch (error) {
            if (error instanceof Error) {
            res.status(400).send({ error: error.message });
            } else {
            res.status(500).send({ error: 'Erro inesperado.' });
            }
        }
    });

    router.post('/sign-in', async (req: Request, res) =>{ 

        try{
            const data = req.body;
            const userData = await loginUser(data)
            res.status(200).send(userData)

        } catch (error) {
            if (error instanceof Error) {
            res.status(400).send({ error: error.message });
            } else {
            res.status(500).send({ error: 'Erro inesperado.' });
            }
        }
});

    server.use('/auth', router);
}

