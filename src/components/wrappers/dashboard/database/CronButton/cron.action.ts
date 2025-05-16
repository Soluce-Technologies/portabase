"use server";

import { userAction } from "@/safe-actions";
import { z } from "zod";
import { db } from "@/db";
import { database } from "@/db/schema";
import { eq } from "drizzle-orm";

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
            .update(database)
            .set({
                backupPolicy: cronPolicy,
            })
            .where(eq(database.id, parsedInput.databaseId))
            .returning()
            .execute();

        return {
            data: updated,
        };
    });
