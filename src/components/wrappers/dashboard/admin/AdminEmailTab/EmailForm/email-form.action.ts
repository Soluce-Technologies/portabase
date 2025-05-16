"use server";
import { userAction } from "@/safe-actions";
import { z } from "zod";
import { EmailFormSchema } from "@/components/wrappers/dashboard/admin/AdminEmailTab/EmailForm/email-form.schema";
import { setting as drizzleSetting } from "@/db/schema";
import { eq } from "drizzle-orm";
import { db } from "@/db";

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
            .update(drizzleSetting)
            .set({
                ...data,
            })
            .where(eq(drizzleSetting.name, name))
            .returning();

        return {
            data: updatedSettings,
        };
    });
