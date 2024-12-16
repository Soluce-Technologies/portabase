"use server"

import {z} from "zod";

import {userAction} from "@/safe-actions";
import {prisma} from "@/prisma";
import {ServerActionResult} from "@/types/action-type";
import {Backup} from "@prisma/client";


export const backupButtonAction = userAction
    .schema(z.string())
    .action(async ({ parsedInput, ctx }): Promise<ServerActionResult<Backup>> => {
        try {
            const backup = await prisma.backup.create({
                data: {
                    databaseId: parsedInput,
                    status: "waiting",
                },
            });

            return {
                success: true,
                value: backup,
                actionSuccess: {
                    message: "Backup has been successfully created.",
                    messageParams: { databaseId: parsedInput },
                },
            };
        } catch (error) {
            console.error("Error creating backup:", error);

            return {
                success: false,
                actionError: {
                    message: "Failed to create backup.",
                    status: 500,
                    cause: error instanceof Error ? error.message : "Unknown error",
                    messageParams: { databaseId: parsedInput },
                },
            };
        }
    });