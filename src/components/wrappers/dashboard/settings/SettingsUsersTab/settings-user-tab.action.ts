"use server"
import {userAction} from "@/safe-actions";
import {z} from "zod";
import {prisma} from "@/prisma";


export const updateUserOrganizationAction = userAction
    .schema(
        z.object({
                id: z.string(),
                role: z.string(),
            }
        )
    )
    .action(async ({parsedInput, ctx}) => {
        const updatedUserOrganization = await prisma.userOrganization.update({
            where: {
                id: parsedInput.id,
            },
            data: {
                role: parsedInput.role,
            },
        })
        return {
            data: updatedUserOrganization,

        }
    })


