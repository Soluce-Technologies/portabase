"use server";

import { userAction } from "@/safe-actions";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { ServerActionResult } from "@/types/action-type";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { project } from "@/db/schema";

export const deleteProjectAction = userAction.schema(z.string()).action(async ({ parsedInput }): Promise<ServerActionResult<typeof project.$inferSelect>> => {
    try {
        const uuid = uuidv4();

        const updatedProjects = await db
            .update(project)
            .set({
                isArchived: true,
                slug: uuid,
            })
            .where(eq(project.id, parsedInput))
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
                messageParams: { projectId: parsedInput },
            },
        };
    } catch (error) {
        return {
            success: false,
            actionError: {
                message: "Failed to archive Projects.",
                status: 500,
                cause: error instanceof Error ? error.message : "Unknown error",
                messageParams: { projectId: parsedInput },
            },
        };
    }
});
