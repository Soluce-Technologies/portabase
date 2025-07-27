"use server";
import { userAction } from "@/safe-actions";
import { z } from "zod";
import { EmailFormSchema } from "@/components/wrappers/dashboard/admin/admin-email-tab/email-form/email-form.schema";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import * as drizzleDb from "@/db";

export const updateEmailSettingsAction = userAction
    .schema(
        z.object({
            name: z.string(),
            data: EmailFormSchema,
        })
    )
    .action(async ({ parsedInput }) => {
        const { name, data } = parsedInput;

        const [updatedSettings] = await db
            .update(drizzleDb.schemas.setting)
            .set({
                ...data,
            })
            .where(eq(drizzleDb.schemas.setting.name, name))
            .returning();

        return {
            data: updatedSettings,
        };
    });
