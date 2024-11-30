"use server"

import {userAction} from "@/safe-actions";
import {prisma} from "@/prisma";
import {ProjectSchema} from "@/components/wrappers/Project/ProjectForm.schema";
import {z} from "zod";
import {ServerActionResult} from "@/types/action-type";
import {Projects} from "@prisma/client";


export const createProjectAction = userAction
    .schema(
        z.object({
            data: ProjectSchema,
            organizationId: z.string(),
        })
    )
    .action(async ({parsedInput, ctx}): Promise<ServerActionResult<Projects>> => {
        try {

            const project = await prisma.project.create({
                data: {
                    name: parsedInput.data.name,
                    slug: parsedInput.data.slug,
                    organizationId: parsedInput.organizationId,
                }
            })

            for (const db of parsedInput.data.databases) {

                await prisma.database.update({
                    where: {
                        id: db,
                    },
                    data:{
                        projectId: project.id,
                    }
                })
            }

            return {
                success: true,
                value: project,
                actionSuccess: {
                    message: "Project has been successfully created.",
                    messageParams: {projectName: parsedInput.data.name},
                },
            };
        } catch (error) {
            return {
                success: false,
                actionError: {
                    message: "Failed to create Project.",
                    status: 500, // Optional: Use a meaningful status code
                    cause: error instanceof Error ? error.message : "Unknown error",
                    messageParams: {projectName: parsedInput.data.name},
                },
            };
        }


    });