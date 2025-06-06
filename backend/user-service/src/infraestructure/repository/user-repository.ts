import prisma from '../prisma/prisma-client'


// 1. POST AUTH/REGISTER
export async function saveUser(name: string, email: string, cpf: string, password: string) {
    return await prisma.users.create({
        data:{
            name: name,
            email: email,
            cpf: cpf,
            password: password,
        }
    })
}

// 3. GET USER
export async function getUser(id: string){
    return await prisma.users.findUnique({
        where:{
            id
        }, 

    });
}

// // 4. GET USER/PREFERENCES
// export async function getUserPreferences(userId: string) {
//     const preferencesData = await prisma.preferences.findMany({
//         where:{
//             userId
//         },
//         select: {
//             typesId: {
//                 select: {
//                     id: true,
//                     name: true,
//                     description: true,
//                 },
//             },
//         }, 
//     })
//     return preferencesData.map(item => ({
//         typeId: item.typesId.id,
//         typeName: item.typesId.name,
//         typeDescription: item.typesId.description,
//     }));
    
// }

// // 5. POST USER/PREFERENCES/DEFINE
// export async function definePreferences(typeID: string[], id: string) {

//     const preferencesData = typeID.map((type) => ({
//         userId: id, 
//         typeId: type,  
//     }));

//     await prisma.preferences.createMany({
//         data: preferencesData, 
//     });

// }

// 6 . PUT USER/AVATAR
export async function updateImage(avatar: string, idUser: string) {
    await prisma.users.update({
        data: {
            avatar: avatar, 
        },
        where: {
            id: idUser, 
        },
    });
}

// 7. PUT USER/UPDATE
export async function updateUser(name:string, email: string, password:string, id: string){
    return await prisma.users.update({
        data: {
            name,
            email,
            password,
        },
        where: {
            id
        }
    })
}

//8. DELETE USER/DEACTIVATE
export async function deleteUser(id: string) {
    return await prisma.users.update({
        where: {
            id, 
        },
        data: {
            deletedAt: new Date(), 
        },
    });
}


//VERIFICAÇÕES
export async function getUserByEmail(email: string) {
    return await prisma.users.findUnique({
        where:{
            email
        }
    })
}

export async function getUserByPassword(password: string, userEmail: string) {
    const user = await prisma.users.findUnique({
        where: {
            email: userEmail 
        }
    });


    if (user && user.password === password) {
        return user; 
    } else {
        return null;
    }
}

export async function getUserByCPF(cpf: string) {
    return await prisma.users.findUnique({
        where: {
            cpf: cpf 
        }
    });
}

export async function getDeletedAtById(id: string) {
        const user = await prisma.users.findUnique({
            where: {
                id: id, 
            },
            select: {
                deletedAt: true
            },
        });
            return user ? !!user.deletedAt : false;
    };



// export async function getAchievementsById(userId: string) {
//     const userAchievements = await prisma.userAchievements.findMany({
//         where: {
//             userId: userId,
//         },
//         select: {
//             achievements: {
//                 select: {
//                     name: true,
//                     criterion: true,
//                 },
//             },
//         },
//     });

//     return userAchievements.map(item => ({
//         name: item.achievements.name,
//         criterion: item.achievements.criterion,
//     }));
// }
