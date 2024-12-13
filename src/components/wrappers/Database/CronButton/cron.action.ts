"use server"
import {userAction} from "@/safe-actions";
import {z} from "zod";
import {prisma} from "@/prisma";


export const updateDatabaseBackupPolicyAction = userAction
    .schema(
        z.object({
                databaseId: z.string(),
                backupPolicy: z.string(),
            }
        )
    )
    .action(async ({parsedInput, ctx}) => {
        const cronPolicy = parsedInput.backupPolicy == "" ? null : parsedInput.backupPolicy

        const updatedDatabase = await prisma.database.update({
            where: {
                id: parsedInput.databaseId,
            },
            data: {
                backupPolicy: cronPolicy,
            }
        })
        return {
            data: updatedDatabase,
        }
    })


