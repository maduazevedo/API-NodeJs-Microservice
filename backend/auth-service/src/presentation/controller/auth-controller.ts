import { Express, Router, Request} from "express";
import { ServerError } from "../../domain/exceptions/server-error";
import { loginUser, } from "../../application/service/auth-service";


export function AuthController (server: Express){

    const router = Router();

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

    router.post('/sign-in', async (req: Request, res) =>{ 

        try{
            const data = req.body;
            const userData = await loginUser(data)
            res.status(200).send(userData)

        }catch(error){
            if (error instanceof ServerError){
                res.status(error.statusCode).send({error: error.message})
                return
            }else{
                res.status(500).send({error: "Erro inesperado. "})
                return
            }
        }
    });

    server.use('/auth', router);
}

