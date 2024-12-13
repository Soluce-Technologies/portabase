"use server"
import {userAction} from "@/safe-actions";
import {prisma} from "@/prisma";
import {z} from "zod";
import {v4 as uuidv4} from "uuid";
import {EmailFormSchema} from "@/components/wrappers/Dashboard/admin/AdminEmailTab/EmailForm/email-form.schema";


export const deleteUserAction = userAction
    .schema(z.string())
    .action(async ({parsedInput, ctx}) => {
        const userId = parsedInput.length > 0 ? parsedInput : ctx.user.id;

        const uuid = uuidv4()

        const user = await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                email: `${uuid}@portabase.com`,
                name: `${uuid}`,
                deleted: true
            }
        })

        const account = await prisma.account.findFirst({
            where: {
                userId: userId,
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

