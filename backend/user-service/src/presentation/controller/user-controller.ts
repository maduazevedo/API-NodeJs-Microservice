import { Express, Router, Request} from "express";
import {authGuard} from "../../infraestructure/middleware/auth-guard";
import { ServerError } from "../../domain/exceptions/server-error";
import { deleteUsers, getUsers, updateUserService, updateImageService } from "../../application/service/user-service";
import { uploadImage } from "../../application/service/s3-service";
import upload from "../../application/multer/multer";


export function userController (server: Express){

    const router = Router();

    router.use(authGuard)

    //1. GET user
    router.get('/', async (req, res) =>{
        try{

        const id = res.userId as string;
        const user = await getUsers(id);
        res.status(200).send(user);

        }catch(error){
            if (error instanceof ServerError){
                res.status(error.statusCode).send({error: error.message})
                return
            }else{
                res.status(500).send({error: "Erro inesperado. "})
            }
        }
    });
    //2. PUT user/avatar
    router.put('/avatar', upload.single("avatar"), async (req: Request, res)=>{
        try{
            const userId = res.userId as string
            const avatar = await uploadImage(req.file!)
            await updateImageService(avatar, userId)
            res.status(200).json({avatar: avatar});

        }catch(error){
            if (error instanceof ServerError){
                res.status(error.statusCode).send({error: error.message})
                return
            }else{
                res.status(500).send({error: error instanceof Error ? error.message : "Erro inesperado. "})
            }
        }
        
    });
    
    //3. PUT user/update
    router.put('/update', async (req: Request, res)=>{

        try{
            const id = res.userId as string;
            const {name, email, cpf, password} = req.body;
            const userData = await updateUserService(name, email, cpf, password, id)
            res.status(200).send(userData);
            
        }catch(error){
            if (error instanceof ServerError){
                res.status(error.statusCode).send({error: error.message})
                return
            }else{
                res.status(500).send({error: "Erro inesperado. "})
            }
        }
    });
    //4. DELETE user/deactivate
    router.delete('/deactivate', async (req, res) =>{

        try{
            const id = res.userId as string
            await deleteUsers(id)
            res.status(200).send({message: "Conta desativada com sucesso. "});

        }catch(error){
            if (error instanceof ServerError){
                res.status(error.statusCode).send({error: error.message})
                return
            }else{
                res.status(500).send({error: "Erro inesperado. "})
            }
        }
    });

    server.use('/user', router);
}

