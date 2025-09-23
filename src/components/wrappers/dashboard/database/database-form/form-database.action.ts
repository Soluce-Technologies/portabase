"use server";

import { z } from "zod";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { DatabaseSchema } from "@/components/wrappers/dashboard/database/database-form/form-database.schema";
import * as drizzleDb from "@/db";
import {userAction} from "@/lib/safe-actions/actions";
import {Database} from "@/db/schema/07_database";

export const updateDatabaseAction = userAction
    .schema(
        z.object({
            id: z.string(),
            data: DatabaseSchema,
        })
    )
    .action(async ({ parsedInput }) => {
        const [updated] = await db.update(drizzleDb.schemas.database).set(parsedInput.data).where(eq(drizzleDb.schemas.database.id, parsedInput.id)).returning().execute();

        return updated;
    });
