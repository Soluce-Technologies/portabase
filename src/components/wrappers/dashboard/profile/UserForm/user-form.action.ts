"use server";
import { userAction } from "@/safe-actions";
import { z } from "zod";
import { UserSchema } from "@/components/wrappers/dashboard/profile/UserForm/user-form.schema";
import { db } from "@/db";
import { user as drizzleUser } from "@/db/schema";
import { eq } from "drizzle-orm";

export const updateUserAction = userAction
    .schema(
        z.object({
            id: z.string(),
            data: UserSchema,
        })
    )
    .action(async ({ parsedInput }) => {
        const [updatedUser] = await db.update(drizzleUser).set(parsedInput.data).where(eq(drizzleUser.id, parsedInput.id)).returning();

        return {
            data: updatedUser,
        };
    });
