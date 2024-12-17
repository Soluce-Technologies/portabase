"use server"
import {userAction} from "@/safe-actions";
import {z} from "zod";
import {v4 as uuidv4} from "uuid";
import {prisma} from "@/prisma";
import {ServerActionResult} from "@/types/action-type";
import {Projects} from "@prisma/client";


export const deleteProjectAction = userAction
    .schema(z.string())
    .action(async ({parsedInput, ctx}): Promise<ServerActionResult<Projects>>  => {

        try {
            const uuid = uuidv4()

            const project = await prisma.project.update({
                where: {
                    id: parsedInput
                },
                data:{
                    isArchived: true,
                    slug: uuid
                }
            })

            return {
                success: true,
                value: project,
                actionSuccess: {
                    message: "Projects has been successfully archived.",
                    messageParams: {projectName: parsedInput.data.name},
                },
            };
        } catch (error) {
            return {
                success: false,
                actionError: {
                    message: "Failed to archived Projects.",
                    status: 500, // Optional: Use a meaningful status code
                    cause: error instanceof Error ? error.message : "Unknown error",
                    messageParams: {projectName: parsedInput.data.name},
                },
            };
        }

    });
