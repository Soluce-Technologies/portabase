"use server";

import { userAction } from "@/safe-actions";
import { z } from "zod";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import * as drizzleDb from "@/db";

export const updateDatabaseBackupPolicyAction = userAction
    .schema(
        z.object({
            databaseId: z.string(),
            backupPolicy: z.string(),
        })
    )
    .action(async ({ parsedInput }) => {
        const cronPolicy = parsedInput.backupPolicy === "" ? null : parsedInput.backupPolicy;

        const [updated] = await db
            .update(drizzleDb.schemas.database)
            .set({
                backupPolicy: cronPolicy,
            })
            .where(eq(drizzleDb.schemas.database.id, parsedInput.databaseId))
            .returning()
            .execute();

        return {
            data: updated,
        };
    });
