import { ServerError } from "../../domain/exceptions/server-error";
import { approveParticipant, hasConfirmed, isApprovedParticipant, saveCheckin, saveSubscriptionInActivity, saveUnsubscribeInActivity, verifyConfirmationCode } from "../../infraestructure/repository/activity-participants-repository";
import {existsActivity, hasConcluded, isPrivateActivity, isTheCreatorAct, isUserInActivity } from "../../infraestructure/repository/activity-repository";


// 10. POST/ACTIVITIES/ID/SUBSCRIBE
export async function createSubscriptionInActivity(idUser: string, idActivity: string) {

    
    const isConcluded = await hasConcluded(idActivity)

    if(isConcluded){
        throw new ServerError("E12- Não é possível se inscrever em uma atividade concluída. ", 404)
    }

    const subscribed = await isUserInActivity(idUser, idActivity);

    if(subscribed){
        throw new ServerError("E7- Você já se registrou nessa atividade", 409)
    }

    const existsAct = await existsActivity(idActivity)
    if(!existsAct){
        throw new ServerError("Atividade não encontrada. ", 404)
    }

    const isCreator = await isTheCreatorAct(idUser, idActivity);

    if(isCreator){
        throw new ServerError("E8- O criador de uma atividade não pode se inscrever como um participante", 400)
    }

    let approved = true
    if(await isPrivateActivity(idActivity)){
        approved = false
    }

    const subscription = await saveSubscriptionInActivity(idUser, idActivity, approved);

    const response = {
        id: subscription.id,
        subscriptionStatus: subscription.approved ? "APPROVED" : "NOT_APPROVED",
        confirmedAt: subscription.confirmedAt,
        activityId: subscription.activityId,
        userId: subscription.userId
    }

    return response
    
}

//13. PUT ACTIVITIES/ID/APPROVE
export async function approveParticipants(idCreator: string, participantId: string, activityId: string, approved: boolean ) {

    const isCreator = await isTheCreatorAct(idCreator, activityId)
    if(!isCreator){
        throw new ServerError("E16 - apenas o criador da atividade pode aprovar ou negar participantes", 401)
    }

    const existsAct = await existsActivity(activityId)

    if(!existsAct){
        throw new ServerError("Atividade não encontrada. ", 404)
    }

    const existParticipant = await isUserInActivity(participantId, activityId)
    
    if(!existParticipant){
        throw new ServerError("Participante não encontrado", 404)
    }

    const isPrivate = await isPrivateActivity(activityId)

    if(!isPrivate){
        throw new ServerError("Você só pode permitir a participação do usuário em atividades privadas", 401)
    }
    
    return await approveParticipant(participantId, activityId, approved)
}


//14. PUT ACTIVITIES/ID/CHECKIN
export async function doCheckin( idUser: string, idActivity: string, confirmationCode: string ) {

    const isConcluded = await hasConcluded(idActivity)

    if(isConcluded){
        throw new ServerError("E13- Não é possível confirmar presença em uma atividade concluída. ", 404)
    }

    const isUser = await isUserInActivity(idUser, idActivity)

    if(!isUser){
        throw new ServerError("Você não se inscreveu nessa atividade", 400)
    }

    const existsAct = await existsActivity(idActivity)
    if(!existsAct){
        throw new ServerError("ID de atividade inválido. ", 400)
    }
    
    const isApproved = await isApprovedParticipant(idUser, idActivity)

    if(!isApproved){
        throw new ServerError ("E9 - Apenas participantes aprovados na atividade podem fazer check-in", 401)
    }

    const confCode = await verifyConfirmationCode(idUser, idActivity, confirmationCode)
    if(!confCode){
        throw new ServerError("E10 - Codigo de confirmação incorreto", 400)
    }

    const isPreviousConfirmed = await hasConfirmed(idUser, idActivity)
    if (isPreviousConfirmed){
        throw new ServerError("E11- Você já confirmou suas participação nessa atividade", 400)
    }

    //void addAchievement(idUser, 'Check-in na Atividade', idActivity);
    return await saveCheckin(idUser, idActivity)

}


//15. PUT ACTIVITIES/ID/UNSUBSCRIBE
export async function doUnsubscribe(idUser: string, idActivity: string) {

    const existsAct = await existsActivity(idActivity)
    if(!existsAct){
        throw new ServerError("Atividade não encontrada. ", 404)
    }
    const hasSubsciption = await isUserInActivity(idUser, idActivity)

    if(!hasSubsciption){
        throw new ServerError("Você não se inscreveu nessa atividade", 400)
    }

    const isConfirmed = await hasConfirmed(idUser, idActivity)

    if(isConfirmed){
        throw new ServerError("E18 - Não é possível cancelar sua inscrição pois sua presença já foi confirmada", 401)
    }

    return await saveUnsubscribeInActivity(idUser, idActivity)
}