"use server"
import {baseAuth} from "@/auth/auth";
import {User} from "@prisma/client";
import {prisma} from "@/prisma";

export const currentUser = async () => {
    const session = await baseAuth();
    if (!session?.user) {
        return null;
    }
    return session.user as User;
}


export const requiredCurrentUser = async () => {
    const user = await currentUser();
    if (!user) {
        return null
    }

    const userDb = await prisma.user.findFirst({
        where: {id: user.id},
    })
    if(!userDb){
        return null
    }

    return user;
}
