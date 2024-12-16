"use server"

import {z} from "zod";

import {userAction} from "@/safe-actions";
import {prisma} from "@/prisma";
import {DatabaseSchema} from "@/components/wrappers/dashboard/database/DatabaseForm/form-database.schema";


export const updateDatabaseAction = userAction
    .schema(
        z.object({
                id: z.string(),
                data: DatabaseSchema,
            }
        )
    )
    .action(async ({parsedInput, ctx}) => {
        return prisma.database.update({
            where: {
                id: parsedInput.id,
            },
            data: parsedInput.data,
        });
    })
