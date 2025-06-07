import prisma from '../prisma/prisma-client'


// 1 . GET/ACTIVITIES/ALL

export async function findAllByFilterTypeAndOrder(userId: string, orderBy?: string, order?: 'asc' | 'desc') {


    const whereClause: any = {
        completedAt: null,
        deletedAt: null
    };
    

    const validOrder = order === 'asc' || order === 'desc' ? order : 'asc';
    const validOrderBy = ['scheduledDate', 'title', 'createdAt'].includes(orderBy || '') ? orderBy : 'scheduledDate';
    const orderByClause = { [validOrderBy as string]: validOrder };


    const activities = await prisma.activities.findMany({
        where: whereClause,
        orderBy: orderByClause,
    });

    return { activities };
}

    
//2. GET ACTIVITIES/USER/CREATOR//ALL
export async function findActivitiesUserCreatorAll(userId: string) {

    const activities = await prisma.activities.findMany({
        where: {
            creatorId: userId, deletedAt: null
        },
        select: {
            id: true,            
            title: true,          
            description: true,    
            type: true,                     
            confirmationCode: true, 
            scheduledDate: true,  
            createdAt: true,      
            completedAt: true,  
            isPrivate: true,     
        },
        
    });

    return activities;
}


// 3. GET ACTIVITIES/USER/PARTICIPANT/ALL
export async function findActivitiesUserParticipantAll(userId: string) {

    const activities = await prisma.activityParticipants.findMany({
        where: {
            userId: userId,
        },
        select: {
            activity: {
                select: {
                    id: true,
                    title: true,
                    description: true,
                    type: true,
                    scheduledDate: true,
                    createdAt: true,
                    completedAt: true,
                    isPrivate: true,
                }, 
            },
        },
    })
}


// 4. POST ACTIVITIES/NEW
export async function saveActivity(creatorId: string, title: string, description: string, type: number,  Isprivate: boolean, scheduledDate: Date, createdAt: Date, confirmationCode: string) {
    const activity = await prisma.activities.create({

        data: {       
            title: title,          
            description: description,         
            type: type,
            scheduledDate,   
            createdAt,        
            isPrivate : Isprivate,       
            confirmationCode, 
            creatorId: creatorId, 
        }, 
    });

    return activity;

}

// 5. GET ACTIVITUES/USER/CREATOR
export async function findActivitiesUserCreator(creatorId: string, page: number, pageSize: number) {
    const skip = (page - 1) * pageSize;


    const totalActivities = await prisma.activities.count({where: { creatorId }
    });

    const totalPages = Math.ceil(totalActivities / pageSize);

    const previous = page > 1 ? page - 1 : null;
    const next = page < totalPages ? page + 1 : null;

    const activities = await prisma.activities.findMany({
        where: { creatorId, deletedAt: null },
        skip,
        take: pageSize,
    });

        return {  
            page, pageSize,  
            totalActivities, totalPages,  
            previous, next,  
            activities
        };
    } 
    
// 6. GET ACTIVITIES/USER/PARTICIPANT
export async function findActivitiesUserParticipant(userId: string, page: number, pageSize: number) {
    const skip = (page - 1) * pageSize;

    const totalActivities = await prisma.activityParticipants.count({
        where: { userId: userId }  
    });

    const totalPages = Math.ceil(totalActivities / pageSize);

    const previous = page > 1 ? page - 1 : null;
    const next = page < totalPages ? page + 1 : null;

    const activities = await prisma.activities.findMany({
        where: { 
            deletedAt: null,
            ActivityParticipants: {
                some: {
                    userId: userId, 
                },
            },
        },
        skip,
        take: pageSize,

    });

    return {
        page,
        pageSize,
        totalActivities,
        totalPages,
        previous,
        next,
        activities
    };
}


// 7. PUT ACTIVITIES/ID/UPDATE
export async function updateActivity( idActivity: string, title: string, description: string, scheduledDate: Date, isPrivate: boolean){

    const updatedActivity = await prisma.activities.update({
        where: { id: idActivity },
        data: {
            title: title,          
            description: description,     
            scheduledDate,     
            isPrivate : isPrivate      
        },
    });

    return updatedActivity;
}

// 8. PUT ACTIVITIES/ID/CONCLUDE
export async function conlcudeActivity(activityId: string) {

    const updatedActivity = await prisma.activities.update({
        where: {
            id: activityId,  
        },
        data: {
            completedAt: new Date(), 
        },
    });

    return updatedActivity
}

// 9. DELETE /ACTIVITIES/ID/DELETE
export async function deleteActivity(idActivity: string) {

    const activity = await prisma.activities.findUnique({
        where: { id: idActivity }
    });

    if (!activity) {
        throw new Error("Activity not found.");
    }

    const currentDate = new Date();

    const updatedActivity = await prisma.activities.update({
        where: { id: idActivity },
        data: { deletedAt: currentDate }
    });

    return updatedActivity; 
}


//VERIFICAÇÕES

// export async function existsTypeActivity(type: string): Promise<boolean> {
//     const typeActivity = await prisma.activityTypes.findUnique({
//         where: {
//             id: type
//         }
//     });

//     return typeActivity !== null;  
// }

export async function existsActivity(idActivity: string){
    const typeActivity = await prisma.activities.findUnique({
        where: {
            id: idActivity
        }
    });

    return typeActivity !== null;  
}

export async function isUserInActivity(userId: string, activityId: string){
    const participant = await prisma.activityParticipants.findFirst({
        where: {
            userId: userId,      
            activityId: activityId 
        }
    });

    if (participant) {
        return participant; 
    }

    return participant ? true : false; 
}

export async function isPrivateActivity(idActivity: string): Promise<boolean> {
    const activity = await prisma.activities.findUnique({
        where: { id: idActivity },
        select: { isPrivate: true }
    });

    return activity!.isPrivate; 
}


export async function isTheCreatorAct(idUser: string, idActivity: string){
    const activity = await prisma.activities.findFirst({
        where: {
        id: idActivity,      
        creatorId: idUser,    
        },
    });

    return activity !== null;
}

export async function hasConcluded(idActivity: string) {

    const activity = await prisma.activities.findFirst({
        where: {
            id: idActivity
        },
    });
    
    if (activity && activity.completedAt) {
        return true; 
    }
    return false; 
}
export async function hasDeleted(idActivity: string) {

    const activity = await prisma.activities.findFirst({
        where: {
            id: idActivity
        },
    });
    
    if (activity && activity.deletedAt) {
        return true; 
    }
    return false; 
}



