"use server";
import { db } from "@/db";
import { user as drizzleUser } from "@/db/schema";
import { userAction } from "@/safe-actions";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const updateImageUserAction = userAction.schema(z.string()).action(async ({ parsedInput, ctx }) => {
    const [updatedUser] = await db.update(drizzleUser).set({ image: parsedInput }).where(eq(drizzleUser.id, ctx.user.id)).returning();

    return {
        data: updatedUser,
    };
});
