"use server"
import {userAction} from "@/safe-actions";
import {z} from "zod";
import {prisma} from "@/prisma";


export const updateImageUserAction = userAction
    .schema(z.string())
    .action(async ({parsedInput, ctx}) => {

        const user = await prisma.user.update({
            where: {
                id: ctx.user.id,
            },
            data: {
                image: parsedInput,
            }
        })


        return {
            data: user,
        }
    });