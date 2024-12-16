"use server"
import {userAction} from "@/safe-actions";
import {z} from "zod";
import {prisma} from "@/prisma";
import {UserSchema} from "@/components/wrappers/dashboard/Profile/UserForm/user-form.schema";

export const updateUserAction = userAction
    .schema(
        z.object({
                id: z.string(),
                data: UserSchema,
            }
        )
    )
    .action(async ({parsedInput, ctx}) => {
        const updatedUser = await prisma.user.update({
            where: {
                id: parsedInput.id,
            },
            data: parsedInput.data,
        })
        return {
            data: updatedUser,

        }
    })
