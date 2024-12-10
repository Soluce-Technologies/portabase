"use server"
import {userAction} from "@/safe-actions";
import {z} from "zod";
import {prisma} from "@/prisma";
import {ServerActionResult} from "@/types/action-type";
import {Restauration} from "@prisma/client";


export const createRestaurationAction = userAction
    .schema(z.object({
        backupId: z.string(),
        databaseId: z.string(),
    }))
    .action(async ({parsedInput, ctx}): Promise<ServerActionResult<Restauration>> => {

        try {
            const restauration = await prisma.restauration.create({
                data: {
                    databaseId: parsedInput.databaseId,
                    backupId: parsedInput.backupId,
                    status: "waiting",
                },
            });

            return {
                success: true,
                value: restauration,
                actionSuccess: {
                    message: "Restauration has been successfully created.",
                    messageParams: { restaurationId: restauration.id },
                },
            };
        } catch (error) {
            console.error("Error creating restauration:", error);
            return {
                success: false,
                actionError: {
                    message: "Failed to create backup.",
                    status: 500,
                    cause: error instanceof Error ? error.message : "Unknown error",
                    messageParams: { message: "Error creating the restauration" },
                },
            };
        }



    });
