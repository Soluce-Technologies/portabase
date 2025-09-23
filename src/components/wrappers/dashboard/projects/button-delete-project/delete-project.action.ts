"use server";

import {userAction} from "@/lib/safe-actions/actions";
import {z} from "zod";
import {v4 as uuidv4} from "uuid";
import {ServerActionResult} from "@/types/action-type";
import {and, eq} from "drizzle-orm";
import {db} from "@/db";
import * as drizzleDb from "@/db";

export const deleteProjectAction = userAction.schema(z.string()).action(async ({parsedInput}): Promise<ServerActionResult<typeof drizzleDb.schemas.project.$inferSelect>> => {
    try {
        const uuid = uuidv4();
        await db
            .update(drizzleDb.schemas.database)
            .set({
                projectId: null,
            })
            .where(eq(drizzleDb.schemas.database.projectId, parsedInput));

        const updatedProjects = await db
            .update(drizzleDb.schemas.project)
            .set({
                isArchived: true,
                slug: uuid,
            })
            .where(eq(drizzleDb.schemas.project.id, parsedInput))
            .returning();

        const updatedProject = updatedProjects[0];

        if (!updatedProject) {
            throw new Error("Project not found or update failed");
        }


        return {
            success: true,
            value: updatedProject,
            actionSuccess: {
                message: "Projects has been successfully archived.",
                messageParams: {projectId: parsedInput},
            },
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            actionError: {
                message: "Failed to archive Projects.",
                status: 500,
                cause: error instanceof Error ? error.message : "Unknown error",
                messageParams: {projectId: parsedInput},
            },
        };
    }
});
