"use server"

import {userAction} from "@/safe-actions";
import {prisma} from "@/prisma";
import {ProjectSchema} from "@/components/wrappers/project/ProjectForm.schema";


export const createProjectAction = userAction
    .schema(ProjectSchema)
    .action(async ({parsedInput, ctx}) => {
        // Verify if slug already exist
        // await verifySlugUniqueness(parsedInput.slug);

        console.log("ctx", ctx)
        return prisma.project.create({
            data: {
                ...parsedInput,
            }
        });

    });