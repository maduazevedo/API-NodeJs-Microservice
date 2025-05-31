import prisma from '../prisma/prisma-client'

export async function getActivitiesByParticipant(userId: string) {
    const activities = await prisma.activityParticipants.findMany({
        where: {
            userId: userId,  
        },
        select: {
            activitysId: {
                select: {
                    id: true,
                    title: true,
                    description: true,
                    //type: true,
                    //image: true,
                    _count: {
                        select: {
                            ActivityParticipants: true 
                        }
                    }, 
                    // ActivityAddresses: {
                    //     select: {
                    //         latitude: true,
                    //         longitude: true
                    //     }
                    // },
                    scheduledDate: true,
                    createdAt: true,
                    completedAt: true,
                    isPrivate: true,
                    creators: {
                        select: {
                            id: true,
                            name: true,
                            //avatar: true
                        }
                    },
                }, 
            },
            approved: true 
        }
    })

    return activities.map((item: { activitysId: any; approved: boolean }) => ({
        ...item.activitysId, 
        subscriptionStatus: item.approved ? "APPROVED" : "NOT_APPROVED"
    }));
}

// 10. POTS/ACTIVITIES/ID/SUBSCRIBE
export async function saveSubscriptionInActivity(userId: string, activityId: string, approved: boolean) {

    const inscricao = await prisma.activityParticipants.create({
        data:{
            userId: userId,
            activityId: activityId,
            approved: approved
        }
    })

    return inscricao 
}

//13. PUT/ACTIVITIES/ID/APPROVE
export async function approveParticipant(userId: string, activityId: string, approved: boolean) {

    const participant = await prisma.activityParticipants.findFirst({
        where: {
            userId: userId,
            activityId: activityId
        }
    });

    if (!participant) {
        throw new Error('Participante não encontrado na atividade.');
    }

    const updatedParticipant = await prisma.activityParticipants.update({
        where: {
            id: participant.id  
        },
        data: {
            approved: approved, 
        },
    });

    return updatedParticipant;  
}

// 14. PUT/ACTIVITIES/ID/CHECKIN
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


// 15. DELETE/ACTIVITIES/ID/UNSUBSCRIBE
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

export async function isApprovedParticipant(userId: string, activityId: string) {
        const participant = await prisma.activityParticipants.findFirst({
            where: {
                userId: userId,
                activityId: activityId,
                approved: true, 
            },
        });
        return participant ? true : false;

}

export async function verifyConfirmationCode(userId: string, activityId: string, providedCode: string) {
    const participant = await prisma.activityParticipants.findFirst({
        where: {
            userId: userId,
            activityId: activityId,
        },
        include: {
            activitysId: {
                select: {
                    confirmationCode: true,  
                },
            },
        },
    });

    return participant?.activitysId.confirmationCode === providedCode;
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
