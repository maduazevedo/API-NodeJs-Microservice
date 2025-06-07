import prisma from '../prisma/prisma-client'


// 1. POST auth/register
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

// 2. GET user
export async function getUser(id: string){
    return await prisma.users.findUnique({
        where:{
            id
        }, 

    });
}

// 3 . PUT user/avatar
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

// 4. PUT user/update
export async function updateUser(name:string, email: string, cpf: string, password:string, id: string){
    return await prisma.users.update({
        data: {
            name,
            email,
            cpf,
            password,
        },
        where: {
            id
        }
    })
}

//5. DELETE user/deactivate
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
