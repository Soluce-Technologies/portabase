"use server"
import {userAction} from "@/safe-actions";
import {z} from "zod";
import {ServerActionResult} from "@/types/action-type";
import * as drizzleDb from "@/db";

import {db} from "@/db";
import {and, eq} from "drizzle-orm";
import {Backup, Restoration} from "@/db/schema/07_database";
import {NextResponse} from "next/server";
import {
    deleteFileS3Private,
    deleteLocalPrivate,
    uploadLocalPrivate,
    uploadS3Private
} from "@/features/upload/private/upload.action";
import {env} from "@/env.mjs";

export const deleteRestoreAction = userAction
    .schema(
        z.object({
            restorationId: z.string(),
        })
    )
    .action(async ({parsedInput}): Promise<ServerActionResult<Backup>> => {
        try {
            await db
                .delete(drizzleDb.schemas.restoration)
                .where(and(eq(drizzleDb.schemas.restoration.id, parsedInput.restorationId)))
                .execute();


            return {
                success: true,
                actionSuccess: {
                    message: "Restoration deleted successfully.",
                },
            };

        } catch (error) {
            return {
                success: false,
                actionError: {
                    message: "Failed to delete restoration.",
                    status: 500,
                    cause: error instanceof Error ? error.message : "Unknown error",
                    messageParams: {message: "Error deleting the restoration"},
                },
            };
        }
    });


export const deleteBackupAction = userAction
    .schema(
        z.object({
            backupId: z.string(),
            databaseId: z.string(),
            projectSlug: z.string(),
            file: z.string(),
        })
    )
    .action(async ({parsedInput}): Promise<ServerActionResult<Backup>> => {
        try {

            const [settings] = await db.select().from(drizzleDb.schemas.setting).where(eq(drizzleDb.schemas.setting.name, "system")).limit(1);
            if (!settings) {
                return {
                    success: false,
                    actionError: {
                        message: "No settings found.",
                        status: 404,
                        cause: "No settings found.",
                        messageParams: {message: "Error deleting the backup"},
                    },
                };
            }


            let success: boolean, message: string;

            const result =
                settings.storage === "local"
                    ? await deleteLocalPrivate(parsedInput.file)
                    : await deleteFileS3Private(`${parsedInput.projectSlug}/${parsedInput.file}`, env.S3_BUCKET_NAME!);

            ({success, message} = result);

            if (!success) {
                return {
                    success: false,
                    actionError: {
                        message: message,
                        status: 404,
                        cause: "Unable to delete backup from storage",
                        messageParams: {message: "Error deleting the backup"},
                    },
                };
            }

            await db
                .delete(drizzleDb.schemas.backup)
                .where(and(eq(drizzleDb.schemas.backup.id, parsedInput.backupId), eq(drizzleDb.schemas.backup.databaseId, parsedInput.databaseId)))
                .execute();

            const backupExists = await db
                .select()
                .from(drizzleDb.schemas.backup)
                .where(and(eq(drizzleDb.schemas.backup.id, parsedInput.backupId), eq(drizzleDb.schemas.backup.databaseId, parsedInput.databaseId)))
                .execute();


            if (backupExists.length === 0) {
                return {
                    success: true,
                    actionSuccess: {
                        message: "Backup deleted successfully.",
                    },
                };
            } else {
                return {
                    success: false,
                    actionError: {
                        message: "Backup not found or already deleted.",
                        status: 404,
                        cause: "Backup could not be deleted (from database or remote storage).",
                        messageParams: {message: "Error deleting the backup"},
                    },
                };
            }
        } catch (error) {
            return {
                success: false,
                actionError: {
                    message: "Failed to delete backup.",
                    status: 500,
                    cause: error instanceof Error ? error.message : "Unknown error",
                    messageParams: {message: "Error deleting the backup"},
                },
            };
        }
    });


export const rerunRestorationAction = userAction
    .schema(
        z.object({
            restorationId: z.string(),
        })
    )
    .action(async ({parsedInput}): Promise<ServerActionResult<Restoration>> => {
        try {
            const updateResult = await db
                .update(drizzleDb.schemas.restoration)
                .set({status: "waiting"})
                .where(eq(drizzleDb.schemas.restoration.id, parsedInput.restorationId))
                .returning()
                .execute();

            const updatedRestoration = updateResult[0];

            if (!updatedRestoration) {
                return {
                    success: false,
                    actionError: {
                        message: "Restoration not found.",
                        status: 404,
                        cause: "No restoration with the given ID exists.",
                        messageParams: {message: "Restoration not found"},
                    },
                };
            }

            return {
                success: true,
                value: updatedRestoration,
                actionSuccess: {
                    message: "Restoration has been requeued.",
                    messageParams: {restorationId: updatedRestoration.id},
                },
            };
        } catch (error) {
            return {
                success: false,
                actionError: {
                    message: "Failed to rerun restoration.",
                    status: 500,
                    cause: error instanceof Error ? error.message : "Unknown error",
                    messageParams: {message: "Error updating the restoration"},
                },
            };
        }
    });


// Create Restoration Action (Drizzle version)
export const createRestorationAction = userAction
    .schema(
        z.object({
            backupId: z.string(),
            databaseId: z.string(),
        })
    )
    .action(async ({parsedInput}): Promise<ServerActionResult<Restoration>> => {
        try {
            // Insert new restoration into the database
            const restorationData = await db
                .insert(drizzleDb.schemas.restoration)
                .values({
                    databaseId: parsedInput.databaseId,
                    backupId: parsedInput.backupId,
                    status: "waiting",
                })
                .returning()
                .execute();

            const createdRestoration = restorationData[0];

            return {
                success: true,
                value: createdRestoration,
                actionSuccess: {
                    message: "Restoration has been successfully created.",
                    messageParams: {restorationId: createdRestoration.id},
                },
            };
        } catch (error) {
            return {
                success: false,
                actionError: {
                    message: "Failed to create restoration.",
                    status: 500,
                    cause: error instanceof Error ? error.message : "Unknown error",
                    messageParams: {message: "Error creating the restoration"},
                },
            };
        }
    });
