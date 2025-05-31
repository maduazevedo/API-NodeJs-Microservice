import { application } from "express";
import { ServerError } from "../../domain/exceptions/server-error";
import { findAllByFilterTypeAndOrder, findActivitiesUserCreator, findActivitiesUserCreatorAll, findActivitiesUserParticipantAll, deleteActivity, existsActivity, hasConcluded, isTheCreatorAct, updateActivity, findParticipantsByActivity, saveActivity, conlcudeActivity, findActivitiesUserParticipant } from "../../infraestructure/repository/activity-repository";
const { v4: uuidv4 } = require('uuid')


// // 1. GET/ACTIVITIES/TYPES
// export async function getActivitiesTypes() {

//     const response = await findActivityTypes();

//     return response
    
// }

// 2. GET/ACTIVITIES
export async function getByPaginatedFilterTypeAndOrder( userId: string, orderBy?: string, order?: 'asc' | 'desc') {

    const result = await findAllByFilterTypeAndOrder(userId, orderBy, order);


        const response = result.activities.map((activity: any) => ({
            
            id: activity.id,
            title: activity.title,
            description: activity.description,
            type: activity.type,
            image: activity.image,
            confirmationCode: activity.confirmationCode,
            participantCount: activity._count.ActivityParticipants,
            address: {
                latitude: activity.ActivityAddresses?.latitude,
                longitude: activity.ActivityAddresses?.longitude
            },
            scheduledDate: activity.scheduledDate,
            createdAt: activity.createdAt,
            completedAt: activity.completedAt,
            private: activity.isPrivate,
            creator: {
                id: activity.creators.id,
                name: activity.creators.name,
                avatar: activity.creators.avatar
            }
    
        }));
        console.log(response)
    
        return {
            activities: response
        };
    
}

// 3. GET/ACTIVITIES/ALL
export async function getAllByFilterTypeAndOrder( userId: string, typeId?: string, orderBy?: string, order?: 'asc' | 'desc') {

        const result = await findAllByFilterTypeAndOrder(userId, orderBy, order);

        const response = result.activities.map((activity: any) => ({
            id: activity.id,
            title: activity.title,
            description: activity.description,
            type: activity.type,
            image: activity.image,
            confirmationCode: activity.confirmationCode,
            participantCount: activity._count.ActivityParticipants,
            address: {
                latitude: activity.ActivityAddresses?.latitude,
                longitude: activity.ActivityAddresses?.longitude
            },
            scheduledDate: activity.scheduledDate,
            createdAt: activity.createdAt,
            completedAt: activity.completedAt,
            private: activity.isPrivate,
            creator: {
                id: activity.creators.id,
                name: activity.creators.name,
                avatar: activity.creators.avatar
            }
    
        }));
    
        return {
            activities: response
        };
    
}

