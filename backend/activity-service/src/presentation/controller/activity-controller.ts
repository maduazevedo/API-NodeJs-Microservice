import { Express, Router, Request } from "express";
import { authGuard } from "../../infraestructure/middleware/auth-guard";
import { ServerError } from "../../domain/exceptions/server-error";
import { getByPaginatedFilterTypeAndOrder, getAllByFilterTypeAndOrder, getActivitiesUserCreator, getActivitiesUserCreatorAll, createActivity, getActivitiesUserParticipant, getParticipantsByActivities, updateActivities, concludeActivities, deleteActivities} from "../../application/service/activity-service";
import { createSubscriptionInActivity, approveParticipants, doCheckin, doUnsubscribe } from "../../application/service/activity-participant-service";

export function activityController (server: Express){

    const router = Router();

    router.use(authGuard)

    // router.get('/types', async(req, res) =>{
    //     try{
    //         const response = await getActivitiesTypes()
    //         res.status(200).send(response);
    //     }catch (error) {
    //         if (error instanceof ServerError) {
    //             res.status(500).send({ error: error.message });
    //         } else {
    //             res.status(500).send({ error: 'Erro inesperado. ' });
    //         }
    //     }
    // });
    

    router.get('/', async(req, res) =>{
        try {
            const userId = res.userId as string
            const { page = 1, pageSize = 10, typeId, orderBy, order } = req.query; 
            const pageInt = Number(page);
            const pageSizeInt = Number(pageSize);
            const typeIdStr = typeId ? String(typeId) : undefined;
            const orderByStr = orderBy ? String(orderBy) : undefined;
            const orderStr = order === 'asc' || order === 'desc' ? order : undefined;

            const response = await getByPaginatedFilterTypeAndOrder(userId, orderByStr, orderStr);
            res.status(200).send(response);
        } catch (error) {
            if (error instanceof ServerError) {
                res.status(500).send({ error: error.message });
            } else {
                res.status(500).send({ error: 'Erro inesperado. ' });
            }
        }
    });

    router.get('/all', async (req, res) =>{
        try {
            const userId = res.userId as string
            const { typeId, orderBy, order } = req.query; 
            const typeIdStr = typeof typeId === 'string' ? typeId : undefined;
            const orderByStr = typeof orderBy === 'string' ? orderBy : undefined; 
            const orderStr = order === 'asc' || order === 'desc' ? order : undefined;
        
            const response = await getAllByFilterTypeAndOrder(userId, typeIdStr, orderByStr, orderStr);
            console.log(response)
            res.status(200).send(response);
        }catch (error) {
            if (error instanceof ServerError) {
                res.status(500).send({ error: error.message });
            } else {
                res.status(500).send({ error: 'Erro inesperado. ' });
            }
        }
    });

    router.get('/user/creator', async (req, res) =>{
        try {
            const creatorId = res.userId as string 
            const page = parseInt(req.query.page as string || '1');  
            const pageSize = parseInt(req.query.pageSize as string || '10');  

            const response = await getActivitiesUserCreator(creatorId, page, pageSize);
            res.status(200).send(response);
        } catch (error) {
            if (error instanceof ServerError) {
                res.status(500).send({ error: error.message });
            } else {
                res.status(500).send({ error: 'Erro inesperado. ' });
            }
        }
    });

    router.get('/user/creator/all', async (req, res) =>{
        try{
            const userId = res.userId as string
            const response = await getActivitiesUserCreatorAll(userId)
            res.status(200).send(response);
        }catch (error) {
            if (error instanceof ServerError) {
                res.status(500).send({ error: error.message });
            } else {
                res.status(500).send({ error: 'Erro inesperado. ' });
            }
        }
    });

    router.get('/user/participant', async (req, res) =>{
        try {
            const userId = res.userId as string 
            const page = parseInt(req.query.page as string || '1');  
            const pageSize = parseInt(req.query.pageSize as string || '10');  

            const response = await getActivitiesUserParticipant(userId, page, pageSize);
            res.status(200).send(response);
        } catch (error) {
            if (error instanceof ServerError) {
                res.status(500).send({ error: error.message });
            } else {
                res.status(500).send({ error: 'Erro inesperado. ' });
            }
        }
    });

    // router.get('/user/participant/all', async (req, res) =>{
    //     try{
    //         const userId = res.userId as string
    //         const response = await getActivitiesUserParticipantAll(userId)
    //         res.status(200).send(response);
    //     }catch (error) {
    //         if (error instanceof ServerError) {
    //             res.status(500).send({ error: error.message });
    //         } else {
    //             res.status(500).send({ error: 'Erro inesperado. ' });
    //         }
    //     }
    // });

    router.get('/:id/participants', async (req, res) =>{
        const {id} = req.params
        const response = await getParticipantsByActivities(id)
        res.status(200).send(response);
    });


    router.post('/new', async(req: Request, res) =>{

        try{
            const creatorId = res.userId as string
            const {title, description, type, address, scheduledDate, isPrivate} = req.body;
            //const imgUrl = await uploadImage(req.file!)

            const response = await createActivity(creatorId, title, description, isPrivate, scheduledDate)
            res.status(200).send(response);
        }catch(error){
            if (error instanceof ServerError){
                res.status(error.statusCode).send({error: error.message})
                return
            }else{
                res.status(500).send({error: "Erro inesperado. "})
            }
        }
    });

    router.post('/:id/subscribe', async (req: Request, res) =>{

        try{
            const userId = res.userId as string
            const { id } = req.params;
            const response = await createSubscriptionInActivity(userId, id)
            res.status(200).send(response);

        }catch(error){
            if (error instanceof ServerError){
                res.status(error.statusCode).send({error: error.message})
                return
            }else{
                res.status(500).send({error: "Erro inesperado. "})
            }
        }
    });


    router.put('/:id/update', async (req: Request, res)=>{
        try{
            const userId = res.userId as string
            const { id } = req.params;
            const { title, description, type, address, scheduledDate, isPrivate} = req.body;
            //const imgUrl = await uploadImage(req.file!)

            const response = await updateActivities(userId, id, title, description, isPrivate, scheduledDate)
            res.status(200).send(response);
        }catch(error){
            if (error instanceof ServerError){
                res.status(error.statusCode).send({error: error.message})
                return
            }else{
                res.status(500).send({error: "Erro inesperado. "})
            }
        }
    });

    router.put('/:id/conclude', async(req: Request, res)=>{
        try{
            const idCreator = res.userId as string
            const {id} = req.params;

            await concludeActivities(idCreator, id)
            res.status(200).send({message: "Atividade concluída com sucesso"});
        }catch(error){
            if (error instanceof ServerError){
                res.status(error.statusCode).send({error: error.message})
                return
            }else{
                res.status(500).send({error: "Erro inesperado. "})
            }
        }
    }); 

    router.put('/:id/approve', async (req: Request, res)=>{
        try{

        const idUser = res.userId as string
        const { id } = req.params;
        const {participantId, approved} = req.body;
        console.log(req.body)

        await approveParticipants(idUser, participantId, id, approved )
        res.status(200).send({message: "Solicitação de participação aprovada com sucesso. "});
        }catch(error){
            if (error instanceof ServerError){
                res.status(error.statusCode).send({error: error.message})
                return
            }else{
                res.status(500).send({error: "Erro inesperado. "})
            }
        }
    });

    router.put('/:id/check-in', async(req: Request, res)=>{
        try{                                                                                               
            const idUser = res.userId as string
            const { id } = req.params;
            const {confirmationCode} = req.body;
            
            await doCheckin(idUser, id, confirmationCode)
            res.status(200).send({message: "Participação confirmada com sucesso. "})
        }catch(error){
            if (error instanceof ServerError){
                res.status(error.statusCode).send({error: error.message})
                return
            }else{
                res.status(500).send({error: "Erro inesperado. "})
            }
        }
    });

    router.delete('/:id/unsubscribe', async(req, res) =>{
        try{
            const idUser = res.userId as string
            const {id} = req.params;
            await doUnsubscribe(idUser, id)
            res.status(200).send({message: "Participação cancelada com sucesso. "});

        }catch(error){
            if (error instanceof ServerError){
                res.status(error.statusCode).send({error: error.message})
                return
            }else{
                res.status(500).send({error: "Erro inesperado. "})
            }
        }
    });

    router.delete('/:id/delete', async (req, res) =>{
        try{
            const idUser = res.userId as string
            const {id} = req.params;
            await deleteActivities(idUser, id)
            res.status(200).send({message: "Atividade excluída com sucesso. "});

        }catch(error){
            if (error instanceof ServerError){
                res.status(error.statusCode).send({error: error.message})
                return
            }else{
                res.status(500).send({error: "Erro inesperado. "})
            }
        }
    });

    server.use('/activities', router);
}
