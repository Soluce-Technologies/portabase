"use server";

import { userAction } from "@/safe-actions";
import { z } from "zod";
import { db } from "@/db";
import { S3FormSchema, StorageSwitchSchema } from "@/components/wrappers/dashboard/admin/AdminStorageTab/StorageS3Form/s3-form.schema";
import { eq } from "drizzle-orm";
import * as drizzleDb from "@/db";

export const updateS3SettingsAction = userAction
    .schema(
        z.object({
            name: z.string(),
            data: S3FormSchema,
        })
    )
    .action(async ({ parsedInput }) => {
        const { name, data } = parsedInput;

        const [updatedSettings] = await db
            .update(drizzleDb.schemas.setting)
            .set({ ...data })
            .where(eq(drizzleDb.schemas.setting.name, name))
            .returning();

        return {
            data: updatedSettings,
        };
    });

export const updateStorageSettingsAction = userAction
    .schema(
        z.object({
            name: z.string(),
            data: StorageSwitchSchema,
        })
    )
    .action(async ({ parsedInput }) => {
        const { name, data } = parsedInput;

        const [updatedSettings] = await db
            .update(drizzleDb.schemas.setting)
            .set({ ...data })
            .where(eq(drizzleDb.schemas.setting.name, name))
            .returning();

        return {
            data: updatedSettings,
        };
    });