// 4. GET/ACTIVITIES/USER/CREATOR
export async function getActivitiesUserCreator(creatorId: string, page: number, pageSize: number) {

    const result = await findActivitiesUserCreator(creatorId, page, pageSize);

    const response = result.activities.map((activity: any) => ({
        id: activity.id,
        title: activity.title,
        description: activity.description,
        type: activity.type,
        image: activity.image,
        confirmationCode: activity.confirmationCode,
        participantCount: activity._count.ActivityParticipants,
        address: {
            latitude: activity.ActivityAddresses?.latitude,
            longitude: activity.ActivityAddresses?.longitude
        },
        scheduledDate: activity.scheduledDate,
        createdAt: activity.createdAt,
        completedAt: activity.completedAt,
        private: activity.isPrivate,
        creator: {
            id: activity.creators.id,
            name: activity.creators.name,
            avatar: activity.creators.avatar
        }

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


// 5. GET/ACTIVITIES/USER/CREATOR/ALL
export async function getActivitiesUserCreatorAll(userId: string){

    const result = await findActivitiesUserCreatorAll(userId)
    
    const response = result.map((activity: any) => ({
        id: activity.id,
        title: activity.title,
        description: activity.description,
        type: activity.type,
        image: activity.image,
        confirmationCode: activity.confirmationCode,
        participantCount: activity._count.ActivityParticipants,
        address: {
            latitude: activity.ActivityAddresses?.latitude,
            longitude: activity.ActivityAddresses?.longitude
        },
        scheduledDate: activity.scheduledDate,
        createdAt: activity.createdAt,
        completedAt: activity.completedAt,
        private: activity.isPrivate,
        creator: {
            id: activity.creators.id,
            name: activity.creators.name,
            avatar: activity.creators.avatar
        }

    }));

    return response   

}

// 6. GET/ACTIVITIES/USER/PARTICIPANT
export async function getActivitiesUserParticipant(userId: string, page: number, pageSize: number) {

    const result = await findActivitiesUserParticipant(userId, page, pageSize);

    const response = result.activities.map((activity: any) => ({
        id: activity.id,
        title: activity.title,
        description: activity.description,
        type: activity.type,
        image: activity.image,
        participantCount: activity._count.ActivityParticipants,
        address: {
            latitude: activity.ActivityAddresses?.latitude,
            longitude: activity.ActivityAddresses?.longitude
        },
        scheduledDate: activity.scheduledDate,
        createdAt: activity.createdAt,
        completedAt: activity.completedAt,
        private: activity.isPrivate,
        creator: {
            id: activity.creators.id,
            name: activity.creators.name,
            avatar: activity.creators.avatar
        }

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

// 7. GET/ACTIVITIES/USER/PARTICIPANT/ALL
export async function getActivitiesUserParticipantAll(userId: string){

    const result = await findActivitiesUserParticipantAll(userId)

    const response = result.map((activity: any) => ({
        id: activity.id,
        title: activity.title,
        description: activity.description,
        type: activity.type,
        image: activity.image,
        participantCount: activity._count.ActivityParticipants,
        address: {
            latitude: activity.ActivityAddresses?.latitude,
            longitude: activity.ActivityAddresses?.longitude
        },
        scheduledDate: activity.scheduledDate,
        createdAt: activity.createdAt,
        completedAt: activity.completedAt,
        private: activity.isPrivate,
        creator: {
            id: activity.creators.id,
            name: activity.creators.name,
            avatar: activity.creators.avatar
        },
        userSubscriptionStatus: activity.subscriptionStatus

    }));

    return response
}

// 8. GET/ACTIVITIES/ID/PARTICIPANTS
export async function getParticipantsByActivities(activityId: string) {

    const existsAct = await existsActivity(activityId)
    if(!existsAct){
        throw new ServerError("Atividade não encontrada. ", 404)
    }

    const response = await findParticipantsByActivity(activityId)

    return response   
}

// 9. POST/ACTIVITIES/NEW
export async function createActivity(idCreator: string, title: string, description: string, isPrivate: string, scheduledDate: string) {


    // //const existsType = await existsTypeActivity(type);
    // if (!existsType) {
    //     throw new ServerError("E24 - O id informado é inválido. ", 400)
    // }

    // const regex = /\.(jpg|png)$/i;
    // const result = regex.test(image);

    // if (!result) {
    //     throw new ServerError("E2 - A imagem deve ser um arquivo PNG ou JPG.", 400);
    // }

    const isPrivateRaw: boolean = isPrivate === "true";
    const scheduledDateRaw: Date = new Date(scheduledDate);
    const confirmationCode = uuidv4();
    const createdAt = new Date()

    try {

        const activity = await saveActivity( idCreator, title, description,scheduledDateRaw, createdAt, isPrivateRaw, confirmationCode);

        // const {latitude, longitude} = await verifyAddress(address) 

        // const newAddress = await createAddress(activity.id, latitude, longitude);

        // void addAchievement(idCreator, "Criar Atividade")
        
        const response = {
            id: activity.id,
            title: activity.title,
            description: activity.description,
            type: activity.type,
            image: activity.image,
            // address: {
            //     latitude: newAddress.latitude,
            //     longitude: newAddress.longitude,
            // },
            scheduledDate: activity.scheduledDate,
            createdAt: activity.createdAt,
            completedAt: activity.completedAt,
            private: activity.isPrivate,
            creator: activity.creators
        }

        return response
        
    } catch (error) {

        throw new ServerError("Erro ao criar endereço.", 500);
    }
}

//11. PUT ACTIVITIES/ID/UPDATE
export async function updateActivities(idCreator: string, idActivity: string,  title: string, description: string, isPrivate: string, scheduledDate: string) {
    
    const existsAct = await existsActivity(idActivity)
    if(!existsAct){
        throw new ServerError("Atividade não encontrada. ", 404)
    }
    
    const isCreator = await isTheCreatorAct(idCreator, idActivity)

    if(!isCreator){
        throw new ServerError("E14 - Apenas o criador da atividade é capaz de editá-la. ", 400);
    }

    // const existsType = await existsTypeActivity(type);
    // if (!existsType) {
    //     throw new ServerError("E24 - O id informado é inválido. ", 400)
    // }

    // const regex = /\.(jpg|png)$/i;
    // const result = regex.test(image);

    // if (!result) {
    //     throw new ServerError("E2 - A imagem deve ser um arquivo PNG ou JPG.", 400);
    // }
    
    const isPrivateRaw: boolean = isPrivate === "true";
    const scheduledDateRaw: Date = new Date(scheduledDate);

    try {

        const activity = await updateActivity( idActivity, title, description, scheduledDateRaw, isPrivateRaw);
        
        // const {latitude, longitude} = await verifyAddress(address)

        // const newAddress = await updateAddress(activity.id, latitude, longitude);
        

        const response = {
            id: activity.id,
            title: activity.title,
            description: activity.description,
            type: activity.type,
            image: activity.image,
            //address: newAddress,
            scheduledDate: activity.scheduledDate,
            createdAt: activity.createdAt,
            completedAt: activity.completedAt,
            private: activity.isPrivate,
            creator: activity.creators
        }
        return response

    } catch (error) {
        
        throw new ServerError("Erro ao criar a atividade ou o endereço.", 500);
    }

}

//12. PUT ACTIVITIES/ID/CONLUDE
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

//16. PUT ACTIVITIES/ID/DELETE
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






