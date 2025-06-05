import { Express, Router, Request} from "express";
import {authGuard} from "../../infraestructure/middleware/auth-guard";
import { ServerError } from "../../domain/exceptions/server-error";
import { deleteUsers, getUsers, loginUser, createUser, updateUserService, getUserByEmailService } from "../../application/service/user-service";


export function userController (server: Express){

    const router = Router();
    
    router.use(authGuard)
     router.post('/register', async (req: Request, res) =>{
        try{
            const {name, email, cpf, password} = req.body;
            await createUser(name, email, cpf, password);
            res.status(201).send({message: "Usuário criado com sucesso."})
            
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


    // router.put('/avatar', upload.single("avatar"), async (req: Request, res)=>{
    //     try{
    //         const userId = res.userId as string
    //         const avatar = await uploadImage(req.file!)
    //         await updateImageService(avatar, userId)
    //         res.status(200).json({avatar: avatar});

    //     }catch(error){
    //         if (error instanceof ServerError){
    //             res.status(error.statusCode).send({error: error.message})
    //             return
    //         }else{
    //             res.status(500).send({error: "Erro inesperado. "})
    //         }
    //     }
        
    // });
    

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

    router.get('/:email', async (req, res) => {
    try {
        const { email } = req.params; 
        const response = await getUserByEmailService(email);
        res.status(200).send(response);

    } catch (error) {
       if (error instanceof Error) {
    res.status(500).send({
        error: "Erro inesperado",
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
} else {
    res.status(500).send({
        error: "Erro inesperado",
        message: "Erro desconhecido"
    });
}

    }
});


    server.use('/user', router);
}

