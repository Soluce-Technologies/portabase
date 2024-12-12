"use server"

import {userAction} from "@/safe-actions";
import {prisma} from "@/prisma";
import {ProjectSchema} from "@/components/wrappers/Dashboard/Projects/ProjectsForm/ProjectForm.schema";
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
                    message: "ProjectsForm has been successfully created.",
                    messageParams: {projectName: parsedInput.data.name},
                },
            };
        } catch (error) {
            return {
                success: false,
                actionError: {
                    message: "Failed to create ProjectsForm.",
                    status: 500, // Optional: Use a meaningful status code
                    cause: error instanceof Error ? error.message : "Unknown error",
                    messageParams: {projectName: parsedInput.data.name},
                },
            };
        }


    });


export const updateProjectAction = userAction
    .schema(
        z.object({
            data: ProjectSchema,
            organizationId: z.string(),
            projectId: z.string(),
        })
    )
    .action(async ({parsedInput, ctx}): Promise<ServerActionResult<Projects>> => {
        try {
            const newDatabaseList = parsedInput.data.databases
            const project = await prisma.project.findFirst({
                where:{
                    id: parsedInput.projectId,
                },
                include: {
                    databases : {}
                }
            })
            const existingItemIds = project.databases.map((db) => db.id);

            const databasesToAdd = newDatabaseList.filter(
                (id) => !existingItemIds.includes(id)
            );
            const databasesToRemove = existingItemIds.filter(
                (id) => !newDatabaseList.includes(id)
            );

            console.log(databasesToAdd);
            console.log(databasesToRemove);

            if (databasesToAdd.length > 0) {
                await prisma.database.updateMany({
                    where: {
                        id: { in: databasesToAdd },
                    },
                    data: {
                        projectId: parsedInput.projectId,
                    },
                });
            }

            if (databasesToRemove.length > 0) {
                await prisma.database.updateMany({
                    where: {
                        id: { in: databasesToRemove },
                    },
                    data: {
                        projectId: null,
                    },
                });
            }

            const updatedProject = await prisma.project.update({
                where:{
                    id: parsedInput.projectId
                },
                data:{
                    name: parsedInput.data.name,
                    slug: parsedInput.data.slug,
                }
            })


            return {
                success: true,
                value: updatedProject,
                actionSuccess: {
                    message: "Project has been successfully updated.",
                    messageParams: {projectName: parsedInput.data.name},
                },
            };
        } catch (error) {
            return {
                success: false,
                actionError: {
                    message: "Failed to update project.",
                    status: 500, // Optional: Use a meaningful status code
                    cause: error instanceof Error ? error.message : "Unknown error",
                    messageParams: {projectName: parsedInput.data.name},
                },
            };
        }


    });