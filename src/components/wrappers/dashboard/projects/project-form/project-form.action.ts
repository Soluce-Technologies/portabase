"use server";

import { userAction } from "@/safe-actions";
import { ProjectSchema } from "@/components/wrappers/dashboard/projects/project-form/project-form.schema";
import { z } from "zod";
import { ServerActionResult } from "@/types/action-type";
import { db } from "@/db";
import { eq, inArray } from "drizzle-orm";
import {Project} from "@/db/schema/05_project";
import * as drizzleDb from "@/db";
import {Database} from "@/db/schema/06_database";
import {slugify} from "@/utils/slugify";

export const createProjectAction = userAction
    .schema(
        z.object({
            data: ProjectSchema,
            organizationId: z.string(),
        })
    )
    .action(async ({ parsedInput }): Promise<ServerActionResult<Project>> => {
        try {
            const slug = slugify(parsedInput.data.name);
            const [createdProject] = await db
                .insert(drizzleDb.schemas.project)
                .values({
                    name: parsedInput.data.name,
                    slug: slug,
                    organizationId: parsedInput.organizationId,
                })
                .returning();

            if (parsedInput.data.databases.length > 0) {
                await db.update(drizzleDb.schemas.database).set({ projectId: createdProject.id }).where(inArray(drizzleDb.schemas.database.id, parsedInput.data.databases));
            }

            return {
                success: true,
                value: createdProject,
                actionSuccess: {
                    message: "Project has been successfully created.",
                    messageParams: { projectName: parsedInput.data.name },
                },
            };
        } catch (error) {
            return {
                success: false,
                actionError: {
                    message: "Failed to create project.",
                    status: 500,
                    cause: error instanceof Error ? error.message : "Unknown error",
                    messageParams: { projectName: parsedInput.data.name },
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
    .action(async ({ parsedInput }): Promise<ServerActionResult<Project>> => {
        try {
            const existing = await db.query.project.findFirst({
                where: eq(drizzleDb.schemas.project.id, parsedInput.projectId),
                with: {
                    databases: true,
                },
            });

            if (!existing) {
                throw new Error("Project not found.");
            }

            const existingDbIds = existing.databases.map((db: Database) => db.id);
            const newDbIds = parsedInput.data.databases;

            const databasesToAdd = newDbIds.filter((id) => !existingDbIds.includes(id));
            const databasesToRemove = existingDbIds.filter((id: string) => !newDbIds.includes(id));

            if (databasesToAdd.length > 0) {
                await db.update(drizzleDb.schemas.database).set({ projectId: parsedInput.projectId }).where(inArray(drizzleDb.schemas.database.id, databasesToAdd));
            }

            if (databasesToRemove.length > 0) {
                await db.update(drizzleDb.schemas.database).set({ projectId: null }).where(inArray(drizzleDb.schemas.database.id, databasesToRemove));
            }
            // const slug = slugify(parsedInput.data.name);

            const [updatedProject] = await db
                .update(drizzleDb.schemas.project)
                .set({
                    name: parsedInput.data.name,
                    // slug: slug,
                })
                .where(eq(drizzleDb.schemas.project.id, parsedInput.projectId))
                .returning();

            return {
                success: true,
                value: updatedProject,
                actionSuccess: {
                    message: "Project has been successfully updated.",
                    messageParams: { projectName: parsedInput.data.name },
                },
            };
        } catch (error) {
            return {
                success: false,
                actionError: {
                    message: "Failed to update project.",
                    status: 500,
                    cause: error instanceof Error ? error.message : "Unknown error",
                    messageParams: { projectName: parsedInput.data.name },
                },
            };
        }
    });
