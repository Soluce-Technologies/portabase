"use server";
import { userAction } from "@/safe-actions";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/db";
import { user as drizzleUser } from "@/db/schema";
import { eq } from "drizzle-orm";

export const deleteUserAction = userAction.schema(z.string()).action(async ({ parsedInput, ctx }) => {
    const userId = parsedInput.length > 0 ? parsedInput : ctx.user.id;
    const uuid = uuidv4();

    const [updatedUser] = await db
        .update(drizzleUser)
        .set({
            email: `${uuid}@portabase.com`,
            name: `${uuid}`,
            //deleted: true,
            //todo: add deleted
        })
        .where(eq(drizzleUser.id, userId))
        .returning();

    return {
        data: updatedUser,
    };
});
