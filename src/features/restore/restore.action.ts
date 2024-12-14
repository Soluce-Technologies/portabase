"use server"

import {userAction} from "@/safe-actions";
import {z} from "zod";
import {prisma} from "@/prisma";
import {ServerActionResult} from "@/types/action-type";
import {Restoration} from "@prisma/client";


export const createRestorationAction = userAction
    .schema(z.object({
        backupId: z.string(),
        databaseId: z.string(),
    }))
    .action(async ({parsedInput, ctx}): Promise<ServerActionResult<Restoration>> => {

        try {
            const restoration = await prisma.restoration.create({
                data: {
                    databaseId: parsedInput.databaseId,
                    backupId: parsedInput.backupId,
                    status: "waiting",
                },
            });

            return {
                success: true,
                value: restoration,
                actionSuccess: {
                    message: "Restoration has been successfully created.",
                    messageParams: { restorationId: restoration.id },
                },
            };
        } catch (error) {
            console.error("Error creating restoration:", error);
            return {
                success: false,
                actionError: {
                    message: "Failed to create backup.",
                    status: 500,
                    cause: error instanceof Error ? error.message : "Unknown error",
                    messageParams: { message: "Error creating the restoration" },
                },
            };
        }



    });
