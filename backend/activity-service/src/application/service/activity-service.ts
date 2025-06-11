import { application } from "express";
import { ServerError } from "../../domain/exceptions/server-error";
import { findAllByFilterTypeAndOrder, findActivitiesUserCreator, findActivitiesUserCreatorAll, findActivitiesUserParticipantAll, deleteActivity, existsActivity, hasConcluded, isTheCreatorAct, updateActivity, conlcudeActivity, findActivitiesUserParticipant, saveActivity } from "../../infraestructure/repository/activity-repository";
const { v4: uuidv4 } = require('uuid')



// 1. GET/ACTIVITIES
export async function getByPaginatedFilterTypeAndOrder( userId: string, orderBy?: string, order?: 'asc' | 'desc') {

    const result = await findAllByFilterTypeAndOrder(userId, orderBy, order);


        const response = result.activities.map((activity: any) => ({
            
            id: activity.id,
            title: activity.title,
            description: activity.description,
            type: activity.type,
            confirmationCode: activity.confirmationCode,
            scheduledDate: activity.scheduledDate,
            createdAt: activity.createdAt,
            completedAt: activity.completedAt,
            private: activity.isPrivate,    
            creatorId: activity.idCreator,
        }));
        console.log(response)
    
        return {
            activities: response
        };
    
}

// 2. GET/ACTIVITIES/ALL
export async function getAllByFilterTypeAndOrder( userId: string, type?: string, orderBy?: string, order?: 'asc' | 'desc') {

        const result = await findAllByFilterTypeAndOrder(userId, orderBy, order);

        const response = result.activities.map((activity: any) => ({
            id: activity.id,
            title: activity.title,
            description: activity.description,
            type: activity.type,
            confirmationCode: activity.confirmationCode,
            scheduledDate: activity.scheduledDate,
            createdAt: activity.createdAt,
            completedAt: activity.completedAt,
            private: activity.isPrivate,
        }));
    
        return {
            activities: response
        };
    
}

// 3. GET/ACTIVITIES/USER/CREATOR
export async function getActivitiesUserCreator(creatorId: string, page: number, pageSize: number) {

    const result = await findActivitiesUserCreator(creatorId, page, pageSize);

    const response = result.activities.map((activity: any) => ({
        id: activity.id,
        title: activity.title,
        description: activity.description,
        type: activity.type,
        confirmationCode: activity.confirmationCode,
        scheduledDate: activity.scheduledDate,
        createdAt: activity.createdAt,
        completedAt: activity.completedAt,
        private: activity.isPrivate,

    }));

    return {
        page: result.page,
        pageSize: result.pageSize,
        totalActivities: result.totalActivities,
        totalPages: result.totalPages,
        previous: result.previous,
        next: result.next,
        activities: response
    };
}


// 4. GET/ACTIVITIES/USER/CREATOR/ALL
export async function getActivitiesUserCreatorAll(userId: string){

    const result = await findActivitiesUserCreatorAll(userId)
    
    const response = result.map((activity: any) => ({
        id: activity.id,
        title: activity.title,
        description: activity.description,
        type: activity.type,
        confirmationCode: activity.confirmationCode,
        scheduledDate: activity.scheduledDate,
        createdAt: activity.createdAt,
        completedAt: activity.completedAt,
        private: activity.isPrivate,

    }));

    return response   

}

// 5. GET/ACTIVITIES/USER/PARTICIPANT
export async function getActivitiesUserParticipant(userId: string, page: number, pageSize: number) {

    const result = await findActivitiesUserParticipant(userId, page, pageSize);

    const response = result.activities.map((activity: any) => ({
        id: activity.id,
        title: activity.title,
        description: activity.description,
        type: activity.type,
        scheduledDate: activity.scheduledDate,
        createdAt: activity.createdAt,
        completedAt: activity.completedAt,
        private: activity.isPrivate,

    }));

    return {
        page: result.page,
        pageSize: result.pageSize,
        totalActivities: result.totalActivities,
        totalPages: result.totalPages,
        previous: result.previous,
        next: result.next,
        activities: response
    };
}


// 6. POST/ACTIVITIES/NEW
export async function createActivity(idCreator: string, title: string, description: string, type: number, isPrivate: string, scheduledDate: string) {


    const isPrivateRaw: boolean = isPrivate === "true";
    const scheduledDateRaw: Date = new Date(scheduledDate);
    const confirmationCode = uuidv4();
    const createdAt = new Date()


        const activity = await saveActivity( idCreator, title, description, type, isPrivateRaw, scheduledDateRaw, createdAt, confirmationCode);
        
        const response = {
            id: activity.id,
            title: activity.title,
            description: activity.description,
            type: activity.type,
            scheduledDate: activity.scheduledDate,
            createdAt: activity.createdAt,
            completedAt: activity.completedAt,
            private: activity.isPrivate,
            creator: activity.creatorId
        }

        return response
}

//7. PUT ACTIVITIES/ID/UPDATE
export async function updateActivities(idCreator: string, idActivity: string,  title: string, description: string, isPrivate: string, scheduledDate: string) {
    
    const existsAct = await existsActivity(idActivity)
    if(!existsAct){
        throw new ServerError("Atividade não encontrada. ", 404)
    }
    
    const isCreator = await isTheCreatorAct(idCreator, idActivity)

    if(!isCreator){
        throw new ServerError("E14 - Apenas o criador da atividade é capaz de editá-la. ", 400);
    }
    
    const isPrivateRaw: boolean = isPrivate === "true";
    const scheduledDateRaw: Date = new Date(scheduledDate);

    try {

        const activity = await updateActivity( idActivity, title, description, scheduledDateRaw, isPrivateRaw);
        
        const response = {
            id: activity.id,
            title: activity.title,
            description: activity.description,
            type: activity.type,
            scheduledDate: activity.scheduledDate,
            createdAt: activity.createdAt,
            completedAt: activity.completedAt,
            private: activity.isPrivate,
        }
        return response

    } catch (error) {
        
        throw new ServerError("Erro ao criar a atividade ou o endereço.", 500);
    }

}

//8. PUT ACTIVITIES/ID/CONLUDE
export async function concludeActivities(idCreator: string, idActivity: string) {

    const existsAct = await existsActivity(idActivity)
    if(!existsAct){
        throw new ServerError("Atividade não encontrada. ", 404)
    }

    const isCreator = await isTheCreatorAct(idCreator, idActivity)
    if(!isCreator){
        throw new ServerError("E17 - Apenas o criador da atividade é capaz de concluí-la. ", 400);
    }

    const isConcluded = await hasConcluded(idActivity)
    if (isConcluded){
        throw new ServerError("Você já concluiu esta atividade", 400)
    }

    return await conlcudeActivity(idActivity)
    
}

//9. PUT ACTIVITIES/ID/DELETE
export async function deleteActivities(idCreator: string, idActivity: string) {

    const existsAct = await existsActivity(idActivity)
    if(!existsAct){
        throw new ServerError("Atividade não encontrada. ", 404)
    }

    const isCreator = await isTheCreatorAct(idCreator, idActivity)
    if(!isCreator){
        throw new ServerError("E15 - Apenas o criador da atividade é capaz de excluí-la. ", 400);
    }

    return await deleteActivity(idActivity)
}