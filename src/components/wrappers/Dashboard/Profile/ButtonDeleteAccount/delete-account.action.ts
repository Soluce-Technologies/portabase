"use server"
import {userAction} from "@/safe-actions";
import {prisma} from "@/prisma";
import {z} from "zod";
import {v4 as uuidv4} from "uuid";


export const deleteUserAction = userAction
    .schema(z.string())
    .action(async ({parsedInput, ctx}) => {

        const uuid = uuidv4()

        const user = await prisma.user.update({
            where: {
                id: ctx.user.id,
            },
            data: {
                email: `${uuid}@portabase.com`,
                name: `${uuid}`,
            }
        })

        const account = await prisma.account.findFirst({
            where: {
                userId: ctx.user.id,
            }
        })
        if (account) {
            await prisma.account.delete({
                where: {
                    id: account.id
                }

            })
        }


        return {
            data: user,
        }
    });