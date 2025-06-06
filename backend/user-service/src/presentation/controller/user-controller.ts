import { Express, Router, Request} from "express";
import {authGuard} from "../../infraestructure/middleware/auth-guard";
import { ServerError } from "../../domain/exceptions/server-error";
import { deleteUsers, getUsers, updateUserService, getUserByEmailService, updateImageService } from "../../application/service/user-service";
import { uploadImage } from "../../application/service/s3-service";
import upload from "../../application/multer/multer";


export function userController (server: Express){

    const router = Router();

    router.use(authGuard)
    
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


    // router.get('/preferences', async (req, res) =>{
    //     try{
    //     const id = res.userId as string;
    //     const preferencesData = await getUsersPreferences(id)
    //     res.status(200).send(preferencesData);

    // }catch(error){
    //     if (error instanceof ServerError){
    //         res.status(error.statusCode).send({error: error.message})
    //         return
    //     }else{
    //         res.status(500).send({error: "Erro inesperado. "})
    //     }
    // }
    // });

    
    // router.post('/preferences/define',  async (req: Request, res) =>{
    //     try{
    //     const id = res.userId as string;
    //     const preferences = req.body;
    //     await defineUserPreferences(preferences, id)
    //     res.status(200).send({message: 'Preferencias atualizadas com sucesso. '});
        
    // }catch(error){
    //     if (error instanceof ServerError){
    //         res.status(error.statusCode).send({error: error.message})
    //         return
    //     }else{
    //         res.status(500).send({error: "Erro inesperado. "})
    //     }
    // }
    // });


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
                res.status(500).send({error: "Erro inesperado. "})
            }
        }
        
    });
    

    router.put('/update', async (req: Request, res)=>{

        try{
            const id = res.userId as string;
            const {name, email, password} = req.body;
            const userData = await updateUserService(name, email, password, id)
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

