import prisma from '../prisma/prisma-client'


// 1. POTS/ACTIVITIES/ID/SUBSCRIBE
export async function saveSubscriptionInActivity(userId: string, activityId: string, approved: boolean) {

    const inscricao = await prisma.activityParticipants.create({
        data:{
            userId: userId,
            activityId: activityId,
        }
    })

    return inscricao 
}


// 2. PUT/ACTIVITIES/ID/CHECKIN
export async function saveCheckin(idUser: string, idActivity: string) {

    const participant = await prisma.activityParticipants.findFirst({
        where: {
            userId: idUser,
            activityId: idActivity
        }
    });


    const currentDate = new Date(); 

    const updatedParticipant = await prisma.activityParticipants.update({
        where: {
            id: participant!.id 
        },
        data: {
            confirmedAt: currentDate, 
        },
    });

    return updatedParticipant; 
}


// 3. DELETE/ACTIVITIES/ID/UNSUBSCRIBE
export async function saveUnsubscribeInActivity(iduser: string, idActivity: string) {
    const participant = await prisma.activityParticipants.findFirst({
        where: {
            userId: iduser,
            activityId: idActivity
        }
    });

    if (participant) {
        await prisma.activityParticipants.delete({
            where: {
                id: participant.id
            }
        });
    }
}

//VERIFICAÇÕES


export async function verifyConfirmationCode(userId: string, activityId: string, providedCode: string) {
    const participant = await prisma.activityParticipants.findFirst({
        where: {
            userId: userId,
            activityId: activityId,
        },
        include: {
            activity: {
                select: {
                    confirmationCode: true,  
                },
            },
        },
    });

    return participant?.activity.confirmationCode === providedCode;
}


export async function hasConfirmed(idUser: string, idActivity: string) {

    const participant = await prisma.activityParticipants.findFirst({
        where: {
            userId: idUser,
            activityId: idActivity
        }
    });
    
    if (participant && participant.confirmedAt) {
        return true; 
    }
    return false; 
}
