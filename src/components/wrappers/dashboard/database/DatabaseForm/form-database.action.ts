"use server";

import { z } from "zod";
import { userAction } from "@/safe-actions";
import { db } from "@/db";
import { database } from "@/db/schema";
import { eq } from "drizzle-orm";
import { DatabaseSchema } from "@/components/wrappers/dashboard/database/DatabaseForm/form-database.schema";

export const updateDatabaseAction = userAction
    .schema(
        z.object({
            id: z.string(),
            data: DatabaseSchema,
        })
    )
    .action(async ({ parsedInput }) => {
        const [updated] = await db.update(database).set(parsedInput.data).where(eq(database.id, parsedInput.id)).returning().execute();

        return updated;
    });
