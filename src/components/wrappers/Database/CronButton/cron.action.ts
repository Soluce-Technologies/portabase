"use server"
import {userAction} from "@/safe-actions";
import {z} from "zod";
import {prisma} from "@/prisma";


export const updateBackupPolicyAction = userAction
    .schema(
        z.object({
                databaseId: z.string(),
                backupPolicy: z.string(),
            }
        )
    )
    .action(async ({parsedInput, ctx}) => {
        const updatedDatabase = await prisma.database.update({
            where: {
                id: parsedInput.databaseId,
            },
            data: {
                backupPolicy: parsedInput.backupPolicy,
            }
        })
        return {
            data: updatedDatabase,
        }
    })


